import re
from typing import Dict, Any, List

class VPNLogParser:
    """Parses IPsec/VPN syslog, charon.log, racoon, and ASA auth events."""

    @staticmethod
    def parse_logs(log_text: str) -> Dict[str, Any]:
        lines = log_text.splitlines()
        auth_failures = 0
        rekey_events = 0
        proposal_mismatches = 0
        unrecognized_peers = 0
        events = []

        for line in lines:
            if re.search(r"auth(?:entication)?\s+failed|invalid\s+credentials|bad\s+psk", line, re.I):
                auth_failures += 1
                events.append({"type": "AUTH_FAILURE", "line": line[:100]})
            elif re.search(r"rekey|new\s+spi|sa\s+renegotiation", line, re.I):
                rekey_events += 1
            elif re.search(r"no\s+proposal\s+chosen|mismatch|unsupported\s+transform", line, re.I):
                proposal_mismatches += 1
                events.append({"type": "PROPOSAL_MISMATCH", "line": line[:100]})
            elif re.search(r"unknown\s+peer|peer\s+unreachable|connection\s+refused", line, re.I):
                unrecognized_peers += 1

        is_under_attack = auth_failures > 10 or proposal_mismatches > 5
        return {
            "total_lines_analyzed": len(lines),
            "auth_failures": auth_failures,
            "rekey_events": rekey_events,
            "proposal_mismatches": proposal_mismatches,
            "unrecognized_peers": unrecognized_peers,
            "threat_detected": is_under_attack,
            "threat_summary": "Brute-force or negotiation enumeration detected" if is_under_attack else "Normal operating baseline",
            "recent_events": events[:10]
        }
