# 🛡️ IPsec Sentinel | AI-Powered IPsec VPN Protocol Analyzer
### **Smart India Hackathon 2026 | Problem Statement: SIH26160**

![SIH 2026](https://img.shields.io/badge/SIH-2026_Finalist-00E5FF?style=for-the-badge&logo=shield)
![Problem Statement](https://img.shields.io/badge/Problem_Statement-SIH26160-8B5CF6?style=for-the-badge)
![FastAPI Backend](https://img.shields.io/badge/Backend-FastAPI_Python_3.13-22C55E?style=for-the-badge&logo=fastapi)
![React Frontend](https://img.shields.io/badge/Frontend-React_18_+_Vite-61DAFB?style=for-the-badge&logo=react)
![Machine Learning](https://img.shields.io/badge/AI%2FML-Scikit--Learn_Random_Forest-F59E0B?style=for-the-badge&logo=scikit-learn)
![PQC Standard](https://img.shields.io/badge/Quantum_Ready-NIST_FIPS_203%2F204-EC4899?style=for-the-badge)
![Blockchain Audit](https://img.shields.io/badge/Audit_Trail-SHA--256_Merkle_Chain-FCD34D?style=for-the-badge)

---

## 📌 Executive Overview

**IPsec Sentinel** is an enterprise-grade cybersecurity command center engineered specifically for **Smart India Hackathon 2026 (Problem Statement SIH26160)**. It transforms traditional, manual IPsec VPN audits into an automated, AI-driven protocol analysis platform. 

The platform continuously inspects network packet captures (PCAP/PCAPNG), multi-vendor gateway configurations (Cisco ASA, strongSwan, pfSense, Fortinet), and VPN syslogs to detect cryptographic vulnerabilities, predict security posture scores using machine learning, evaluate Post-Quantum Cryptography (PQC) readiness, and anchor every audit finding into an immutable, tamper-evident blockchain ledger.

---

## 🌟 Key Capabilities & Architectural Innovations

### 1. 🔍 Multi-Vendor Deep Protocol & PCAP Dissector
- **Live & Offline PCAP Parser**: Utilizes Scapy to dissect IKEv1 and IKEv2 Security Associations (`ISAKMP`, `IKE_SA_INIT`, `IKE_AUTH`) over UDP 500 and 4500.
- **Aggressive Mode Detection**: Flags cleartext Pre-Shared Key (PSK) hash leaks susceptible to offline dictionary brute-forcing (CVE-2002-1623).
- **Multi-Vendor Configuration Parsers**:
  - **Cisco ASA & IOS-XE**: ISAKMP policies, crypto maps, transform sets, and AM state.
  - **strongSwan**: `ipsec.conf` and modern `swanctl.conf` syntax.
  - **pfSense**: XML configuration parser for Phase 1 and Phase 2 proposals.
  - **Fortinet FortiOS**: VPN phase1-interface and phase2-interface blocks.
- **Syslog Analyzer**: Parses `charon.log` and syslog streams for authentication failure spikes and rekey storms.

### 2. 🧠 AI & Machine Learning Threat Intelligence
- **Random Forest Posture Classifier**: Trained on 6 multi-dimensional IPsec parameters (IKE version, cipher rank, hash integrity, DH group modulus, PFS presence, and aggressive mode) to compute an objective **Security Posture Score (0–100)** and categorize risk (Low, Medium, High, Critical).
- **Isolation Forest Tunnel Anomaly Detector**: Evaluates real-time tunnel telemetry (rekey frequency, negotiation failure percentage, payload entropy) to detect anomalies such as brute-force attacks and session hijacking.
- **Interactive "What-If" Parameter Lab**: Real-time sliders in the UI allow security architects to simulate configuration changes and witness live score recalibrations.

### 3. ⚛️ Post-Quantum Cryptography (PQC) Readiness Center
- **NIST FIPS 203 & 204 Alignment**: Classifies cryptographic algorithms against upcoming post-quantum requirements:
  - **Vulnerable**: DH Groups 1, 2, 5, RSA-2048, 3DES, MD5, SHA-1 (cracked via Shor's & Grover's algorithms).
  - **Transitional (Hybrid)**: DH Group 14/19/20 paired with quantum-resistant key encapsulation.
  - **Quantum Resistant**: NIST FIPS 203 (ML-KEM-768/1024 / Kyber) and FIPS 204 (ML-DSA / Dilithium).
- **Harvest Now, Decrypt Later (HNDL) Threat Analysis**: Evaluates exposure against state-sponsored data harvesting and provides a direct migration timeline compliant with **NSA CNSA 2.0**.

### 4. ⛓️ Cryptographic Blockchain Audit Trail
- **SHA-256 Merkle-Linked Chain**: Every scan report is immutably hashed and linked to the preceding block with digital nonces and timestamps.
- **Live Tamper Simulator (Jury Demo)**: Includes an interactive simulation trigger where judges can deliberately modify past audit records to see the cryptographic verification engine immediately flag `TAMPER BREACH DETECTED`, followed by a 1-click restore mechanism.

### 5. 🤖 AI Security Copilot & Remediation Engine
- **Context-Aware Hardening**: Explains vulnerabilities in plain English with CVE/CVSS citations (Sweet32, Logjam, CVE-2016-2183, CVE-2015-4000).
- **One-Click Vendor Scripts**: Generates drop-in CLI commands for Cisco ASA, strongSwan `swanctl`, and pfSense XML that comply with **NIST SP 800-77 Rev 1** and **RFC 7296**.

### 6. 🏆 SIH 2026 Jury Presentation Demo Mode
- A 6-step automated guided walkthrough built specifically for hackathon evaluation:
  1. *Ingest Legacy Core Banking VPN (Cisco ASA 3DES/MD5)*
  2. *Deep Protocol Dissection & CVE Matching*
  3. *AI / ML Risk & Anomaly Classification*
  4. *AI Copilot Vendor Remediation Generation*
  5. *Post-Quantum Cryptography Assessment*
  6. *Anchor in Blockchain & Export CISO Executive Report*

---

## 🏢 Enterprise SOC UI / UX Design

Designed to match top-tier Security Operations Centers (CrowdStrike Falcon, Palo Alto Cortex, Splunk ES):
- **SOC Dark Theme Palette**: Deep navy `#0B1220`, slate `#111827`, glowing cyan `#00E5FF`, emerald `#22C55E`, amber `#F59E0B`, crimson `#EF4444`.
- **Live HTML5 Network Topology Canvas**: Real-time packet animation illustrating secure AES-GCM tunnels vs vulnerable 3DES/Logjam links.
- **Glassmorphism Panels**: Modern blurred translucent cards with high-contrast typography (`Outfit`, `Inter`, `JetBrains Mono`).
- **Interactive KPI Cards**: Instant drill-down navigation from executive metrics to technical tables.

---

## 📁 Repository Structure

```text
c:\Desktop\SIH\IKEv3Analytica\
├── frontend/                          # Vite + React 18 Enterprise UI
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.jsx         # Sidebar Command Center & Top Telemetry Bar
│   │   │   └── SihDemoModal.jsx       # 6-Step Automated SIH Presentation Modal
│   │   ├── views/
│   │   │   ├── DashboardView.jsx      # Executive SOC Overview & Posture Gauges
│   │   │   ├── AnalyzerView.jsx       # Deep Multi-Vendor & PCAP Ingestion
│   │   │   ├── VulnerabilitiesView.jsx# CVE Detection & Compliance Matrix
│   │   │   ├── AiCopilotView.jsx      # AI Remediation Chatbot & Vendor Fixes
│   │   │   ├── MlEngineView.jsx       # Random Forest & Isolation Forest Lab
│   │   │   ├── QuantumReadinessView.jsx # NIST FIPS 203/204 PQC Center
│   │   │   ├── BlockchainAuditView.jsx# SHA-256 Merkle Ledger & Tamper Simulation
│   │   │   ├── ReportsView.jsx        # Printable Executive PDF & JSON Export
│   │   │   └── LandingPage.jsx        # Interactive Network Topology & Hero
│   │   ├── App.jsx                    # Master Application Controller
│   │   └── index.css                  # Enterprise SOC Design System
│   ├── package.json
│   └── vite.config.js
│
├── src/ikev3analytica/                 # FastAPI Backend & Core Security Engines
│   ├── api/
│   │   └── server.py                  # REST API & WebSocket Endpoints
│   ├── parsers/
│   │   ├── config_parser.py           # Cisco ASA, strongSwan, pfSense, FortiOS
│   │   ├── pcap_parser.py             # Scapy Packet Dissector (IKEv1/v2 SAs)
│   │   └── log_parser.py              # VPN Syslog & Charon Auth Analyzer
│   ├── ml/
│   │   ├── risk_classifier.py         # Scikit-learn Random Forest Posture Model
│   │   └── anomaly_detector.py        # Scikit-learn Isolation Forest Anomaly Model
│   ├── novelties/
│   │   ├── pqc_checker.py             # NIST FIPS 203/204 PQC Evaluation
│   │   ├── blockchain_audit.py        # Merkle Chain with Tamper Simulation
│   │   └── llm_copilot.py             # Vendor Remediation & Hardening Prompts
│   ├── reporting/
│   │   └── report_generator.py        # Executive PDF, HTML & JSON Generator
│   └── engine.py                      # Master IPsec Sentinel Engine
│
├── tests/                             # Pytest Suite
├── requirements.txt                   # Python Dependencies
├── setup.py                           # Python Package Setup
└── README.md                          # Project Documentation
```

---

## ⚡ Quickstart Guide

### Prerequisites
- **Python**: 3.10 or higher (Python 3.13 recommended)
- **Node.js**: 18.0 or higher (with npm)

### 1. Launch Backend (FastAPI)
```bash
cd c:\Desktop\SIH\IKEv3Analytica
# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Start FastAPI server on port 8000
cd src
python -m uvicorn ikev3analytica.api.server:app --host 127.0.0.1 --port 8000 --reload
```
*Backend API will be accessible at: `http://127.0.0.1:8000`*  
*Interactive Swagger OpenAPI docs: `http://127.0.0.1:8000/docs`*

### 2. Launch Frontend (React + Vite)
```bash
cd c:\Desktop\SIH\IKEv3Analytica\frontend

# Install dependencies (if first time)
npm install

# Start Vite development server
npm run dev -- --host 127.0.0.1 --port 5173
```
*Frontend SOC Console will be live at: `http://127.0.0.1:5173`*

---

## 🧪 Preloaded SIH Benchmark Scenarios

The platform includes three ready-to-test enterprise scenarios:

| Scenario Name | Gateway Target | Risk Level | Highlighted Vulnerabilities |
| :--- | :--- | :---: | :--- |
| **Legacy Core Banking VPN** | Cisco ASA 5525-X | 🔴 **Critical (32/100)** | IKEv1, 3DES (Sweet32), MD5, DH Group 2, Cleartext PSK leak in Aggressive Mode |
| **SCADA Pipeline Link** | strongSwan Gateway | 🟠 **High (48/100)** | Obsolete DES, SHA-1, Missing Perfect Forward Secrecy (PFS), IKEv1 |
| **Zero-Trust Cloud Gateway** | pfSense 2.7.0 Modern | 🟢 **Secure (92/100)** | IKEv2, AES-256-GCM, DH Group 20 (NIST P-384 ECP), X.509 Certificate Auth |

---

## 🛡️ Regulatory Compliance Cross-Reference

| Standard | Status | Finding / Requirement |
| :--- | :---: | :--- |
| **NIST SP 800-77 Rev 1** | ⚠️ Non-Compliant | Deprecation of 3DES, DES, MD5, and DH Groups < 14 |
| **RFC 7296 (IKEv2)** | ⚠️ Non-Compliant | Legacy IKEv1 detected; mandatory transition to IKEv2 |
| **PCI-DSS v4.0 (Req 4.1)** | ❌ Violation | Transmission of cardholder data encrypted with 64-bit ciphers |
| **CERT-In Advisory CI-2023** | ❌ Severe Exposure | Cleartext PSK negotiation vulnerable to offline brute-force |
| **NIST FIPS 203 / 204** | ⚛️ Migration Roadmap | Transition plan to ML-KEM-768 and ML-DSA |

---

## 👥 Hackathon Team & Problem Statement Info

- **Hackathon**: Smart India Hackathon 2026 (SIH 2026)
- **Problem Statement ID**: **SIH26160**
- **Domain**: Cybersecurity / Defense / Critical Infrastructure
- **License**: MIT License
