import React, { useEffect, useRef } from 'react';
import { 
  Shield, 
  Cpu, 
  Atom, 
  Link as ChainIcon, 
  FileText, 
  Zap, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  Server,
  Terminal,
  Activity,
  Network,
  Bot,
  LayoutDashboard
} from 'lucide-react';

export default function LandingPage({ setActiveTab, onStartDemo }) {
  const canvasRef = useRef(null);

  // Animated Network Topology Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const width = (canvas.width = canvas.parentElement.offsetWidth || 800);
    const height = (canvas.height = 360);

    const nodes = [
      { id: 'HQ', label: 'Primary Data Center', x: width * 0.2, y: height * 0.45, color: '#00E5FF', size: 14 },
      { id: 'CLOUD', label: 'AWS VPC (IKEv2 GCM)', x: width * 0.5, y: height * 0.25, color: '#22C55E', size: 12 },
      { id: 'BRANCH', label: 'Branch 04 (3DES Legacy)', x: width * 0.8, y: height * 0.35, color: '#EF4444', size: 12 },
      { id: 'SCADA', label: 'OT Pipeline Gateway', x: width * 0.35, y: height * 0.75, color: '#F59E0B', size: 10 },
      { id: 'SOC', label: 'SOC SIEM (Sentinel)', x: width * 0.65, y: height * 0.75, color: '#8B5CF6', size: 11 },
    ];

    const links = [
      { from: 0, to: 1, secure: true, type: 'IKEv2 (AES-256-GCM)' },
      { from: 0, to: 2, secure: false, type: 'IKEv1 (3DES / MD5 - Sweet32)' },
      { from: 0, to: 3, secure: false, type: 'IKEv1 (DES / No PFS)' },
      { from: 1, to: 4, secure: true, type: 'TLS 1.3 Telemetry' },
      { from: 2, to: 4, secure: false, type: 'Audit Alert Stream' },
    ];

    let t = 0;
    const render = () => {
      t += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Draw Grid Background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const step = 30;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Links & Moving Packets
      links.forEach((link) => {
        const n1 = nodes[link.from];
        const n2 = nodes[link.to];

        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.strokeStyle = link.secure ? 'rgba(34, 197, 94, 0.35)' : 'rgba(239, 68, 68, 0.45)';
        ctx.lineWidth = link.secure ? 2 : 2.5;
        if (!link.secure) ctx.setLineDash([5, 5]);
        else ctx.setLineDash([]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Animated Packet
        const packetProgress = (t * 0.6 + link.from * 0.3) % 1;
        const px = n1.x + (n2.x - n1.x) * packetProgress;
        const py = n1.y + (n2.y - n1.y) * packetProgress;

        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = link.secure ? '#00E5FF' : '#EF4444';
        ctx.shadowColor = link.secure ? '#00E5FF' : '#EF4444';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Nodes
      nodes.forEach((n) => {
        // Glowing Outer Ring
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size + 4 + Math.sin(t * 2) * 2, 0, Math.PI * 2);
        ctx.strokeStyle = n.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Solid Node
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
        ctx.fillStyle = '#0B1220';
        ctx.fill();
        ctx.fillStyle = n.color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size - 3, 0, Math.PI * 2);
        ctx.fill();

        // Node Label
        ctx.font = '600 11px Outfit, sans-serif';
        ctx.fillStyle = '#F8FAFC';
        ctx.textAlign = 'center';
        ctx.fillText(n.label, n.x, n.y + n.size + 16);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="content-viewport">
      {/* Hero Section */}
      <section className="glass-panel" style={{ padding: '36px 40px', marginBottom: '32px', position: 'relative' }}>
        <div className="radar-sweep"></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '30px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '320px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <span className="cyber-badge cyber-badge-cyan">SIH 2026 FINALIST PROJECT</span>
              <span className="cyber-badge cyber-badge-purple">PROBLEM STATEMENT: SIH26160</span>
            </div>

            <h1 style={{ fontSize: '2.8rem', lineHeight: 1.15, fontWeight: 800, marginBottom: '14px' }}>
              AI-Powered <span style={{ color: 'var(--accent-cyan)' }}>IPsec VPN</span> Protocol Analyzer & Sentinel
            </h1>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '680px', marginBottom: '24px' }}>
              An enterprise cybersecurity command-center that dissects PCAP packet streams, parses multi-vendor VPN configs, detects cryptographic vulnerabilities, evaluates Post-Quantum Cryptography readiness, and anchors assessments in an immutable blockchain audit ledger.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button 
                type="button"
                id="btn-hero-enter-dashboard"
                className="cyber-btn cyber-btn-primary"
                onClick={() => setActiveTab('dashboard')}
              >
                <LayoutDashboard size={18} /> Enter SOC Dashboard
              </button>

              <button 
                type="button"
                id="btn-hero-analyzer"
                className="cyber-btn cyber-btn-secondary"
                onClick={() => setActiveTab('analyzer')}
              >
                <Terminal size={18} /> Launch Deep Analyzer
              </button>
              
              <button 
                type="button"
                id="btn-hero-demo"
                className="cyber-btn cyber-btn-demo"
                onClick={onStartDemo}
              >
                <Zap size={18} /> 6-Step SIH Jury Flow
              </button>

              <button 
                type="button"
                id="btn-hero-copilot"
                className="cyber-btn cyber-btn-secondary"
                onClick={() => setActiveTab('copilot')}
              >
                <Bot size={18} /> Ask AI Cyber Copilot
              </button>
            </div>
          </div>

          {/* Quick Metrics Badge Card */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-glow)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            width: '320px',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>
              SYSTEM ARCHITECTURE STATUS
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Protocol Support:</span>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>IKEv1 & IKEv2</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>AI Engine:</span>
              <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>Random Forest</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Anomaly Model:</span>
              <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>Isolation Forest</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>PQC Standard:</span>
              <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>NIST FIPS 203/204</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Audit Trail:</span>
              <span style={{ color: '#FCD34D', fontWeight: 600 }}>SHA-256 Merkle Chain</span>
            </div>
          </div>
        </div>

        {/* Live Network Topology Visualization */}
        <div style={{ marginTop: '28px', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              <Network size={16} color="var(--accent-cyan)" />
              LIVE ENTERPRISE VPN TOPOLOGY & THREAT CORRELATION
            </div>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: 'var(--accent-green)' }}>● SECURE TUNNEL (IKEv2 GCM)</span>
              <span style={{ color: 'var(--accent-red)' }}>● VULNERABLE TUNNEL (3DES / LOGJAM)</span>
            </div>
          </div>
          <div style={{ background: '#070D18', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '360px', display: 'block', pointerEvents: 'none' }}></canvas>
          </div>
        </div>
      </section>

      {/* Core Enterprise Pillars Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div 
          className="glass-panel" 
          onClick={() => setActiveTab('analyzer')}
          style={{ padding: '24px', cursor: 'pointer', transition: 'all 0.2s ease' }}
          title="Click to launch Deep Protocol Analyzer"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'var(--accent-cyan-glow)', color: 'var(--accent-cyan)' }}>
              <Terminal size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Deep Protocol & PCAP Parsing</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SCAPY & MULTI-VENDOR PARSERS</div>
            </div>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Dissects UDP 500/4500 packets and parses Cisco ASA, strongSwan, pfSense, and FortiOS. Extracts IKE versions, transforms, proposals, and certificates in milliseconds.
          </p>
        </div>

        <div 
          className="glass-panel" 
          onClick={() => setActiveTab('ml')}
          style={{ padding: '24px', cursor: 'pointer', transition: 'all 0.2s ease' }}
          title="Click to inspect AI Machine Learning Security Models"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'var(--accent-green-glow)', color: 'var(--accent-green)' }}>
              <Cpu size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>AI/ML Risk & Anomaly Models</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>RANDOM FOREST & ISOLATION FOREST</div>
            </div>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Calculates an automated Security Posture Score (0-100) using Random Forest regression, while Isolation Forest detects abnormal rekey storms and entropy collapse.
          </p>
        </div>

        <div 
          className="glass-panel" 
          onClick={() => setActiveTab('pqc')}
          style={{ padding: '24px', cursor: 'pointer', transition: 'all 0.2s ease' }}
          title="Click to review Post-Quantum Cryptography Readiness"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'var(--accent-purple-glow)', color: 'var(--accent-purple)' }}>
              <Atom size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Post-Quantum Readiness (PQC)</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NIST FIPS 203 (ML-KEM) & FIPS 204</div>
            </div>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Calculates vulnerability against Shor's and Grover's quantum attacks, providing actionable hybrid ECDH + Kyber-768 transition blueprints compliant with CNSA 2.0.
          </p>
        </div>

        <div 
          className="glass-panel" 
          onClick={() => setActiveTab('blockchain')}
          style={{ padding: '24px', cursor: 'pointer', transition: 'all 0.2s ease' }}
          title="Click to explore Blockchain Audit Trail"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'var(--accent-amber-glow)', color: 'var(--accent-amber)' }}>
              <ChainIcon size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Blockchain Audit Trail</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>IMMUTABLE CRYPTOGRAPHIC LEDGER</div>
            </div>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Every scan report is anchored into an immutable SHA-256 Merkle-linked chain with proof-of-audit nonces. Includes a live tamper simulator for jury demonstration.
          </p>
        </div>
      </div>
    </div>
  );
}
