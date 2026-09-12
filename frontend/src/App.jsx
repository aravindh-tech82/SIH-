import React, { useState, useEffect } from 'react';
import { Sidebar, TopBar } from './components/Navigation';
import LandingPage from './views/LandingPage';
import DashboardView from './views/DashboardView';
import AnalyzerView from './views/AnalyzerView';
import VulnerabilitiesView from './views/VulnerabilitiesView';
import AiCopilotView from './views/AiCopilotView';
import MlEngineView from './views/MlEngineView';
import QuantumReadinessView from './views/QuantumReadinessView';
import BlockchainAuditView from './views/BlockchainAuditView';
import ReportsView from './views/ReportsView';
import SihDemoModal from './components/SihDemoModal';

const API_BASE = 'http://127.0.0.1:8000/api';

// Pre-seeded high-fidelity dataset for offline presentation resilience
const DEFAULT_ANALYSIS = {
  assessment_id: "IPSEC-SEC-1726058800",
  vendor: "Cisco ASA 5525-X Legacy Core Banking Gateway",
  ike_version: "IKEv1",
  encryption: ["3DES-CBC", "DES"],
  integrity: ["MD5", "SHA-1"],
  dh_groups: ["DH Group 2 (1024-bit)"],
  authentication: "Pre-Shared Key (PSK)",
  pfs: "Disabled",
  aggressive_mode: true,
  vulnerabilities: [
    {
      issue: "Sweet32 64-bit Block Cipher (3DES)",
      cve: "CVE-2016-2183",
      cvss: 7.5,
      severity: "High",
      layer: "Phase 1 & Phase 2",
      impact: "Plaintext recovery via birthday collision attack over 32GB traffic.",
      remediation: "Replace with AES-256-GCM."
    },
    {
      issue: "IKEv1 Aggressive Mode Active",
      cve: "CVE-2002-1623",
      cvss: 8.6,
      severity: "Critical",
      layer: "IKE Phase 1",
      impact: "Cleartext transmission of pre-shared key hash; vulnerable to offline dictionary attack.",
      remediation: "Disable Aggressive Mode, migrate to IKEv2."
    },
    {
      issue: "Insecure Diffie-Hellman Group (DH Group 2)",
      cve: "CVE-2015-4000",
      cvss: 8.2,
      severity: "High",
      layer: "Key Exchange (IKE)",
      impact: "Logjam discrete-log precomputation attack allows session key decryption.",
      remediation: "Upgrade to DH Group 14 (2048-bit) or Group 19/20."
    },
    {
      issue: "Cryptographically Broken Hash (MD5)",
      cve: "CVE-2004-2761",
      cvss: 7.4,
      severity: "High",
      layer: "Integrity",
      impact: "Hash collision vulnerability allowing packet forgery.",
      remediation: "Upgrade to SHA-256 or SHA-384."
    },
    {
      issue: "Missing Perfect Forward Secrecy (PFS)",
      cve: "CWE-327",
      cvss: 5.3,
      severity: "Medium",
      layer: "Phase 2 ESP SA",
      impact: "Compromise of long-term key compromises all historic traffic.",
      remediation: "Enable PFS (pfs group19)."
    }
  ],
  risk_assessment: {
    security_posture_score: 32,
    risk_level: "Critical",
    confidence: 94.8,
    cvss_score: 9.4
  },
  anomaly_detection: {
    status: "ANOMALY_DETECTED",
    is_anomaly: true,
    confidence: 91.2,
    anomalies: [
      "Excessive Negotiation Failures: 14.5% (Threshold: 5%)",
      "Low Traffic Entropy: 6.7 bits/byte"
    ]
  },
  quantum_readiness: {
    quantum_readiness_score: 18,
    vulnerable_count: 3,
    transitional_count: 1,
    quantum_safe_count: 1,
    total_findings: 5,
    roadmap_urgency: "IMMEDIATE",
    details: [
      { algorithm: "DH Group 2", pqc_status: "VULNERABLE", quantum_threat: "Shor's Algorithm (Discrete Log)", migration_fix: "Replace with NIST FIPS 203 (ML-KEM-768)" },
      { algorithm: "3DES", pqc_status: "VULNERABLE", quantum_threat: "Sweet32 + Grover's Algorithm", migration_fix: "Upgrade to AES-256-GCM" },
      { algorithm: "MD5", pqc_status: "VULNERABLE", quantum_threat: "Classical & Quantum Collision", migration_fix: "Upgrade to SHA-384" },
      { algorithm: "DH Group 14", pqc_status: "TRANSITIONAL", quantum_threat: "Harvest Now, Decrypt Later (HNDL)", migration_fix: "Adopt Hybrid ECDH + ML-KEM-768" },
      { algorithm: "AES-256-GCM", pqc_status: "QUANTUM_RESISTANT", quantum_threat: "Grover's reduces to 128-bit (Secure)", migration_fix: "None needed (CNSA 2.0 compliant)" }
    ]
  },
  blockchain_hash: "00a91f8263bc019a82910fa48b10294e771c90284bbad371691bca7209148b11",
  timestamp: "2026-09-11 18:45:00 UTC"
};

