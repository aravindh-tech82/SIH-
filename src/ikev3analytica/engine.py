import time
from typing import Dict, Any, List

from ikev3analytica.parsers.config_parser import IPsecConfigParser
from ikev3analytica.parsers.pcap_parser import IPsecPcapParser
from ikev3analytica.parsers.log_parser import VPNLogParser
from ikev3analytica.ml.risk_classifier import IPsecRiskClassifier
from ikev3analytica.ml.anomaly_detector import VPNAnomalyDetector
from ikev3analytica.novelties.pqc_checker import pqc_score
from ikev3analytica.novelties.blockchain_audit import log_report, get_ledger, verify_chain, simulate_tampering, restore_ledger
from ikev3analytica.novelties.llm_copilot import explain_finding, generate_vendor_script

class IPsecSentinelEngine:
    """Enterprise AI-Powered Security Engine for IPsec Sentinel (SIH26160)."""

    def __init__(self):
        self.risk_classifier = IPsecRiskClassifier()
        self.anomaly_detector = VPNAnomalyDetector()

    def analyze_configuration(self, config_text: str) -> Dict[str, Any]:
        """Performs full end-to-end audit of an IPsec configuration file."""
        parsed = IPsecConfigParser.parse(config_text)
        return self._evaluate_and_anchor(parsed)

    def analyze_pcap(self, filepath: str) -> Dict[str, Any]:
        """Performs full deep-packet analysis on a PCAP capture."""
        parsed = IPsecPcapParser.parse_pcap(filepath)
        return self._evaluate_and_anchor(parsed)

    def analyze_logs(self, log_text: str) -> Dict[str, Any]:
        """Analyzes VPN authentication, rekey, and negotiation logs."""
        log_res = VPNLogParser.parse_logs(log_text)
        anomaly_res = self.anomaly_detector.evaluate_tunnel({
            "rekey_rate_per_hour": log_res["rekey_events"],
            "failure_rate_pct": (log_res["auth_failures"] / max(1, log_res["total_lines_analyzed"])) * 100,
            "packet_size_stddev": 145.0,
            "entropy_score": 6.8 if log_res["threat_detected"] else 7.85
        })
        return {**log_res, "anomaly_assessment": anomaly_res}

    def _evaluate_and_anchor(self, base_analysis: Dict[str, Any]) -> Dict[str, Any]:
        # 1. Vulnerability Detection
        vulnerabilities = []
        ciphers = [str(c).upper() for c in base_analysis.get("encryption", [])]
        hashes = [str(h).upper() for h in base_analysis.get("integrity", [])]
        dh_groups = [str(d).upper() for d in base_analysis.get("dh_groups", [])]

        if "3DES" in ciphers or any("3DES" in c for c in ciphers):
            vulnerabilities.append({
                "issue": "Sweet32 64-bit Block Cipher (3DES)",
                "cve": "CVE-2016-2183",
                "cvss": 7.5,
                "severity": "High",
                "layer": "Phase 1 & Phase 2",
                "impact": "Plaintext recovery via birthday collision attack over 32GB traffic.",
                "remediation": "Replace with AES-256-GCM."
            })

        if "DES" in ciphers or any(c == "DES" for c in ciphers):
            vulnerabilities.append({
                "issue": "Legacy 56-bit DES Encryption",
                "cve": "CVE-1999-0524",
                "cvss": 9.8,
                "severity": "Critical",
                "layer": "Phase 1 & Phase 2",
                "impact": "Exhaustive key search feasible within hours using cloud compute.",
                "remediation": "Migrate to AES-256-GCM immediately."
            })

        if any("MD5" in h for h in hashes):
            vulnerabilities.append({
                "issue": "Cryptographically Broken Hash (MD5)",
                "cve": "CVE-2004-2761",
                "cvss": 7.4,
                "severity": "High",
                "layer": "Integrity / Authentication",
                "impact": "Hash collision vulnerability allowing rogue packet injection.",
                "remediation": "Upgrade to SHA-256 or SHA-384."
            })

        if any("SHA1" in h or "SHA-1" in h for h in hashes):
            vulnerabilities.append({
                "issue": "Weak Collision-Prone Hash (SHA-1)",
                "cve": "CVE-2005-4900",
                "cvss": 5.9,
                "severity": "Medium",
                "layer": "Integrity / Authentication",
                "impact": "SHAttered chosen-prefix collision susceptibility.",
                "remediation": "Upgrade to SHA-256 or SHA-384."
            })

        if any("GROUP 1" in d or "GROUP 2" in d or "GROUP 5" in d for d in dh_groups):
            vulnerabilities.append({
                "issue": "Insecure Diffie-Hellman Group (< 2048-bit)",
                "cve": "CVE-2015-4000",
                "cvss": 8.2,
                "severity": "High",
                "layer": "Key Exchange (IKE)",
                "impact": "Logjam discrete-log precomputation attack allows session key decryption.",
                "remediation": "Upgrade to DH Group 14 (2048-bit) or Group 19/20 (ECDH)."
            })

        if base_analysis.get("aggressive_mode"):
            vulnerabilities.append({
                "issue": "IKEv1 Aggressive Mode Active",
                "cve": "CVE-2002-1623",
                "cvss": 8.6,
                "severity": "Critical",
                "layer": "IKE Phase 1",
                "impact": "Cleartext transmission of pre-shared key hash; vulnerable to offline dictionary attack.",
                "remediation": "Disable Aggressive Mode, migrate to IKEv2 or enforce Main Mode with certificate authentication."
            })

        if base_analysis.get("pfs") in (False, "Disabled", "disabled"):
            vulnerabilities.append({
                "issue": "Missing Perfect Forward Secrecy (PFS)",
                "cve": "CWE-327",
                "cvss": 5.3,
                "severity": "Medium",
                "layer": "Phase 2 ESP SA",
                "impact": "Compromise of long-term private keys compromises all past and future recorded sessions.",
                "remediation": "Enable PFS (pfs group19 / set pfs enable)."
            })

        # 2. AI Risk Classification & Posture Scoring
        ml_prediction = self.risk_classifier.predict(base_analysis)

        # 3. Tunnel Anomaly Baseline Detection
        anomaly_assessment = self.anomaly_detector.evaluate_tunnel({
            "rekey_rate_per_hour": 1.2,
            "failure_rate_pct": 2.0 if ml_prediction["risk_level"] in ("Low", "Medium") else 14.5,
            "packet_size_stddev": 135.0,
            "entropy_score": 7.85 if ml_prediction["risk_level"] == "Low" else 6.7
        })

        # 4. Post-Quantum Readiness Assessment
        pqc_inputs = []
        for c in base_analysis.get("encryption", []):
            pqc_inputs.append({"algorithm": c})
        for d in base_analysis.get("dh_groups", []):
            pqc_inputs.append({"algorithm": d})
        for h in base_analysis.get("integrity", []):
            pqc_inputs.append({"algorithm": h})
        pqc_evaluation = pqc_score(pqc_inputs)

        # 5. Enrich Vulnerabilities with AI Explanations
        for v in vulnerabilities:
            v["ai_explanation"] = explain_finding(v)

        assessment_id = f"IPSEC-SEC-{int(time.time())}"
        report_payload = {
            "assessment_id": assessment_id,
            "vendor": base_analysis.get("vendor", "Enterprise IPsec Gateway"),
            "ike_version": base_analysis.get("ike_version", "IKEv2"),
            "encryption": base_analysis.get("encryption", []),
            "integrity": base_analysis.get("integrity", []),
            "dh_groups": base_analysis.get("dh_groups", []),
            "authentication": base_analysis.get("authentication", "Pre-Shared Key"),
            "pfs": base_analysis.get("pfs", "Disabled"),
            "aggressive_mode": base_analysis.get("aggressive_mode", False),
            "vulnerabilities": vulnerabilities,
            "vulnerability_count": len(vulnerabilities),
            "risk_assessment": ml_prediction,
            "anomaly_detection": anomaly_assessment,
            "quantum_readiness": pqc_evaluation,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())
        }

        # 6. Anchor in Immutable Blockchain Ledger
        block_hash = log_report(report_payload, assessment_id=assessment_id)
        report_payload["blockchain_hash"] = block_hash

        return report_payload

    @staticmethod
    def get_sample_scenarios() -> List[Dict[str, Any]]:
        """Pre-loaded scenarios for instantaneous Smart India Hackathon jury demonstrations."""
        return [
            {
                "id": "scenario-banking-core",
                "name": "Legacy Core Banking VPN (Cisco ASA)",
                "description": "High-risk legacy gateway running IKEv1, 3DES encryption, MD5 hashing, DH Group 2, and Aggressive Mode with PSK.",
                "type": "config",
                "content": """! Cisco ASA 5525-X Legacy Core Banking Production Tunnel
crypto isakmp policy 10
 encr 3des
 hash md5
 authentication pre-share
 group 2
 lifetime 86400
exit

crypto ipsec transform-set LEGACY-BANK esp-3des esp-md5-hmac
exit

crypto map OUTSIDE_MAP 10 match address VPN_TRAFFIC
crypto map OUTSIDE_MAP 10 set peer 198.51.100.55
crypto map OUTSIDE_MAP 10 set transform-set LEGACY-BANK
crypto isakmp enable outside
! Note: Aggressive mode is enabled for remote branch compatibility
"""
            },
            {
                "id": "scenario-ot-infrastructure",
                "name": "Critical Infrastructure SCADA Gateway (strongSwan)",
                "description": "OT network tunnel with legacy IKEv1, DES, and missing Perfect Forward Secrecy.",
                "type": "config",
                "content": """# strongSwan SCADA Pipeline Link (ipsec.conf)
config setup
    charondebug="ike 2, knl 2, cfg 2"

conn scada-remote-telemetry
    keyexchange=ikev1
    authby=secret
    left=192.168.10.1
    leftsubnet=10.0.0.0/16
    right=203.0.113.88
    rightsubnet=10.100.0.0/16
    ike=des-sha1-modp1024!
    esp=des-sha1!
    auto=start
"""
            },
            {
                "id": "scenario-zerotrust-cloud",
                "name": "Zero-Trust Hybrid Cloud Gateway (pfSense Modern)",
                "description": "Enterprise-grade modern tunnel with IKEv2, AES-256-GCM, DH Group 20 (ECP-384), PFS, and X.509 Certificate authentication.",
                "type": "config",
                "content": """<!-- pfSense 2.7.0 Modern Zero Trust IPsec Gateway -->
<ipsec>
    <phase1>
        <ikeid>1</ikeid>
        <iketype>ikev2</iketype>
        <protocol>inet</protocol>
        <myid_type>fqdn</myid_type>
        <myid_data>vpn.cloud.enterprise.gov</myid_data>
        <encryption-algorithm>
            <name>aes256gcm</name>
            <keylen>256</keylen>
        </encryption-algorithm>
        <hash-algorithm>SHA384</hash-algorithm>
        <dhgroup>20</dhgroup> <!-- NIST P-384 ECP -->
        <lifetime>28800</lifetime>
        <authentication_method>cert</authentication_method>
        <caref>CERT_IN_ROOT_CA</caref>
    </phase1>
    <phase2>
        <mode>tunnel</mode>
        <pfsgroup>20</pfsgroup>
        <lifetime>3600</lifetime>
        <encryption-algorithm-option>
            <name>aes256-gcm</name>
            <keylen>256</keylen>
        </encryption-algorithm-option>
    </phase2>
</ipsec>
"""
            }
        ]
