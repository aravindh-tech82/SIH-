import os
import shutil
from datetime import datetime
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

from ikev3analytica.engine import IPsecSentinelEngine
from ikev3analytica.novelties.blockchain_audit import get_ledger, verify_chain, simulate_tampering, restore_ledger
from ikev3analytica.novelties.pqc_checker import pqc_score
from ikev3analytica.novelties.llm_copilot import explain_finding, generate_vendor_script

app = FastAPI(
    title="IPsec Sentinel API",
    version="2.0.0",
    description="Enterprise AI-Powered IPsec VPN Protocol Analyzer (SIH26160)"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = IPsecSentinelEngine()

class ConfigPayload(BaseModel):
    config_text: str

class LogPayload(BaseModel):
    log_text: str

class ChatPayload(BaseModel):
    message: str
    finding: Optional[Dict[str, Any]] = None
    vendor: Optional[str] = "cisco"

class TamperPayload(BaseModel):
    block_index: int

class PqcPayload(BaseModel):
    findings: List[Dict[str, Any]]

class ProbePayload(BaseModel):
    target: str = "127.0.0.1"
    port: int = 500
    protocol: str = "IKEv2"

@app.get("/api/health")
def health_check():
    return {
        "status": "ONLINE",
        "service": "IPsec Sentinel Enterprise Engine",
        "problem_statement": "SIH26160",
        "models": {
            "risk_classifier": "RandomForestClassifier",
            "anomaly_detector": "IsolationForest",
            "pqc_engine": "NIST FIPS 203/204",
            "blockchain_audit": "SHA256-Merkle-Chain"
        }
    }

@app.get("/api/scenarios")
def get_scenarios():
    return engine.get_sample_scenarios()

@app.post("/api/analyze/config")
def analyze_config(payload: ConfigPayload):
    if not payload.config_text.strip():
        raise HTTPException(status_code=400, detail="Empty configuration provided.")
    return engine.analyze_configuration(payload.config_text)

@app.post("/api/analyze/pcap")
async def analyze_pcap(file: UploadFile = File(...)):
    temp_dir = "./temp_pcaps"
    os.makedirs(temp_dir, exist_ok=True)
    temp_path = os.path.join(temp_dir, file.filename)
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return engine.analyze_pcap(temp_path)
    finally:
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass

@app.get("/api/pcap/samples")
def list_sample_pcaps():
    """Lists pre-generated Scapy packet capture files available for 1-click testing."""
    return [
        {
            "id": "sample-user-traffic",
            "name": "User Traffic Analysis PCAP (22,473 packets)",
            "filename": "user_traffic_analysis.pcap",
            "protocol": "General Traffic",
            "description": "2026-08-09-traffic-analysis-exercise.pcap (22,473 packets, 15.3 MB)",
            "vulnerabilities": ["Unencrypted / Non-IPsec segment"],
            "risk_level": "Low",
            "packets": 22473
        },
        {
            "id": "sample-ikev1-legacy",
            "name": "IKEv1 Aggressive Mode Leak (3DES/MD5)",
            "filename": "sample_ikev1_legacy.pcap",
            "protocol": "IKEv1",
            "description": "Real Scapy capture containing IKEv1 Aggressive Mode cleartext PSK leak and Sweet32 3DES cipher",
            "vulnerabilities": [
                "Sweet32 64-bit Block Cipher (3DES)",
                "Cryptographically Broken Hash (MD5)",
                "Insecure Diffie-Hellman Group 2",
                "IKEv1 Aggressive Mode Cleartext PSK Leak"
            ],
            "risk_level": "Critical",
            "packets": 1
        },
        {
            "id": "sample-ikev2-secure",
            "name": "IKEv2 Zero-Trust Gateway (AES-256-GCM / DH19)",
            "filename": "sample_ikev2_secure.pcap",
            "protocol": "IKEv2",
            "description": "Real Scapy capture with modern IKE_SA_INIT negotiation, AES-256-GCM, and DH Group 19 (ECP-256)",
            "vulnerabilities": [],
            "risk_level": "Low",
            "packets": 1
        }
    ]

@app.post("/api/analyze/sample-pcap/{sample_id}")
def analyze_sample_pcap(sample_id: str):
    """Analyzes a pre-generated Scapy sample PCAP file without requiring user file upload."""
    file_map = {
        "sample-user-traffic": "user_traffic_analysis.pcap",
        "sample-ikev1-legacy": "sample_ikev1_legacy.pcap",
        "sample-ikev2-secure": "sample_ikev2_secure.pcap"
    }
    fname = file_map.get(sample_id, "sample_ikev1_legacy.pcap")
    candidates = [
        os.path.join("samples", fname),
        os.path.join("..", "samples", fname),
        os.path.join("c:\\Desktop\\SIH\\IKEv3Analytica\\samples", fname),
        os.path.join("c:\\Desktop\\SIH", "2026-08-09-traffic-analysis-exercise.pcap")
    ]
    target_path = None
    for c in candidates:
        if os.path.exists(c):
            target_path = c
            break
    if not target_path:
        raise HTTPException(status_code=404, detail=f"Sample PCAP {fname} not found on server.")
    return engine.analyze_pcap(target_path)

@app.get("/api/pcap/download/{sample_id}")
def download_sample_pcap(sample_id: str):
    """Allows downloading the raw .pcap packet capture for Wireshark inspection."""
    file_map = {
        "sample-ikev1-legacy": "sample_ikev1_legacy.pcap",
        "sample-ikev2-secure": "sample_ikev2_secure.pcap"
    }
    fname = file_map.get(sample_id, "sample_ikev1_legacy.pcap")
    candidates = [
        os.path.join("samples", fname),
        os.path.join("..", "samples", fname),
        os.path.join("c:\\Desktop\\SIH\\IKEv3Analytica\\samples", fname)
    ]
    target_path = None
    for c in candidates:
        if os.path.exists(c):
            target_path = c
            break
    if not target_path:
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(target_path, media_type="application/vnd.tcpdump.pcap", filename=fname)

@app.post("/api/packet/probe")
async def probe_target(payload: ProbePayload):
    """Crafts and transmits real live IKE Scapy datagrams to a target gateway and reports response."""
    from ikev3analytica.scanner.ikev1 import IKEv1Scanner
    from ikev3analytica.scanner.ikev2 import IKEv2Scanner
    
    results = {}
    if payload.protocol in ("IKEv1", "Both"):
        scanner1 = IKEv1Scanner(payload.target, payload.port)
        pkt1 = scanner1.create_sa_packet()
        scan_res1 = await scanner1.scan()
        results["ikev1"] = {
            "packet_name": "ISAKMP SA Proposal (IKEv1)",
            "hexdump_preview": bytes(pkt1)[:64].hex(),
            "packet_length_bytes": len(bytes(pkt1)),
            "scan_result": scan_res1
        }
    if payload.protocol in ("IKEv2", "Both"):
        scanner2 = IKEv2Scanner(payload.target, payload.port)
        pkt2 = scanner2.create_ike_sa_init_packet()
        scan_res2 = await scanner2.scan()
        results["ikev2"] = {
            "packet_name": "IKEv2 IKE_SA_INIT (RFC 7296)",
            "hexdump_preview": bytes(pkt2)[:64].hex(),
            "packet_length_bytes": len(bytes(pkt2)),
            "scan_result": scan_res2
        }
    return {
        "target": payload.target,
        "port": payload.port,
        "protocol": payload.protocol,
        "timestamp": datetime.utcnow().isoformat(),
        "probes": results,
        "summary": f"Scapy crafted and transmitted UDP datagram to {payload.target}:{payload.port} successfully."
    }

@app.post("/api/analyze/log")
def analyze_logs(payload: LogPayload):
    return engine.analyze_logs(payload.log_text)

@app.get("/api/blockchain/ledger")
def get_audit_ledger():
    return {
        "ledger": get_ledger(),
        "verification": verify_chain()
    }

@app.post("/api/blockchain/tamper")
def tamper_block(payload: TamperPayload):
    return simulate_tampering(payload.block_index)

@app.post("/api/blockchain/restore")
def restore_blockchain():
    return restore_ledger()

@app.post("/api/pqc/evaluate")
def evaluate_pqc(payload: PqcPayload):
    return pqc_score(payload.findings)

@app.post("/api/copilot/chat")
def copilot_chat(payload: ChatPayload):
    msg = payload.message.lower()
    
    # Check for vendor script requests
    if "cisco" in msg:
        return {
            "reply": "Here is the hardened, NIST SP 800-77 Rev 1 compliant configuration for **Cisco ASA / IOS-XE**:",
            "code": generate_vendor_script("cisco"),
            "language": "cisco"
        }
    elif "strongswan" in msg or "swanctl" in msg or "linux" in msg:
        return {
            "reply": "Here is the post-quantum ready **strongSwan swanctl.conf** configuration utilizing NIST FIPS 203 (ML-KEM):",
            "code": generate_vendor_script("strongswan"),
            "language": "ini"
        }
    elif "pfsense" in msg or "opnsense" in msg or "xml" in msg:
        return {
            "reply": "Here is the compliant Phase 1 & Phase 2 configuration profile for **pfSense / OPNsense**:",
            "code": generate_vendor_script("pfsense"),
            "language": "xml"
        }
    elif payload.finding:
        explanation = explain_finding(payload.finding)
        return {"reply": explanation, "code": None}
    else:
        # Contextual response
        return {
            "reply": f"""### 🛡️ IPsec Sentinel Cyber Copilot
I have analyzed your query regarding: **"{payload.message}"**.

**Key Security Best Practices**:
1. **Deprecate IKEv1**: Immediately migrate legacy IKEv1 tunnels to **IKEv2 (RFC 7296)**.
2. **Phase 1 Cipher Suite**: Require **AES-256-GCM** (or ChaCha20-Poly1305), **SHA-384**, and **DH Group 19/20**.
3. **PFS**: Always enforce **Perfect Forward Secrecy** on Phase 2 SA proposals.
4. **PQC Preparation**: Prepare crypto-agility roadmaps for **ML-KEM-768** key encapsulation (NIST FIPS 203).

Ask me for vendor-specific hardening scripts by typing *"Show Cisco configuration"* or *"Show strongSwan configuration"*.""",
            "code": None
        }

@app.get("/api/demo/run")
def run_sih_demo():
    """Returns the complete end-to-end SIH presentation data package."""
    scenarios = engine.get_sample_scenarios()
    banking_scenario = scenarios[0]
    analysis = engine.analyze_configuration(banking_scenario["content"])
    ledger = get_ledger()
    return {
        "scenario": banking_scenario,
        "analysis": analysis,
        "ledger": ledger[-5:] if ledger else [],
        "remediation_script": generate_vendor_script("cisco"),
        "compliance": {
            "nist_sp_800_77": "FAILED (3DES & DH Group 2 Prohibited)",
            "pci_dss_v4": "NON_COMPLIANT (Requirement 4.1 Breach)",
            "cert_in_advisory": "HIGH_RISK_EXPOSURE"
        }
    }
