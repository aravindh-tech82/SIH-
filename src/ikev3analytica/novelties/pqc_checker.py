from typing import Dict, Any, List

PQC_MAP = {
    # Legacy / Vulnerable classical asymmetric & symmetric
    "DH Group 1":  {"status": "VULNERABLE", "threat": "Shor's Algorithm (Discrete Log)", "fix": "Replace with NIST FIPS 203 (ML-KEM-768)"},
    "DH Group 2":  {"status": "VULNERABLE", "threat": "Shor's Algorithm (Discrete Log)", "fix": "Replace with NIST FIPS 203 (ML-KEM-768)"},
    "DH Group 5":  {"status": "VULNERABLE", "threat": "Shor's Algorithm (Discrete Log)", "fix": "Replace with NIST FIPS 203 (ML-KEM-768)"},
    "DH Group 14": {"status": "TRANSITIONAL", "threat": "Harvest Now, Decrypt Later (HNDL)", "fix": "Adopt Hybrid ECDH (X25519) + ML-KEM-768"},
    "DH Group 19": {"status": "TRANSITIONAL", "threat": "Shor's Algorithm (ECDLP)", "fix": "Adopt Hybrid ECDH (X25519) + ML-KEM-768"},
    "DH Group 20": {"status": "TRANSITIONAL", "threat": "Shor's Algorithm (ECDLP)", "fix": "Adopt Hybrid ECDH (P-384) + ML-KEM-1024"},
    "DH Group 21": {"status": "TRANSITIONAL", "threat": "Shor's Algorithm (ECDLP)", "fix": "Adopt Hybrid ECDH (P-521) + ML-KEM-1024"},
    "RSA-1024":    {"status": "CRITICAL",   "threat": "Classical Factorization + Shor's", "fix": "Replace with NIST FIPS 204 (ML-DSA-65)"},
    "RSA-2048":    {"status": "VULNERABLE", "threat": "Shor's Algorithm (Integer Factorization)", "fix": "Migrate to NIST FIPS 204 (ML-DSA-65 / Dilithium)"},
    "RSA-4096":    {"status": "VULNERABLE", "threat": "Shor's Algorithm (Quantum Computable)", "fix": "Migrate to NIST FIPS 204 (ML-DSA-87)"},
    "ECDSA-256":   {"status": "VULNERABLE", "threat": "Shor's Algorithm (Elliptic Curve DLP)", "fix": "Migrate to ML-DSA or SLH-DSA (SPHINCS+)"},
    "3DES":        {"status": "VULNERABLE", "threat": "Sweet32 Birthday Attack + Grover's", "fix": "Upgrade to AES-256-GCM"},
    "DES":         {"status": "VULNERABLE", "threat": "56-bit Key Exhaustion + Grover's", "fix": "Upgrade to AES-256-GCM"},
    "MD5":         {"status": "VULNERABLE", "threat": "Collision Attack (Flame Malware)", "fix": "Upgrade to SHA-384 / SHA-512"},
    "SHA-1":       {"status": "VULNERABLE", "threat": "SHAttered Collision Attack", "fix": "Upgrade to SHA-384 / SHA-512"},
    "AES-128":     {"status": "ACCEPTABLE", "threat": "Grover's reduces effective security to 64-bit", "fix": "Upgrade to AES-256 for 128-bit quantum security"},
    "AES-256":     {"status": "QUANTUM_RESISTANT", "threat": "Grover's reduces to 128-bit (Secure)", "fix": "None needed (Complies with CNSA 2.0)"},
    "AES-256-GCM": {"status": "QUANTUM_RESISTANT", "threat": "Grover's reduces to 128-bit (Secure)", "fix": "None needed (Complies with CNSA 2.0)"},
    "CHACHA20-POLY1305": {"status": "QUANTUM_RESISTANT", "threat": "Grover's reduces to 128-bit (Secure)", "fix": "None needed"},
    "SHA-256":     {"status": "ACCEPTABLE", "threat": "Grover's/Brassard collision search", "fix": "Upgrade to SHA-384 for CNSA 2.0"},
    "SHA-384":     {"status": "QUANTUM_RESISTANT", "threat": "192-bit quantum collision security", "fix": "None needed"},
    "SHA-512":     {"status": "QUANTUM_RESISTANT", "threat": "256-bit quantum collision security", "fix": "None needed"},
    "ML-KEM":      {"status": "QUANTUM_RESISTANT", "threat": "None (Lattice-based Module-LWE)", "fix": "Complies with NIST FIPS 203"},
    "ML-KEM-768":  {"status": "QUANTUM_RESISTANT", "threat": "None (Security Category 3)", "fix": "Production PQC Standard"},
    "ML-KEM-1024": {"status": "QUANTUM_RESISTANT", "threat": "None (Security Category 5)", "fix": "Top Secret CNSA 2.0 Standard"},
    "ML-DSA":      {"status": "QUANTUM_RESISTANT", "threat": "None (Lattice-based Module-SIS)", "fix": "Complies with NIST FIPS 204"}
}

def pqc_score(findings: list) -> dict:
    total = len(findings) or 1
    vulnerable = 0
    transitional = 0
    quantum_safe = 0
    details = []

    for f in findings:
        algo = f.get("algorithm") or f.get("issue", "")
        # normalize
        matched_meta = None
        for key, val in PQC_MAP.items():
            if key.lower() in str(algo).lower() or str(algo).lower() in key.lower():
                matched_meta = val
                break
        if not matched_meta:
            matched_meta = {"status": "TRANSITIONAL", "threat": "Undetermined post-quantum resistance", "fix": "Inspect against NIST IR 8412"}

        status = matched_meta["status"]
        if status in ("VULNERABLE", "CRITICAL"):
            vulnerable += 1
        elif status == "TRANSITIONAL":
            transitional += 1
        elif status in ("QUANTUM_RESISTANT", "SAFE"):
            quantum_safe += 1

        details.append({
            **f,
            "pqc_status": status,
            "quantum_threat": matched_meta.get("threat", "N/A"),
            "migration_fix": matched_meta.get("fix", "N/A")
        })

    # Weighted calculation: Safe=100%, Transitional=50%, Vulnerable=0%
    score = round(((quantum_safe * 1.0 + transitional * 0.5) / total) * 100)
    score = max(5, min(100, score))

    roadmap_urgency = "IMMEDIATE" if vulnerable > 0 else ("MODERATE" if transitional > 0 else "COMPLIANT")

    return {
        "quantum_readiness_score": score,
        "vulnerable_count": vulnerable,
        "transitional_count": transitional,
        "quantum_safe_count": quantum_safe,
        "total_findings": total,
        "roadmap_urgency": roadmap_urgency,
        "nist_standard_compliance": {
            "fips_203_ml_kem": "NON_COMPLIANT" if vulnerable > 0 else "PARTIAL",
            "fips_204_ml_dsa": "NON_COMPLIANT" if any("RSA" in str(f) for f in findings) else "COMPLIANT",
            "cnsa_2_timeline": "Mandatory migration by 2030 (NSA Commercial National Security Algorithm Suite 2.0)"
        },
        "details": details
    }
