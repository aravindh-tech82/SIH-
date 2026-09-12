import React from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  SearchCode, 
  AlertTriangle, 
  Bot, 
  Cpu, 
  Atom, 
  Link as ChainIcon, 
  FileText, 
  Sparkles, 
  Activity,
  ChevronRight
} from 'lucide-react';

export const navItems = [
  { id: 'dashboard', label: 'SOC Dashboard', icon: LayoutDashboard },
  { id: 'analyzer', label: 'VPN Deep Analyzer', icon: SearchCode },
  { id: 'vulnerabilities', label: 'Vulnerabilities & CVEs', icon: AlertTriangle },
  { id: 'copilot', label: 'AI Security Copilot', icon: Bot },
  { id: 'ml', label: 'AI / ML Security Models', icon: Cpu },
  { id: 'pqc', label: 'Post-Quantum (PQC)', icon: Atom },
  { id: 'blockchain', label: 'Blockchain Audit Trail', icon: ChainIcon },
  { id: 'reports', label: 'Executive Reports', icon: FileText },
  { id: 'landing', label: 'Overview & Topology', icon: Shield },
];

export function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="sidebar-nav">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {/* Brand Header */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            padding: '8px 10px 18px', 
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '10px',
            cursor: 'pointer'
          }}
          title="Return to SOC Dashboard"
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #00E5FF, #0284C7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 229, 255, 0.4)',
            flexShrink: 0
          }}>
            <Shield size={22} color="#0B1220" />
          </div>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              IPsec Sentinel
              <span className="cyber-badge cyber-badge-cyan" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>SIH26160</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              VPN PROTOCOL ANALYZER
            </div>
          </div>
        </div>

        {/* Section Label */}
        <div style={{
          fontSize: '0.68rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--text-muted)',
          padding: '4px 12px',
          fontFamily: 'var(--font-mono)'
        }}>
          Command Modules
        </div>

        {/* Navigation Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                id={`nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'linear-gradient(90deg, rgba(0, 229, 255, 0.16), rgba(0, 229, 255, 0.03))' : 'transparent',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid rgba(0, 229, 255, 0.35)' : '1px solid transparent',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 0 15px rgba(0, 229, 255, 0.12)' : 'none',
                  width: '100%'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={18} color={isActive ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight size={14} color="var(--accent-cyan)" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sidebar Footer Metadata */}
      <div style={{
        padding: '12px 14px',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.74rem',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-muted)'
      }}>
        <div style={{ color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '2px' }}>
          Smart India Hackathon 2026
        </div>
        <div>Problem Code: SIH26160</div>
        <div style={{ color: 'var(--accent-purple)', marginTop: '2px' }}>● NIST FIPS 203 PQC Ready</div>
      </div>
    </aside>
  );
}

export function TopBar({ activeTab, role, setRole, onStartDemo, isOnline }) {
  const currentItem = navItems.find(i => i.id === activeTab);

  return (
    <header className="top-telemetry-bar">
      {/* Left: Active Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          fontSize: '0.85rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>SOC CONSOLE</span>
          <span>/</span>
          <strong style={{ color: 'var(--accent-cyan)' }}>
            {currentItem?.label?.toUpperCase() || 'DASHBOARD'}
          </strong>
        </div>
      </div>

      {/* Center: Live Telemetry Indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.78rem',
          fontFamily: 'var(--font-mono)'
        }}>
          <span className={`status-dot ${isOnline ? 'green' : 'amber'}`}></span>
          <span>BACKEND: <strong style={{ color: isOnline ? 'var(--accent-green)' : 'var(--accent-amber)' }}>{isOnline ? 'ONLINE (FASTAPI)' : 'OFFLINE (SIMULATION)'}</strong></span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(239, 68, 68, 0.1)',
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          fontSize: '0.78rem',
          color: 'var(--accent-red)',
          fontFamily: 'var(--font-mono)'
        }}>
          <Activity size={14} className="animate-spin" />
          <span>THREAT DEFENSE: <strong>ELEVATED</strong></span>
        </div>
      </div>

      {/* Right: Actions & Role Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          type="button"
          id="btn-sih-demo"
          className="cyber-btn cyber-btn-demo"
          onClick={onStartDemo}
          title="Start automated 6-step presentation walkthrough for SIH Judges"
        >
          <Sparkles size={16} />
          SIH 2026 DEMO MODE
        </button>

        <select 
          id="role-select"
          value={role} 
          onChange={(e) => setRole(e.target.value)}
          style={{
            background: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 12px',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="CISO">Role: CISO / Director</option>
          <option value="SOC_LEAD">Role: SOC Lead Analyst</option>
          <option value="AUDITOR">Role: CERT-In Auditor</option>
        </select>
      </div>
    </header>
  );
}

export default function Navigation(props) {
  return (
    <>
      <TopBar {...props} />
      <Sidebar {...props} />
    </>
  );
}
