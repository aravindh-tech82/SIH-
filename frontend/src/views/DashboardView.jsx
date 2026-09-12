import React from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Atom, 
  Cpu, 
  Lock, 
  Server, 
  ArrowUpRight, 
  ArrowDownRight,
  Terminal,
  Zap,
  CheckCircle2,
  ChevronRight,
  Bot,
  Link as ChainIcon,
  FileText
} from 'lucide-react';

export default function DashboardView({ analysisData, setActiveTab, onStartDemo }) {
  const score = analysisData?.risk_assessment?.security_posture_score ?? 68;
  const pqcScore = analysisData?.quantum_readiness?.quantum_readiness_score ?? 42;
  const vulnTotal = analysisData?.vulnerabilities?.length ?? 4;
  const isCritical = score < 50;

  return (
    <div className="content-viewport">
      {/* View Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="page-title">
            <Activity size={28} color="var(--accent-cyan)" />
            SOC Enterprise Security Operations
          </div>
          <div className="section-subtitle">
            Real-time IPsec VPN posture, automated risk classification, and quantum readiness metrics.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="button"
            id="btn-analyze-vpn"
            className="cyber-btn cyber-btn-primary"
            onClick={() => setActiveTab('analyzer')}
          >
            <Terminal size={16} /> Analyze New VPN
          </button>
          <button 
            type="button"
            id="btn-run-demo-flow"
            className="cyber-btn cyber-btn-demo"
            onClick={onStartDemo}
          >
            <Zap size={16} /> Run SIH Jury Flow
          </button>
        </div>
      </div>

      {/* Quick Access Module Hub */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        overflowX: 'auto', 
        paddingBottom: '12px', 
        marginBottom: '20px',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <button 
          type="button"
          onClick={() => setActiveTab('analyzer')}
          className="cyber-btn cyber-btn-secondary"
          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
        >
          <Terminal size={14} color="var(--accent-cyan)" /> Deep Analyzer
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('vulnerabilities')}
          className="cyber-btn cyber-btn-secondary"
          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
        >
          <AlertTriangle size={14} color="var(--accent-red)" /> CVE Matrix ({vulnTotal})
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('copilot')}
          className="cyber-btn cyber-btn-secondary"
          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
        >
          <Bot size={14} color="var(--accent-cyan)" /> AI Cyber Copilot
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('ml')}
          className="cyber-btn cyber-btn-secondary"
          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
        >
          <Cpu size={14} color="var(--accent-green)" /> Scikit-learn ML Lab
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('pqc')}
          className="cyber-btn cyber-btn-secondary"
          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
        >
          <Atom size={14} color="var(--accent-purple)" /> Post-Quantum PQC
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('blockchain')}
          className="cyber-btn cyber-btn-secondary"
          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
        >
          <ChainIcon size={14} color="#FCD34D" /> Blockchain Audit
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('reports')}
          className="cyber-btn cyber-btn-secondary"
          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
        >
          <FileText size={14} color="#A5F3FC" /> Executive Report
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="metrics-grid">
        {/* Security Posture Score */}
        <div 
          className="glass-panel metric-card" 
          onClick={() => setActiveTab('vulnerabilities')}
          style={{ 
            borderLeft: `4px solid ${isCritical ? 'var(--accent-red)' : 'var(--accent-green)'}`,
            cursor: 'pointer' 
          }}
          title="Click to view Vulnerability & Compliance Matrix"
        >
          <div className="metric-label">
            <span>SECURITY POSTURE</span>
            <Shield size={16} color={isCritical ? 'var(--accent-red)' : 'var(--accent-green)'} />
          </div>
          <div className="metric-value" style={{ color: isCritical ? 'var(--accent-red)' : 'var(--accent-green)' }}>
            {score}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/100</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: isCritical ? 'var(--accent-red)' : 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {isCritical ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
            <span>{isCritical ? 'CRITICAL EXPOSURE DETECTED' : 'ENTERPRISE BASELINE SECURE'}</span>
          </div>
        </div>

        {/* Quantum Readiness Score */}
        <div 
          className="glass-panel metric-card" 
          onClick={() => setActiveTab('pqc')}
          style={{ 
            borderLeft: '4px solid var(--accent-purple)',
            cursor: 'pointer' 
          }}
          title="Click to view Post-Quantum Cryptography Assessment"
        >
          <div className="metric-label">
            <span>QUANTUM READINESS</span>
            <Atom size={16} color="var(--accent-purple)" />
          </div>
          <div className="metric-value" style={{ color: 'var(--accent-purple)' }}>
            {pqcScore}%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            NIST FIPS 203: <strong>{pqcScore > 75 ? 'READY' : 'MIGRATION REQUIRED'}</strong>
          </div>
        </div>

        {/* Active Vulnerabilities */}
        <div 
          className="glass-panel metric-card" 
          onClick={() => setActiveTab('vulnerabilities')}
          style={{ 
            borderLeft: '4px solid var(--accent-amber)',
            cursor: 'pointer' 
          }}
          title="Click to inspect CVE Findings"
        >
          <div className="metric-label">
            <span>CVE FINDINGS</span>
            <AlertTriangle size={16} color="var(--accent-amber)" />
          </div>
          <div className="metric-value" style={{ color: 'var(--accent-amber)' }}>
            {vulnTotal}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Sweet32, Logjam, Broken Hashes
          </div>
        </div>

        {/* AI Anomaly Detector */}
        <div 
          className="glass-panel metric-card" 
          onClick={() => setActiveTab('ml')}
          style={{ 
            borderLeft: '4px solid var(--accent-cyan)',
            cursor: 'pointer' 
          }}
          title="Click to inspect AI Machine Learning Models"
        >
          <div className="metric-label">
            <span>TUNNEL ANOMALY MODEL</span>
            <Cpu size={16} color="var(--accent-cyan)" />
          </div>
          <div className="metric-value" style={{ color: 'var(--accent-cyan)', fontSize: '1.7rem' }}>
            {analysisData?.anomaly_detection?.status === 'ANOMALY_DETECTED' ? 'ANOMALY' : 'NORMAL'}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>
            Isolation Forest ({analysisData?.anomaly_detection?.confidence ?? 94.2}% confidence)
          </div>
        </div>
      </div>

      {/* Main Analysis Visualizers Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Active Gateway Telemetry */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Server size={18} color="var(--accent-cyan)" />
              Active Target Gateway Telemetry
            </h3>
            <span className="cyber-badge cyber-badge-cyan">
              {analysisData?.vendor ?? 'Cisco ASA 5525-X'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>IKE PROTOCOL VERSION</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: analysisData?.ike_version === 'IKEv1' ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                {analysisData?.ike_version ?? 'IKEv1 (Legacy RFC 2409)'}
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ENCRYPTION CIPHERS</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {analysisData?.encryption?.join(', ') || '3DES-CBC, DES'}
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DIFFIE-HELLMAN KEY EXCHANGE</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-amber)' }}>
                {analysisData?.dh_groups?.join(', ') || 'DH Group 2 (1024-bit)'}
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PERFECT FORWARD SECRECY (PFS)</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: analysisData?.pfs === 'Enabled' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                {analysisData?.pfs ?? 'Disabled (Replay Risk)'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Blockchain Hash: <span style={{ color: 'var(--accent-cyan)' }}>{analysisData?.blockchain_hash ? `${analysisData.blockchain_hash.slice(0, 24)}...` : '0x7f4a8b92...'}</span>
            </div>
            <button 
              type="button"
              className="cyber-btn cyber-btn-secondary" 
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              onClick={() => setActiveTab('blockchain')}
            >
              Verify on Blockchain
            </button>
          </div>
        </div>

        {/* Cryptographic Algorithm Usage Breakdown */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Cryptographic Risk Distribution</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span>64-bit Block Ciphers (3DES/DES - Vulnerable)</span>
                <span style={{ color: 'var(--accent-red)', fontWeight: 600 }}>65%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: '65%', height: '100%', background: 'var(--accent-red)', borderRadius: 'var(--radius-full)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span>Modern AEAD Ciphers (AES-256-GCM - Compliant)</span>
                <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>25%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: '25%', height: '100%', background: 'var(--accent-green)', borderRadius: 'var(--radius-full)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span>Legacy DH Groups (&lt; 2048-bit - Logjam Attack)</span>
                <span style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>55%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: '55%', height: '100%', background: 'var(--accent-amber)', borderRadius: 'var(--radius-full)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span>Post-Quantum Lattice KEMs (ML-KEM-768)</span>
                <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>10%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: '10%', height: '100%', background: 'var(--accent-purple)', borderRadius: 'var(--radius-full)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
