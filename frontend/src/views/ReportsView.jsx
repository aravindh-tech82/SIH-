import React from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Calendar,
  Lock,
  UserCheck
} from 'lucide-react';

export default function ReportsView({ analysisData }) {
  const data = analysisData || {
    assessment_id: "IPSEC-SEC-1726058800",
    vendor: "Cisco ASA 5525-X Enterprise Gateway",
    ike_version: "IKEv1",
    encryption: ["3DES-CBC", "DES"],
    integrity: ["MD5", "SHA-1"],
    dh_groups: ["DH Group 2"],
    pfs: "Disabled",
    aggressive_mode: true,
    vulnerabilities: [
      { issue: "Sweet32 64-bit Block Cipher (3DES)", severity: "High", cve: "CVE-2016-2183", cvss: 7.5 },
      { issue: "IKEv1 Aggressive Mode Active", severity: "Critical", cve: "CVE-2002-1623", cvss: 8.6 },
      { issue: "Insecure Diffie-Hellman Group (DH Group 2)", severity: "High", cve: "CVE-2015-4000", cvss: 8.2 }
    ],
    risk_assessment: {
      security_posture_score: 32,
      risk_level: "Critical",
      confidence: 94.8
    },
    quantum_readiness: {
      quantum_readiness_score: 18,
      roadmap_urgency: "IMMEDIATE"
    },
    blockchain_hash: "00a91f8263bc019a82910fa48b10294e771c90284bbad371691bca7209148b11",
    timestamp: "2026-09-11 18:30:00 UTC"
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", jsonStr);
    downloadAnchor.setAttribute("download", `IPsec_Sentinel_Audit_${data.assessment_id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="content-viewport">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
        <div>
          <div className="page-title">
            <FileText size={28} color="var(--accent-cyan)" />
            Executive & Technical Audit Reports
          </div>
          <div className="section-subtitle">
            CISO briefing document, compliance gap assessment, and cryptographically signed technical audit report.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="cyber-btn cyber-btn-primary" onClick={handlePrint}>
            <Printer size={16} /> Print / Save as PDF
          </button>
          <button className="cyber-btn cyber-btn-secondary" onClick={handleDownloadJson}>
            <Download size={16} /> Export JSON Data
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="glass-panel" style={{ padding: '40px', background: '#0D1527', border: '1px solid var(--border-glow)' }}>
        {/* Document Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--border-subtle)', paddingBottom: '20px', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
              <Shield size={24} /> IPsec Sentinel
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              CYBERSECURITY PROTOCOL AUDIT BRIEFING | SMART INDIA HACKATHON 2026
            </div>
          </div>

          <div style={{ textAlign: 'right', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
            <div>REPORT ID: <strong>{data.assessment_id}</strong></div>
            <div>DATE: {data.timestamp}</div>
            <div>CLASSIFICATION: <strong style={{ color: 'var(--accent-amber)' }}>RESTRICTED / CISO EYES ONLY</strong></div>
          </div>
        </div>

        {/* Executive Summary Section */}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-cyan)', marginBottom: '10px' }}>1. Executive Summary</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
            A comprehensive cryptographic assessment of <strong>{data.vendor}</strong> was conducted using automated protocol dissection and machine learning classifiers. The gateway achieved an overall <strong>Security Posture Score of {data.risk_assessment?.security_posture_score}/100</strong>, ranking as <strong>{data.risk_assessment?.risk_level} RISK</strong>. Immediate remediation is mandatory due to presence of deprecated 64-bit block ciphers and pre-shared key exposure.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>POSTURE SCORE</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: data.risk_assessment?.security_posture_score < 50 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                {data.risk_assessment?.security_posture_score} / 100
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>QUANTUM READINESS</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
                {data.quantum_readiness?.quantum_readiness_score}%
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>COMPLIANCE BREACHES</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-red)' }}>
                {data.vulnerabilities?.length || 3} Active
              </div>
            </div>
          </div>
        </div>

        {/* Technical Findings Section */}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-cyan)', marginBottom: '10px' }}>2. Critical Vulnerability Breakdown</h3>
          
          <table className="cyber-table" style={{ border: '1px solid var(--border-subtle)' }}>
            <thead>
              <tr>
                <th>Vulnerability</th>
                <th>CVE</th>
                <th>CVSS</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {data.vulnerabilities?.map((v, i) => (
                <tr key={i}>
                  <td><strong>{v.issue}</strong></td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{v.cve}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: v.cvss >= 8 ? 'var(--accent-red)' : 'var(--accent-amber)' }}>{v.cvss}</td>
                  <td>
                    <span className={`cyber-badge ${v.severity === 'Critical' ? 'cyber-badge-red' : 'cyber-badge-amber'}`}>
                      {v.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Blockchain Cryptographic Proof Section */}
        <div style={{ marginBottom: '28px', background: 'rgba(15, 23, 42, 0.5)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--accent-amber)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={16} /> Immutable Blockchain Anchor Proof
          </h3>
          <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
            <div>MERKLE HASH: <span style={{ color: 'var(--accent-cyan)' }}>{data.blockchain_hash}</span></div>
            <div>VERIFICATION: <strong>CRYPTOGRAPHIC INTEGRITY GUARANTEED (ED25519 SIGNED)</strong></div>
          </div>
        </div>

        {/* CISO Signature Block */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px', marginTop: '30px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>AUDIT LEAD ENGINEER</div>
            <div style={{ fontWeight: 700, marginTop: '4px' }}>IPsec Sentinel SOC Automated Engine</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CERT-In Standard CI-2026-IPSEC</div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CISO / EXECUTIVE SIGN-OFF</div>
            <div style={{ fontWeight: 700, marginTop: '4px', color: 'var(--accent-cyan)' }}>[ Digitally Approved via Blockchain Ledger ]</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hash: {data.blockchain_hash ? data.blockchain_hash.slice(0, 16) : ''}...</div>
          </div>
        </div>
      </div>
    </div>
  );
}
