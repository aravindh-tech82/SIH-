import React, { useState } from 'react';
import { 
  Link as ChainIcon, 
  ShieldCheck, 
  AlertOctagon, 
  RefreshCw, 
  CheckCircle2, 
  XCircle,
  Hash,
  Clock,
  Key,
  Flame,
  Zap
} from 'lucide-react';

export default function BlockchainAuditView({ ledgerData, onVerify, onTamper, onRestore, isVerifying }) {
  const [selectedBlock, setSelectedBlock] = useState(null);

  const blocks = ledgerData?.ledger || [
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
  ];

  const verification = ledgerData?.verification || { valid: true, status: "CHAIN_INTEGRITY_VERIFIED" };

  return (
    <div className="content-viewport">
      <div className="page-title">
        <ChainIcon size={28} color="var(--accent-amber)" />
        Blockchain Audit Trail & Integrity Verifier
      </div>
      <div className="section-subtitle" style={{ marginBottom: '24px' }}>
        Cryptographically anchored audit logging. Every assessment is immortalized in a SHA-256 Merkle chain with digital signatures and tamper detection.
      </div>

      {/* Verification Status Banner */}
      <div className="glass-panel" style={{
        padding: '20px 24px',
        marginBottom: '24px',
        borderLeft: `4px solid ${verification.valid ? 'var(--accent-green)' : 'var(--accent-red)'}`,
        background: verification.valid ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.12)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {verification.valid ? (
              <CheckCircle2 size={32} color="var(--accent-green)" />
            ) : (
              <AlertOctagon size={32} color="var(--accent-red)" />
            )}
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: verification.valid ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                {verification.valid ? 'IMMUTABLE AUDIT TRAIL VERIFIED: 100% INTACT' : 'TAMPER BREACH DETECTED: AUDIT INTEGRITY SEVERED!'}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {verification.valid 
                  ? `All ${blocks.length} blocks passed cryptographic hash and previous-link validation.`
                  : (verification.reason || 'Cryptographic hash mismatch in block! Data modification detected.')}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {verification.valid ? (
              <button
                className="cyber-btn cyber-btn-danger"
                style={{ fontSize: '0.8rem' }}
                onClick={() => onTamper(Math.max(0, blocks.length - 1))}
                title="Simulates tampering with a past report to show jury how the blockchain flags the breach"
              >
                <Flame size={14} /> Simulate Malicious Tampering (Jury Demo)
              </button>
            ) : (
              <button
                className="cyber-btn cyber-btn-primary"
                style={{ fontSize: '0.8rem' }}
                onClick={onRestore}
              >
                <RefreshCw size={14} /> Restore & Re-Validate Chain
              </button>
            )}

            <button
              className="cyber-btn cyber-btn-secondary"
              style={{ fontSize: '0.8rem' }}
              onClick={onVerify}
              disabled={isVerifying}
            >
              <ShieldCheck size={14} /> Re-verify Cryptography
            </button>
          </div>
        </div>
      </div>

      {/* Visual Chain Blocks Feed */}
      <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Immutable Ledger Blocks</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        {blocks.map((b, idx) => (
          <div
            key={idx}
            className="glass-panel"
            style={{
              padding: '20px',
              border: b.verified === false ? '1px solid var(--accent-red)' : '1px solid var(--border-subtle)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="cyber-badge cyber-badge-cyan">BLOCK #{b.index}</span>
                <strong style={{ fontSize: '0.95rem' }}>{b.assessment_id}</strong>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                TIMESTAMP: {b.timestamp}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
              <div style={{ background: '#060B13', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>BLOCK HASH (SHA-256)</div>
                <div style={{ color: 'var(--accent-cyan)', wordBreak: 'break-all' }}>{b.hash}</div>
              </div>

              <div style={{ background: '#060B13', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>PREVIOUS BLOCK HASH</div>
                <div style={{ color: 'var(--text-secondary)', wordBreak: 'break-all' }}>{b.prev_hash}</div>
              </div>

              <div style={{ background: '#060B13', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>REPORT PAYLOAD HASH</div>
                <div style={{ color: '#FCD34D', wordBreak: 'break-all' }}>{b.report_hash}</div>
              </div>

              <div style={{ background: '#060B13', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>DIGITAL SIGNATURE & NONCE</div>
                <div style={{ color: 'var(--accent-green)' }}>{b.signature || `SIG-OK`} | Nonce: {b.nonce}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
