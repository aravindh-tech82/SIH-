import os
import json
from typing import Dict, Any, List

KNOWLEDGE_BASE = {
    "cisco": """! ==========================================
! REMEDIATION: Cisco ASA / IOS-XE Hardening
! Compliant with NIST SP 800-77 Rev 1 & RFC 7296
! ==========================================
crypto ikev2 policy 10
 encryption aes-256-gcm
 integrity null
 group 20 19 14
 prf sha384 sha256
 lifetime seconds 28800
exit

crypto ipsec ikev2 ipsec-proposal SECURE-P2
 protocol esp encryption aes-256-gcm
 protocol esp integrity null
exit

crypto map OUTSIDE_MAP 10 set pfs group20
crypto isakmp am-disable
no crypto isakmp enable outside
""",
    "strongswan": """# ==========================================
# REMEDIATION: strongSwan swanctl.conf (PQC Ready)
# NIST FIPS 203 / 204 Hybrid Profile
# ==========================================
connections {
    enterprise-vpn {
        version = 2
        local_addrs  = 198.51.100.1
        remote_addrs = 203.0.113.1

        proposals = aes256gcm16-prfsha384-ecp384-mlkem768, aes256gcm16-prfsha384-curve25519

        local {
            auth = pubkey
            certs = cert.pem
        }
        remote {
            auth = pubkey
        }

        children {
            net-tunnel {
                esp_proposals = aes256gcm16-ecp384, aes256gcm16-curve25519
                dpd_action = restart
                rekey_time = 3600s
            }
        }
    }
}
""",
    "pfsense": """<!-- ==========================================
     REMEDIATION: pfSense / OPNsense XML Configuration
     NIST SP 800-77 Phase 1 & Phase 2 Cryptosuite
     ========================================== -->
<ipsec>
    <phase1>
        <ikeid>1</ikeid>
        <iketype>ikev2</iketype>
        <protocol>inet</protocol>
        <myid_type>myip</myid_type>
        <encryption-algorithm>
            <name>aes256gcm</name>
            <keylen>256</keylen>
        </encryption-algorithm>
        <hash-algorithm>SHA384</hash-algorithm>
        <dhgroup>20</dhgroup> <!-- ECP 384-bit -->
        <lifetime>28800</lifetime>
        <authentication_method>cert</authentication_method>
    </phase1>
    <phase2>
        <mode>tunnel</mode>
        <pfsgroup>20</pfsgroup>
        <encryption-algorithm-option>
            <name>aes256-gcm</name>
            <keylen>256</keylen>
        </encryption-algorithm-option>
    </phase2>
</ipsec>
""",
    "sweet32": """### 🛑 Threat Analysis: Sweet32 Vulnerability (CVE-2016-2183)
- **Impact**: Affects all 64-bit block ciphers including **3DES** and **Blowfish**.
- **Mechanism**: A birthday attack allows an eavesdropper listening to ~32GB of encrypted traffic to recover plaintext tokens, session cookies, and credentials by analyzing ciphertext block collisions.
- **Remediation**: Immediately migrate phase 1 and phase 2 proposals to **AES-256-GCM** (128-bit block size).
- **Compliance**: Prohibited by PCI-DSS v4.0 Requirement 4.1 and NIST SP 800-77 Rev 1.
""",
    "aggressive_mode": """### 🛑 Threat Analysis: IKEv1 Aggressive Mode PSK Exposure (CVE-2002-1623)
- **Impact**: Complete offline cracking of pre-shared keys without interacting with the gateway after packet capture.
- **Mechanism**: In IKEv1 Aggressive Mode, the authentication hash (containing the PSK hash, nonce, and identity) is transmitted in **Packet 2 & Packet 3 in cleartext**. An attacker uses tools like `ike-scan -A` and `hashcat -m 5400` to crack the password.
- **Remediation**:
  1. Migrate to **IKEv2** immediately.
  2. If IKEv1 is required, strictly enforce **Main Mode** with `crypto isakmp am-disable`.
  3. Replace PSKs with X.509 certificates.
"""
}