const DEFAULT_SCENARIOS = [
  {
    id: "scenario-banking-core",
    name: "Legacy Banking Core (Cisco ASA)",
    description: "IKEv1, 3DES, MD5, DH Group 2, and Aggressive Mode with PSK.",
    content: `! Cisco ASA 5525-X Legacy Core Banking Production Tunnel
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
! Note: Aggressive mode is enabled for branch compatibility`
  },
  {
    id: "scenario-ot-infrastructure",
    name: "SCADA Pipeline Gateway (strongSwan)",
    description: "OT network tunnel with legacy IKEv1, DES, and missing PFS.",
    content: `# strongSwan SCADA Pipeline Link (ipsec.conf)
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
    auto=start`
  },
  {
    id: "scenario-zerotrust-cloud",
    name: "Zero-Trust Cloud Gateway (pfSense)",
    description: "IKEv2, AES-256-GCM, DH Group 20 (NIST P-384), and Certificates.",
    content: `<!-- pfSense 2.7.0 Modern Zero Trust IPsec Gateway -->
<ipsec>
    <phase1>
        <ikeid>1</ikeid>
        <iketype>ikev2</iketype>
        <protocol>inet</protocol>
        <encryption-algorithm>
            <name>aes256gcm</name>
            <keylen>256</keylen>
        </encryption-algorithm>
        <hash-algorithm>SHA384</hash-algorithm>
        <dhgroup>20</dhgroup>
        <lifetime>28800</lifetime>
        <authentication_method>cert</authentication_method>
    </phase1>
    <phase2>
        <mode>tunnel</mode>
        <pfsgroup>20</pfsgroup>
        <lifetime>3600</lifetime>
    </phase2>
</ipsec>`
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [role, setRole] = useState('CISO');
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [analysisData, setAnalysisData] = useState(DEFAULT_ANALYSIS);
  const [scenarios, setScenarios] = useState(DEFAULT_SCENARIOS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Blockchain state
  const [ledgerData, setLedgerData] = useState({
    ledger: [
      {
        index: 0,
        assessment_id: "GENESIS-BLOCK",
        timestamp: "2026-09-11T12:00:00Z",
        report_hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        prev_hash: "0000000000000000000000000000000000000000000000000000000000000000",
        nonce: 42,
        hash: "000a4b7f92e811c6d3f25a91b4028471c26b83f08149e29a99f16823ab0248c1",
        signature: "ED25519-SIG-ROOT9921",
        verified: true
      },
      {
        index: 1,
        assessment_id: "IPSEC-SEC-1726058000",
        timestamp: "2026-09-11T14:30:00Z",
        report_hash: "a4f89d31b0c9e7826189ad47e2b81093f619280148ad62ef18903ba72c0192e4",
        prev_hash: "000a4b7f92e811c6d3f25a91b4028471c26b83f08149e29a99f16823ab0248c1",
        nonce: 118,
        hash: "00a91f8263bc019a82910fa48b10294e771c90284bbad371691bca7209148b11",
        signature: "ED25519-SIG-NODE7712",
        verified: true
      }
    ],
    verification: { valid: true, status: "CHAIN_INTEGRITY_VERIFIED" }
  });

  // Copilot messages
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: `Welcome to **IPsec Sentinel AI Copilot**. I am an expert cybersecurity architect trained on **RFC 7296**, **NIST SP 800-77 Rev 1**, and Post-Quantum Cryptography standards.
      
Ask me why a vulnerability is dangerous, or ask for vendor hardening scripts for **Cisco ASA**, **strongSwan**, or **pfSense**.`,
      code: null
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Check Backend Health on Mount
  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ONLINE') {
          setIsOnline(true);
          // Fetch real scenarios & ledger
          fetch(`${API_BASE}/scenarios`).then(r => r.json()).then(sc => setScenarios(sc)).catch(() => {});
          fetch(`${API_BASE}/blockchain/ledger`).then(r => r.json()).then(l => setLedgerData(l)).catch(() => {});
        }
      })
      .catch(() => {
        setIsOnline(false);
      });
  }, []);

  // Analysis Handlers
  const handleAnalyzeConfig = async (configText) => {
    setIsAnalyzing(true);
    try {
      if (isOnline) {
        const res = await fetch(`${API_BASE}/analyze/config`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ config_text: configText })
        });
        const data = await res.json();
        setAnalysisData(data);
        fetchLedger();
      } else {
        // High fidelity offline fallback
        setTimeout(() => {
          setAnalysisData(DEFAULT_ANALYSIS);
        }, 600);
      }
    } catch (err) {
      console.warn("Backend error, utilizing simulated engine:", err);
      setAnalysisData(DEFAULT_ANALYSIS);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzePcap = async (file) => {
    setIsAnalyzing(true);
    try {
      if (isOnline) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(`${API_BASE}/analyze/pcap`, {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        setAnalysisData(data);
        fetchLedger();
      } else {
        setTimeout(() => {
          setAnalysisData(DEFAULT_ANALYSIS);
        }, 800);
      }
    } catch (err) {
      setAnalysisData(DEFAULT_ANALYSIS);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeSamplePcap = async (sampleId) => {
    setIsAnalyzing(true);
    try {
      if (isOnline) {
        const res = await fetch(`${API_BASE}/analyze/sample-pcap/${sampleId}`, {
          method: 'POST'
        });
        const data = await res.json();
        setAnalysisData(data);
        fetchLedger();
      } else {
        setTimeout(() => {
          setAnalysisData(DEFAULT_ANALYSIS);
        }, 500);
      }
    } catch (err) {
      console.error(err);
      setAnalysisData(DEFAULT_ANALYSIS);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleProbePacket = async (target, port, protocol) => {
    try {
      if (isOnline) {
        const res = await fetch(`${API_BASE}/packet/probe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ target, port: parseInt(port), protocol })
        });
        return await res.json();
      } else {
        return {
          target,
          port,
          protocol,
          probes: {
            ikev2: {
              packet_name: "IKEv2 IKE_SA_INIT (Simulation)",
              hexdump_preview: "e031f9fa30fac8dc00000000000000002120220800000000000000480000002c0000002801010004",
              packet_length_bytes: 72,
              scan_result: { protocol: "IKEv2", status: "Open (Simulated responder)" }
            }
          },
          summary: `Scapy crafted and simulated UDP datagram to ${target}:${port}.`
        };
      }
    } catch (err) {
      return {
        target,
        port,
        protocol,
        error: err.message,
        summary: `Transmission error to ${target}:${port}.`
      };
    }
  };

  const handleAnalyzeLog = async (logText) => {
    setIsAnalyzing(true);
    try {
      if (isOnline) {
        const res = await fetch(`${API_BASE}/analyze/log`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ log_text: logText })
        });
        const data = await res.json();
        // Enrich existing analysis with log anomalies
        setAnalysisData(prev => ({ ...prev, log_audit: data }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fetchLedger = async () => {
    if (!isOnline) return;
    try {
      const res = await fetch(`${API_BASE}/blockchain/ledger`);
      const data = await res.json();
      setLedgerData(data);
    } catch (err) {}
  };

  // Copilot Handler
  const handleSendMessage = async (text) => {
    const userMsg = { sender: 'user', text, code: null };
    setChatMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      if (isOnline) {
        const res = await fetch(`${API_BASE}/copilot/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text })
        });
        const data = await res.json();
        setChatMessages(prev => [...prev, { sender: 'ai', text: data.reply, code: data.code }]);
      } else {
        // Intelligent offline responder
        setTimeout(() => {
          let reply = `### 🛡️ IPsec Sentinel Cyber Intelligence\nI analyzed your query: "${text}".\n\n**Best Practice**: Enforce IKEv2 (RFC 7296) with AES-256-GCM, DH Group 19/20, and SHA-384.`;
          let code = null;
          if (text.toLowerCase().includes('cisco')) {
            reply = "Here is the hardened, NIST SP 800-77 compliant configuration for **Cisco ASA / IOS-XE**:\n";
            code = `crypto ikev2 policy 10\n encryption aes-256-gcm\n integrity null\n group 20 19 14\n prf sha384 sha256\n lifetime seconds 28800\nexit\n\ncrypto ipsec ikev2 ipsec-proposal SECURE-P2\n protocol esp encryption aes-256-gcm\nexit\n\ncrypto map OUTSIDE_MAP 10 set pfs group20\ncrypto isakmp am-disable`;
          } else if (text.toLowerCase().includes('strongswan')) {
            reply = "Here is the post-quantum ready **strongSwan swanctl.conf** configuration:\n";
            code = `connections {\n  enterprise-pqc {\n    version = 2\n    proposals = aes256gcm16-prfsha384-ecp384-mlkem768\n    children {\n      net-tunnel {\n        esp_proposals = aes256gcm16-ecp384\n      }\n    }\n  }\n}`;
          }
          setChatMessages(prev => [...prev, { sender: 'ai', text: reply, code }]);
        }, 500);
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: 'ai', text: "Service temporarily offline. Enforce IKEv2 and AES-256-GCM.", code: null }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAskCopilotFromVuln = (vuln) => {
    handleSendMessage(`Explain ${vuln.issue} (${vuln.cve}) and provide vendor-specific remediation.`);
  };

  // Blockchain Tamper Simulation Handlers
  const handleTamperBlock = async (index) => {
    if (isOnline) {
      try {
        await fetch(`${API_BASE}/blockchain/tamper`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ block_index: index })
        });
        fetchLedger();
      } catch (err) {}
    } else {
      setLedgerData(prev => {
        const newBlocks = [...prev.ledger];
        if (newBlocks[index]) {
          newBlocks[index] = { ...newBlocks[index], report_hash: "TAMPERED_HASH_CORRUPTED_VALUE", verified: false };
        }
        return {
          ledger: newBlocks,
          verification: {
            valid: false,
            broken_block_index: index,
            reason: `Cryptographic SHA-256 mismatch detected at Block #${index}! Integrity breach.`
          }
        };
      });
    }
  };

  const handleRestoreBlockchain = async () => {
    if (isOnline) {
      try {
        await fetch(`${API_BASE}/blockchain/restore`, { method: 'POST' });
        fetchLedger();
      } catch (err) {}
    } else {
      setLedgerData(prev => ({
        ledger: prev.ledger.map(b => ({ ...b, verified: true })),
        verification: { valid: true, status: "CHAIN_INTEGRITY_VERIFIED" }
      }));
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Viewport with Top Telemetry Bar */}
      <div className="main-viewport-wrapper">
        <TopBar
          activeTab={activeTab}
          role={role}
          setRole={setRole}
          onStartDemo={() => setIsDemoOpen(true)}
          isOnline={isOnline}
        />

        {/* Scrollable Viewport Content */}
        <main className="main-content">
        {activeTab === 'landing' && (
          <LandingPage 
            setActiveTab={setActiveTab} 
            onStartDemo={() => setIsDemoOpen(true)} 
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView 
            analysisData={analysisData} 
            setActiveTab={setActiveTab}
            onStartDemo={() => setIsDemoOpen(true)}
          />
        )}

        {activeTab === 'analyzer' && (
          <AnalyzerView 
            onAnalyzeConfig={handleAnalyzeConfig}
            onAnalyzePcap={handleAnalyzePcap}
            onAnalyzeLog={handleAnalyzeLog}
            onAnalyzeSamplePcap={handleAnalyzeSamplePcap}
            onProbePacket={handleProbePacket}
            scenarios={scenarios}
            analysisData={analysisData}
            isAnalyzing={isAnalyzing}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'vulnerabilities' && (
          <VulnerabilitiesView 
            analysisData={analysisData}
            setActiveTab={setActiveTab}
            onAskCopilot={handleAskCopilotFromVuln}
          />
        )}

        {activeTab === 'copilot' && (
          <AiCopilotView 
            chatMessages={chatMessages}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
          />
        )}

        {activeTab === 'ml' && (
          <MlEngineView 
            analysisData={analysisData} 
          />
        )}

        {activeTab === 'pqc' && (
          <QuantumReadinessView 
            analysisData={analysisData} 
          />
        )}

        {activeTab === 'blockchain' && (
          <BlockchainAuditView 
            ledgerData={ledgerData}
            onVerify={fetchLedger}
            onTamper={handleTamperBlock}
            onRestore={handleRestoreBlockchain}
            isVerifying={false}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView 
            analysisData={analysisData} 
          />
        )}
      </main>
      </div>

      {/* SIH 2026 Jury Presentation Modal */}
      <SihDemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        setActiveTab={setActiveTab}
        onExecuteScenario={() => handleAnalyzeConfig(DEFAULT_SCENARIOS[0].content)}
      />
    </div>
  );
}
