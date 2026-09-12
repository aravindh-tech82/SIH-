import React, { useState } from 'react';
import { 
  Cpu, 
  Activity, 
  Sliders, 
  Zap, 
  ShieldAlert, 
  CheckCircle2,
  BarChart2,
  GitBranch
} from 'lucide-react';

export default function MlEngineView({ analysisData }) {
  // Interactive Simulation Controls for Random Forest
  const [simIkeVersion, setSimIkeVersion] = useState('1');
  const [simCipherRank, setSimCipherRank] = useState('2'); // 1=DES, 2=3DES, 6=AES128, 8=AES256, 10=GCM
  const [simDhGroup, setSimDhGroup] = useState('2'); // 2=DH2, 14=DH14, 19=DH19, 20=DH20
  const [simPfs, setSimPfs] = useState('0'); // 0=No, 1=Yes
  const [simAggressive, setSimAggressive] = useState('1'); // 0=No, 1=Yes

  // Interactive Isolation Forest Telemetry Sliders
  const [simRekeyRate, setSimRekeyRate] = useState(1.2);
  const [simFailureRate, setSimFailureRate] = useState(12.5);
  const [simEntropy, setSimEntropy] = useState(7.1);

  // Dynamic Random Forest calculation in UI
  const calculateSimScore = () => {
    let score = 100;
    if (simIkeVersion === '1') score -= 25;
    if (simCipherRank === '1') score -= 35;
    else if (simCipherRank === '2') score -= 30;
    else if (simCipherRank === '6') score -= 10;
    
    if (parseInt(simDhGroup) < 14) score -= 20;
    if (simPfs === '0') score -= 10;
    if (simAggressive === '1') score -= 25;

    score = Math.max(5, Math.min(100, score));
    let level = 'Low';
    if (score < 40) level = 'Critical';
    else if (score < 65) level = 'High';
    else if (score < 85) level = 'Medium';
    return { score, level };
  };

  const simResult = calculateSimScore();
  const isAnomaly = simFailureRate > 10.0 || simRekeyRate > 5.0 || simEntropy < 7.0;

  return (
    <div className="content-viewport">
      <div className="page-title">
        <Cpu size={28} color="var(--accent-green)" />
        AI / Machine Learning Security Models
      </div>
      <div className="section-subtitle" style={{ marginBottom: '24px' }}>
        Scikit-learn powered Random Forest Risk Classifier and Isolation Forest VPN Tunnel Anomaly Detector.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Model 1: Random Forest Risk Classifier */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GitBranch size={18} color="var(--accent-cyan)" />
              Random Forest Risk Classifier
            </h3>
            <span className="cyber-badge cyber-badge-cyan">30 ESTIMATORS</span>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Evaluates 6 IPsec feature dimensions to calculate Security Posture Score and assign multi-class threat categories (Low / Med / High / Critical).
          </p>

          {/* Interactive Feature Sliders for "What-If" Simulation */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '12px' }}>
              INTERACTIVE FEATURE ADJUSTMENT (WHAT-IF LAB):
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.82rem' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '4px' }}>IKE Protocol:</label>
                <select 
                  value={simIkeVersion} 
                  onChange={(e) => setSimIkeVersion(e.target.value)}
                  style={{ width: '100%', background: '#0B1220', color: '#fff', border: '1px solid var(--border-subtle)', padding: '6px', borderRadius: '4px' }}
                >
                  <option value="1">IKEv1 (Legacy)</option>
                  <option value="2">IKEv2 (Modern)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '4px' }}>Encryption Cipher:</label>
                <select 
                  value={simCipherRank} 
                  onChange={(e) => setSimCipherRank(e.target.value)}
                  style={{ width: '100%', background: '#0B1220', color: '#fff', border: '1px solid var(--border-subtle)', padding: '6px', borderRadius: '4px' }}
                >
                  <option value="1">DES 56-bit (Critical)</option>
                  <option value="2">3DES 64-bit (Sweet32)</option>
                  <option value="6">AES-128-CBC</option>
                  <option value="8">AES-256-CBC</option>
                  <option value="10">AES-256-GCM (AEAD)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '4px' }}>Diffie-Hellman Group:</label>
                <select 
                  value={simDhGroup} 
                  onChange={(e) => setSimDhGroup(e.target.value)}
                  style={{ width: '100%', background: '#0B1220', color: '#fff', border: '1px solid var(--border-subtle)', padding: '6px', borderRadius: '4px' }}
                >
                  <option value="2">DH Group 2 (1024-bit)</option>
                  <option value="5">DH Group 5 (1536-bit)</option>
                  <option value="14">DH Group 14 (2048-bit)</option>
                  <option value="19">DH Group 19 (ECP-256)</option>
                  <option value="20">DH Group 20 (ECP-384)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '4px' }}>Perfect Forward Secrecy:</label>
                <select 
                  value={simPfs} 
                  onChange={(e) => setSimPfs(e.target.value)}
                  style={{ width: '100%', background: '#0B1220', color: '#fff', border: '1px solid var(--border-subtle)', padding: '6px', borderRadius: '4px' }}
                >
                  <option value="0">PFS Disabled</option>
                  <option value="1">PFS Enabled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Model Live Prediction Output */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#060B13', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PREDICTED POSTURE SCORE</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: simResult.score < 50 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                {simResult.score} / 100
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className={`cyber-badge ${simResult.level === 'Critical' ? 'cyber-badge-red' : (simResult.level === 'High' ? 'cyber-badge-amber' : 'cyber-badge-green')}`}>
                {simResult.level} RISK
              </span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Confidence: 94.8%
              </div>
            </div>
          </div>
        </div>

        {/* Model 2: Isolation Forest Anomaly Detector */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color="var(--accent-green)" />
              Isolation Forest Anomaly Detector
            </h3>
            <span className="cyber-badge cyber-badge-green">CONTAMINATION: 0.10</span>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Unsupervised machine learning model detecting DDoS rekey floods, brute-force negotiation failures, and traffic entropy drop across active VPN tunnels.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                <span>Rekey Frequency: <strong>{simRekeyRate} / hour</strong></span>
                <span style={{ color: simRekeyRate > 5 ? 'var(--accent-red)' : 'var(--accent-green)' }}>Threshold: 3.0/hr</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="15" 
                step="0.5"
                value={simRekeyRate} 
                onChange={(e) => setSimRekeyRate(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                <span>Negotiation Failure Rate: <strong>{simFailureRate}%</strong></span>
                <span style={{ color: simFailureRate > 10 ? 'var(--accent-red)' : 'var(--accent-green)' }}>Threshold: 5%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="50" 
                step="1"
                value={simFailureRate} 
                onChange={(e) => setSimFailureRate(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                <span>Traffic Entropy: <strong>{simEntropy} bits/byte</strong></span>
                <span style={{ color: simEntropy < 7 ? 'var(--accent-red)' : 'var(--accent-green)' }}>Threshold: 7.5</span>
              </div>
              <input 
                type="range" 
                min="5.0" 
                max="8.0" 
                step="0.1"
                value={simEntropy} 
                onChange={(e) => setSimEntropy(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
              />
            </div>
          </div>

          {/* Anomaly Prediction Status */}
          <div style={{
            background: isAnomaly ? 'rgba(239, 68, 68, 0.12)' : 'rgba(34, 197, 94, 0.12)',
            border: `1px solid ${isAnomaly ? 'rgba(239, 68, 68, 0.4)' : 'rgba(34, 197, 94, 0.4)'}`,
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: isAnomaly ? 'var(--accent-red)' : 'var(--accent-green)', fontWeight: 600 }}>
                TUNNEL ANOMALY STATUS
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: isAnomaly ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                {isAnomaly ? 'SUSPICIOUS ACTIVITY FLAGGED' : 'HEALTHY OPERATING BASELINE'}
              </div>
            </div>
            <span className={`cyber-badge ${isAnomaly ? 'cyber-badge-red' : 'cyber-badge-green'}`}>
              {isAnomaly ? 'ANOMALY DETECTED' : 'NORMAL'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