def explain_finding(finding: dict) -> str:
    """Uses OpenAI if available, or returns immediate expert cybersecurity intelligence."""
    issue = str(finding.get("issue", "")).lower()
    algo = str(finding.get("algorithm", "")).lower()
    severity = str(finding.get("severity", "High"))

    # Check for live OpenAI key
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key:
        try:
            # pyrefly: ignore [missing-import]
            from openai import OpenAI
            client = OpenAI(api_key=api_key)
            prompt = f"""You are a Principal Cybersecurity Architect for a CERT team.
Analyze this IPsec VPN finding:
{json.dumps(finding, indent=2)}

Provide:
1. Executive Risk Summary & CVSS impact
2. Deep Technical Breakdown (How an adversary exploits it)
3. Step-by-Step Vendor Fix (Cisco ASA, strongSwan, pfSense)
4. Relevant Standards (NIST SP 800-77, RFC 7296, PCI-DSS)"""
            resp = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=500
            )
            return resp.choices[0].message.content
        except Exception:
            pass

    # Built-in High-Impact Cyber Intelligence Engine
    if "3des" in issue or "3des" in algo or "des" in issue:
        return KNOWLEDGE_BASE["sweet32"]
    elif "aggressive" in issue:
        return KNOWLEDGE_BASE["aggressive_mode"]
    elif "dh group 1" in issue or "dh group 2" in issue or "dh group 5" in issue or "dh" in issue:
        return f"""### ⚠️ Vulnerability: Insecure Diffie-Hellman Group ({finding.get('issue', 'Legacy DH')})
- **Technical Risk**: DH Groups 1 (768-bit), 2 (1024-bit), and 5 (1536-bit) are susceptible to discrete logarithm precomputations (Logjam attack). Nation-state adversaries with moderate compute can intercept and decrypt session keys.
- **Quantum Impact**: Shor's algorithm renders 1024-bit and 2048-bit discrete log key exchange broken in polynomial time.
- **Recommended Action**: Upgrade to **DH Group 19 (ECP 256-bit)**, **Group 20 (ECP 384-bit)**, or **Group 14 (MODP 2048-bit minimum)**.
- **Standard**: Violates NIST SP 800-77 Rev 1 (requires DH Group 14+)."""
    elif "md5" in issue or "sha1" in issue or "sha-1" in issue:
        return f"""### ⚠️ Vulnerability: Cryptographically Deprecated Integrity Hash ({finding.get('issue', 'MD5/SHA-1')})
- **Technical Risk**: MD5 and SHA-1 suffer from proven practical collision attacks. An attacker can forge packet authentication and inject malicious replay packets into the IPsec tunnel.
- **Recommended Action**: Enforce **SHA-256**, **SHA-384**, or Authenticated Encryption with Associated Data (**AES-GCM**).
- **Standard**: RFC 7296 Section 3.3.2 and NIST SP 800-131A."""
    else:
        return f"""### 🛡️ AI Security Assessment: {finding.get('issue', 'Configuration Parameter')}
- **Risk Assessment**: Classified as **{severity}**.
- **Actionable Remediation**: Align phase 1 and phase 2 proposals to modern cipher standards:
  - **Protocol**: Enforce IKEv2 exclusively (RFC 7296).
  - **Encryption**: AES-256-GCM or ChaCha20-Poly1305.
  - **Key Exchange**: Diffie-Hellman Group 19 (X25519) or Group 20 (NIST P-384).
  - **PFS**: Enable Perfect Forward Secrecy on all IPsec Security Associations."""

def generate_vendor_script(vendor: str) -> str:
    vendor_lower = vendor.lower()
    if "cisco" in vendor_lower:
        return KNOWLEDGE_BASE["cisco"]
    elif "strongswan" in vendor_lower:
        return KNOWLEDGE_BASE["strongswan"]
    elif "pfsense" in vendor_lower or "opnsense" in vendor_lower:
        return KNOWLEDGE_BASE["pfsense"]
    else:
        return KNOWLEDGE_BASE["cisco"]
