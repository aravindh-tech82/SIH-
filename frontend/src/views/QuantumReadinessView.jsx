import React from 'react';
import { 
  Atom, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Clock,
  Layers,
  Zap
} from 'lucide-react';

export default function QuantumReadinessView({ analysisData }) {
  const pqc = analysisData?.quantum_readiness || {
    quantum_readiness_score: 35,
    vulnerable_count: 3,
    transitional_count: 1,
    quantum_safe_count: 1,
    total_findings: 5,
    roadmap_urgency: 'IMMEDIATE',
    details: [
      { algorithm: 'DH Group 2', pqc_status: 'VULNERABLE', quantum_threat: "Shor's Algorithm (Discrete Log)", migration_fix: 'Replace with NIST FIPS 203 (ML-KEM-768)' },
      { algorithm: '3DES', pqc_status: 'VULNERABLE', quantum_threat: "Sweet32 + Grover's Algorithm", migration_fix: 'Upgrade to AES-256-GCM' },
      { algorithm: 'MD5', pqc_status: 'VULNERABLE', quantum_threat: 'Classical & Quantum Collision', migration_fix: 'Upgrade to SHA-384' },
      { algorithm: 'DH Group 14', pqc_status: 'TRANSITIONAL', quantum_threat: 'Harvest Now, Decrypt Later (HNDL)', migration_fix: 'Adopt Hybrid ECDH + ML-KEM-768' },
      { algorithm: 'AES-256-GCM', pqc_status: 'QUANTUM_RESISTANT', quantum_threat: "Grover's reduces to 128-bit (Secure)", migration_fix: 'None needed (CNSA 2.0 compliant)' }
    ]
  };

  return (
    <div className="content-viewport">
      <div className="page-title">
        <Atom size={28} color="var(--accent-purple)" />
        Post-Quantum Cryptography (PQC) Readiness Center
      </div>
      <div className="section-subtitle" style={{ marginBottom: '24px' }}>
        Quantum threat impact analysis against Shor's & Grover's algorithms with NIST FIPS 203/204 migration guidance.
      </div>

      {/* Top Banner KPI */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', borderLeft: '4px solid var(--accent-purple)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              QUANTUM READINESS INDEX (QRI)
            </div>
            <div style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
              {pqc.quantum_readiness_score}%
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Migration Priority: <strong style={{ color: pqc.roadmap_urgency === 'IMMEDIATE' ? 'var(--accent-red)' : 'var(--accent-amber)' }}>{pqc.roadmap_urgency}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '14px 20px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-red)' }}>VULNERABLE ALGORITHMS</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-red)' }}>{pqc.vulnerable_count}</div>
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '14px 20px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-amber)' }}>TRANSITIONAL (HYBRID)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-amber)' }}>{pqc.transitional_count}</div>
            </div>

            <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '14px 20px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)' }}>QUANTUM SAFE (PQC)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-green)' }}>{pqc.quantum_safe_count}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Shor's vs Grover's Threat Analysis Table */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '16px' }}>Quantum Cryptanalysis Matrix</h3>

        <div className="cyber-table-container">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>Evaluated Algorithm</th>
                <th>PQC Security Status</th>
                <th>Quantum Cryptanalysis Vector</th>
                <th>Target Standard (NIST FIPS / CNSA 2.0)</th>
                <th>Remediation Roadmap</th>
              </tr>
            </thead>
            <tbody>
              {pqc.details?.map((item, idx) => (
                <tr key={idx}>
                  <td><strong>{item.algorithm || item.issue}</strong></td>
                  <td>
                    <span className={`cyber-badge ${item.pqc_status === 'QUANTUM_RESISTANT' ? 'cyber-badge-green' : (item.pqc_status === 'TRANSITIONAL' ? 'cyber-badge-amber' : 'cyber-badge-red')}`}>
                      {item.pqc_status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{item.quantum_threat}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--accent-cyan)' }}>
                    {item.pqc_status === 'QUANTUM_RESISTANT' ? 'CNSA 2.0 Compliant' : 'NIST FIPS 203 (ML-KEM)'}
                  </td>
                  <td style={{ color: 'var(--accent-green)', fontSize: '0.85rem' }}>{item.migration_fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NIST CNSA 2.0 Migration Timeline Guide */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Clock size={18} color="var(--accent-cyan)" />
          NIST & NSA CNSA 2.0 Quantum Migration Timeline
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '6px' }}>Phase 1 (2024 - 2026)</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Discovery & Inventory. Identify all classical DH/RSA keys. Adopt Hybrid Key Exchange (X25519 + Kyber-768) in test environments.
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--accent-amber)', fontWeight: 700, marginBottom: '6px' }}>Phase 2 (2026 - 2030)</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Mandatory PQC enforcement for government and critical infrastructure gateways. Deprecate pure classical Diffie-Hellman completely.
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--accent-green)', fontWeight: 700, marginBottom: '6px' }}>Phase 3 (2033+)</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Full Post-Quantum compliance. Pure ML-KEM-1024 and ML-DSA-87 signatures enforced. Legacy algorithms completely blocked.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
