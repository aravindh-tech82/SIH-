import React from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  ExternalLink, 
  Bot, 
  CheckCircle2, 
  XCircle,
  FileCode,
  ArrowRight
} from 'lucide-react';

export default function VulnerabilitiesView({ analysisData, setActiveTab, onAskCopilot }) {
  const vulnerabilities = analysisData?.vulnerabilities || [
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
    }
  ];

  return (
    <div className="content-viewport">
      <div className="page-title">
        <AlertTriangle size={28} color="var(--accent-red)" />
        Vulnerability Detection & Compliance Matrix
      </div>
      <div className="section-subtitle" style={{ marginBottom: '24px' }}>
        Identified cryptographic weaknesses, CVE signatures, and compliance mapping against NIST SP 800-77 & PCI-DSS.
      </div>

      {/* Compliance Matrix Bar */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '14px' }}>Regulatory Compliance Posture</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <XCircle size={18} color="var(--accent-red)" />
              <strong style={{ fontSize: '0.9rem' }}>NIST SP 800-77 Rev 1</strong>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-red)' }}>
              FAILED: 3DES and DH Group 2 are strictly deprecated.
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <XCircle size={18} color="var(--accent-red)" />
              <strong style={{ fontSize: '0.9rem' }}>PCI-DSS v4.0 (Req 4.1)</strong>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-red)' }}>
              BREACH: Cardholder transmission encrypted with 64-bit cipher.
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <XCircle size={18} color="var(--accent-amber)" />
              <strong style={{ fontSize: '0.9rem' }}>RFC 7296 (IKEv2)</strong>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-amber)' }}>
              NON-COMPLIANT: Gateway still running obsolete IKEv1 protocol.
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <XCircle size={18} color="var(--accent-red)" />
              <strong style={{ fontSize: '0.9rem' }}>CERT-In Advisory CI-2023</strong>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-red)' }}>
              HIGH RISK: PSK offline brute-forcing attack path exposed.
            </div>
          </div>
        </div>
      </div>

      {/* Vulnerability Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '16px' }}>Detected Cryptographic CVE Vulnerabilities</h3>

        <div className="cyber-table-container">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>Vulnerability & CVE</th>
                <th>Severity</th>
                <th>CVSS v3.1</th>
                <th>Target Layer</th>
                <th>Threat & Exploitation Impact</th>
                <th>Remediation Guidance</th>
                <th>AI Copilot</th>
              </tr>
            </thead>
            <tbody>
              {vulnerabilities.map((vuln, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{vuln.issue}</div>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                      {vuln.cve}
                    </div>
                  </td>
                  <td>
                    <span className={`cyber-badge ${vuln.severity === 'Critical' ? 'cyber-badge-red' : (vuln.severity === 'High' ? 'cyber-badge-amber' : 'cyber-badge-green')}`}>
                      {vuln.severity}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    <span style={{ color: vuln.cvss >= 8 ? 'var(--accent-red)' : 'var(--accent-amber)' }}>
                      {vuln.cvss}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{vuln.layer}</td>
                  <td style={{ maxWidth: '280px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {vuln.impact}
                  </td>
                  <td style={{ maxWidth: '240px', fontSize: '0.82rem', color: 'var(--accent-green)' }}>
                    {vuln.remediation}
                  </td>
                  <td>
                    <button
                      className="cyber-btn cyber-btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '6px 10px' }}
                      onClick={() => {
                        onAskCopilot(vuln);
                        setActiveTab('copilot');
                      }}
                    >
                      <Bot size={14} /> Explain Fix
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
