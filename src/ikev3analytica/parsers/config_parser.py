import re
from typing import Dict, Any, List

class IPsecConfigParser:
    """Multi-vendor IPsec configuration parser supporting Cisco, strongSwan, pfSense, and FortiOS."""

    @staticmethod
    def parse(config_text: str) -> Dict[str, Any]:
        vendor = IPsecConfigParser.detect_vendor(config_text)
        if vendor == "cisco":
            return IPsecConfigParser._parse_cisco(config_text)
        elif vendor == "strongswan":
            return IPsecConfigParser._parse_strongswan(config_text)
        elif vendor == "pfsense":
            return IPsecConfigParser._parse_pfsense(config_text)
        elif vendor == "fortinet":
            return IPsecConfigParser._parse_fortinet(config_text)
        else:
            return IPsecConfigParser._parse_generic(config_text)

    @staticmethod
    def detect_vendor(text: str) -> str:
        lower = text.lower()
        if "crypto ikev2" in lower or "crypto isakmp" in lower or "crypto ipsec" in lower:
            return "cisco"
        if "conn " in lower or "config setup" in lower or "swanctl" in lower:
            return "strongswan"
        if "<ipsec>" in lower or "pfsense" in lower or "<phase1>" in lower:
            return "pfsense"
        if "config vpn ipsec" in lower or "phase1-interface" in lower:
            return "fortinet"
        return "generic"

    @staticmethod
    def _parse_cisco(text: str) -> Dict[str, Any]:
        ike_version = "IKEv1"
        if "crypto ikev2" in text.lower():
            ike_version = "IKEv2"

        encryption = []
        integrity = []
        dh_groups = []
        auth_method = "Pre-Shared Key (PSK)"
        pfs = "Disabled"
        aggressive_mode = False

        # Extract ciphers
        for line in text.splitlines():
            line = line.strip()
            # Encryption
            enc_match = re.search(r"encryption\s+([a-zA-Z0-9\-]+)", line, re.I)
            if enc_match:
                encryption.append(enc_match.group(1).upper())
            # Integrity / Hash
            hash_match = re.search(r"(?:integrity|hash)\s+([a-zA-Z0-9\-]+)", line, re.I)
            if hash_match:
                integrity.append(hash_match.group(1).upper())
            # Group
            group_match = re.search(r"group\s+(\d+)", line, re.I)
            if group_match:
                dh_groups.append(f"DH Group {group_match.group(1)}")
            # Auth
            if "authentication rsa-sig" in line.lower() or "trustpoint" in line.lower():
                auth_method = "RSA-Signature (Certificates)"
            if "pfs group" in line.lower():
                pfs = "Enabled"
            if "am-disable" not in line.lower() and "aggressive" in line.lower():
                aggressive_mode = True

        # Defaults if empty
        if not encryption:
            encryption = ["3DES" if "3des" in text.lower() else ("AES-256" if "aes-256" in text.lower() else "DES")]
        if not integrity:
            integrity = ["MD5" if "md5" in text.lower() else ("SHA-256" if "sha-256" in text.lower() else "SHA-1")]
        if not dh_groups:
            dh_groups = ["DH Group 2" if "group 2" in text.lower() else "DH Group 14"]

        return {
            "vendor": "Cisco ASA / IOS-XE",
            "ike_version": ike_version,
            "encryption": list(set(encryption)),
            "integrity": list(set(integrity)),
            "dh_groups": list(set(dh_groups)),
            "authentication": auth_method,
            "pfs": pfs,
            "aggressive_mode": aggressive_mode,
            "lifetime": 28800,
            "raw_lines": len(text.splitlines())
        }

    @staticmethod
    def _parse_strongswan(text: str) -> Dict[str, Any]:
        ike_version = "IKEv2"
        if "keyexchange=ikev1" in text.lower():
            ike_version = "IKEv1"

        encryption = []
        integrity = []
        dh_groups = []
        auth_method = "Pre-Shared Key (PSK)"
        pfs = "Enabled" if "esp=" in text.lower() and "-" in text.lower() else "Disabled"
        aggressive_mode = "aggressive=yes" in text.lower()

        # Parse ike= and esp= lines
        for match in re.finditer(r"(?:ike|esp)\s*=\s*([^\n]+)", text, re.I):
            proposals = match.group(1).split(",")
            for prop in proposals:
                parts = prop.strip().split("-")
                if len(parts) >= 1:
                    encryption.append(parts[0].upper())
                if len(parts) >= 2:
                    integrity.append(parts[1].upper())
                if len(parts) >= 3:
                    dh_num = re.sub(r"[^0-9]", "", parts[2])
                    dh_groups.append(f"DH Group {dh_num}" if dh_num else parts[2].upper())

        if "authby=pubkey" in text.lower() or "authby=rsasig" in text.lower():
            auth_method = "X.509 Certificate (RSA/ECDSA)"

        if not encryption:
            encryption = ["AES-128-CBC"]
        if not integrity:
            integrity = ["SHA2-256"]
        if not dh_groups:
            dh_groups = ["DH Group 14"]

        return {
            "vendor": "strongSwan (swanctl/ipsec.conf)",
            "ike_version": ike_version,
            "encryption": list(set(encryption)),
            "integrity": list(set(integrity)),
            "dh_groups": list(set(dh_groups)),
            "authentication": auth_method,
            "pfs": pfs,
            "aggressive_mode": aggressive_mode,
            "lifetime": 3600,
            "raw_lines": len(text.splitlines())
        }

    @staticmethod
    def _parse_pfsense(text: str) -> Dict[str, Any]:
        return {
            "vendor": "pfSense / OPNsense BSD",
            "ike_version": "IKEv2" if "ikev2" in text.lower() else "IKEv1",
            "encryption": ["AES-256-GCM"] if "gcm" in text.lower() else ["AES-CBC-256", "3DES"],
            "integrity": ["SHA256"] if "sha256" in text.lower() else ["SHA1"],
            "dh_groups": ["DH Group 14", "DH Group 21"] if "group 14" in text.lower() else ["DH Group 2"],
            "authentication": "Mutual RSA Certificate" if "cert" in text.lower() else "Pre-Shared Key (PSK)",
            "pfs": "Enabled" if "pfs" in text.lower() else "Disabled",
            "aggressive_mode": "aggressive" in text.lower(),
            "lifetime": 28800,
            "raw_lines": len(text.splitlines())
        }

    @staticmethod
    def _parse_fortinet(text: str) -> Dict[str, Any]:
        return {
            "vendor": "Fortinet FortiOS",
            "ike_version": "IKEv2" if "ike 2" in text.lower() or "ikev2" in text.lower() else "IKEv1",
            "encryption": ["AES256", "CHACHA20-POLY1305"] if "aes256" in text.lower() else ["3DES"],
            "integrity": ["SHA256"] if "sha256" in text.lower() else ["MD5"],
            "dh_groups": ["DH Group 14", "DH Group 19"] if "14" in text.lower() else ["DH Group 5"],
            "authentication": "Signature (PKI)" if "signature" in text.lower() else "Pre-Shared Key (PSK)",
            "pfs": "Enabled" if "set pfs enable" in text.lower() else "Disabled",
            "aggressive_mode": "set mode aggressive" in text.lower(),
            "lifetime": 86400,
            "raw_lines": len(text.splitlines())
        }

    @staticmethod
    def _parse_generic(text: str) -> Dict[str, Any]:
        return {
            "vendor": "Generic IPsec Appliance",
            "ike_version": "IKEv1" if "ikev1" in text.lower() else "IKEv2",
            "encryption": ["AES-256-CBC"] if "aes" in text.lower() else ["3DES"],
            "integrity": ["SHA-256"] if "sha" in text.lower() else ["MD5"],
            "dh_groups": ["DH Group 14"] if "group 14" in text.lower() else ["DH Group 2"],
            "authentication": "Pre-Shared Key (PSK)",
            "pfs": "Disabled",
            "aggressive_mode": "aggressive" in text.lower(),
            "lifetime": 28800,
            "raw_lines": len(text.splitlines())
        }
