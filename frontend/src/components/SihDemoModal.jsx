import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Terminal, 
  ShieldAlert, 
  Bot, 
  Cpu, 
  Atom, 
  Link as ChainIcon, 
  FileText 
} from 'lucide-react';

export default function SihDemoModal({ isOpen, onClose, setActiveTab, onExecuteScenario }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: "Step 1: Ingest Legacy Core Banking VPN",
      desc: "Load a real-world enterprise Cisco ASA production config with legacy 3DES encryption, MD5 hash, and IKEv1 Aggressive Mode.",
      tab: "analyzer",
      badge: "DATA INGESTION",
      action: "Load & Parse Bank Config"
    },
    {
      title: "Step 2: Deep Protocol Dissection & CVE Detection",
      desc: "The parser flags CVE-2016-2183 (Sweet32 attack), CVE-2002-1623 (cleartext PSK leak), and Logjam vulnerability.",
      tab: "vulnerabilities",
      badge: "CVE MATCHING",
      action: "View Vulnerability Matrix"
    },
    {
      title: "Step 3: AI / ML Risk & Anomaly Classification",
      desc: "Random Forest estimates a critical Posture Score of 32/100, while Isolation Forest scans for tunnel rekey anomalies.",
      tab: "ml",
      badge: "SCIKIT-LEARN ML",
      action: "Inspect Machine Learning Gauges"
    },
    {
      title: "Step 4: AI Cyber Copilot Remediation",
      desc: "Query the AI Copilot to generate hardened, NIST SP 800-77 compliant Cisco ASA replacement configuration commands.",
      tab: "copilot",
      badge: "AI COPILOT",
      action: "View Cisco ASA Fix in Copilot"
    },
    {
      title: "Step 5: Post-Quantum Cryptography Assessment",
      desc: "Evaluate vulnerability against Shor's algorithm and generate NIST FIPS 203 (ML-KEM-768) migration roadmap.",
      tab: "pqc",
      badge: "NIST FIPS 203 PQC",
      action: "Review Quantum Readiness Index"
    },
    {
      title: "Step 6: Anchor in Blockchain & Export Executive PDF",
      desc: "The assessment is immortalized into the SHA-256 Merkle chain. Export the final CISO executive report.",
      tab: "reports",
      badge: "IMMUTABLE AUDIT",
      action: "View Final Executive Report"
    }
  ];

  const step = steps[currentStep];

  const handleNext = () => {
    setActiveTab(step.tab);
    if (currentStep === 0 && onExecuteScenario) {
      onExecuteScenario();
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 10, 20, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '680px',
        width: '100%',
        padding: '32px',
        border: '1px solid var(--border-glow)',
        boxShadow: 'var(--shadow-glow)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ padding: '8px', borderRadius: '8px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}>
            <Sparkles size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>SIH 2026 Jury Presentation Mode</div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
              PROBLEM STATEMENT SIH26160 | 6-STEP COMPLETE DEMONSTRATION FLOW
            </div>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div style={{ display: 'flex', gap: '6px', margin: '20px 0' }}>
          {steps.map((s, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: '6px',
                borderRadius: 'var(--radius-full)',
                background: i <= currentStep ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Current Step Content */}
        <div style={{ background: '#070D18', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span className="cyber-badge cyber-badge-cyan">{step.badge}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              STAGE {currentStep + 1} OF 6
            </span>
          </div>

          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#fff' }}>{step.title}</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step.desc}</p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            className="cyber-btn cyber-btn-secondary"
            onClick={onClose}
            style={{ fontSize: '0.85rem' }}
          >
            Exit Guided Tour
          </button>

          <button
            className="cyber-btn cyber-btn-demo"
            onClick={handleNext}
            style={{ fontSize: '0.9rem' }}
          >
            {step.action} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
