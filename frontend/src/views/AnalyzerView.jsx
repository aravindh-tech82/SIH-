import React, { useState } from 'react';
import { 
  SearchCode, 
  Upload, 
  FileCode, 
  Terminal, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  Shield, 
  Layers, 
  FileText,
  Radio,
  Download,
  Zap,
  Activity,
  Cpu,
  FileCheck
} from 'lucide-react';

export default function AnalyzerView({ 
  onAnalyzeConfig, 
  onAnalyzePcap, 
  onAnalyzeLog, 
  onAnalyzeSamplePcap,
  onProbePacket,
  scenarios, 
  analysisData, 
  isAnalyzing, 
  setActiveTab 
}) {
  const [activeTabMode, setActiveTabMode] = useState('config'); // config | pcap | probe | log
  const [configText, setConfigText] = useState(scenarios?.[0]?.content || '');
  const [logText, setLogText] = useState(`Sep 11 14:22:01 vpn-gw charon: 09[IKE] received packet: from 198.51.100.22[500] to 203.0.113.1[500]
Sep 11 14:22:01 vpn-gw charon: 09[IKE] received proposal: IKE:3DES_CBC/HMAC_MD5_96/PRF_HMAC_MD5/MODP_1024
Sep 11 14:22:02 vpn-gw charon: 11[ENC] generating IKE_SA_INIT response
Sep 11 14:22:03 vpn-gw charon: 14[IKE] peer authentication failed: bad pre-shared key
Sep 11 14:22:04 vpn-gw charon: 14[IKE] peer authentication failed: bad pre-shared key
Sep 11 14:22:05 vpn-gw charon: 14[IKE] peer authentication failed: bad pre-shared key`);

  // Probe state
  const [probeTarget, setProbeTarget] = useState('127.0.0.1');
  const [probePort, setProbePort] = useState(500);
  const [probeProtocol, setProbeProtocol] = useState('IKEv2');
  const [probeResult, setProbeResult] = useState(null);
  const [isProbing, setIsProbing] = useState(false);
  const [activeSampleId, setActiveSampleId] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState('');

  const handleSelectScenario = (sc) => {
    setConfigText(sc.content);
  };

  const handleRunAnalysis = () => {
    if (activeTabMode === 'config') {
      onAnalyzeConfig(configText);
    } else if (activeTabMode === 'log') {
      onAnalyzeLog(logText);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setUploadedFileName(file.name);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setUploadedFileSize(`${sizeMb} MB`);
      setActiveSampleId(file.name);
      onAnalyzePcap(file);
    }
  };

  const handleRunUploadedPcapAnalysis = () => {
    if (uploadedFile) {
      onAnalyzePcap(uploadedFile);
    }
  };

  const handleSelectSamplePcap = (sampleId) => {
    setActiveSampleId(sampleId);
    if (onAnalyzeSamplePcap) {
      onAnalyzeSamplePcap(sampleId);
    }
  };

  const handleExecuteProbe = async () => {
    setIsProbing(true);
    setProbeResult(null);
    try {
      if (onProbePacket) {
        const res = await onProbePacket(probeTarget, probePort, probeProtocol);
        setProbeResult(res);
      }
    } catch (err) {
      setProbeResult({ error: err.message, summary: "Probe failed to transmit." });
    } finally {
      setIsProbing(false);
    }
  };

  return (
    <div className="content-viewport">
      <div className="page-title">
        <SearchCode size={28} color="var(--accent-cyan)" />
        IPsec VPN Deep Protocol Analyzer & Packet Engine
      </div>
      <div className="section-subtitle" style={{ marginBottom: '24px' }}>
        Dissect live and captured PCAP packets, transmit Scapy IKE probes, parse multi-vendor configurations, and inspect syslogs.
      </div>

      {/* Input Mode Selector */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`cyber-btn ${activeTabMode === 'config' ? 'cyber-btn-primary' : 'cyber-btn-secondary'}`}
          onClick={() => setActiveTabMode('config')}
        >
          <FileCode size={16} /> VPN Config Parser
        </button>

        <button
          type="button"
          id="btn-tab-pcap"
          className={`cyber-btn ${activeTabMode === 'pcap' ? 'cyber-btn-primary' : 'cyber-btn-secondary'}`}
          onClick={() => setActiveTabMode('pcap')}
        >
          <Upload size={16} /> Scapy PCAP / Packet Capture
        </button>

        <button
          type="button"
          id="btn-tab-probe"
          className={`cyber-btn ${activeTabMode === 'probe' ? 'cyber-btn-primary' : 'cyber-btn-secondary'}`}
          onClick={() => setActiveTabMode('probe')}
        >
          <Radio size={16} /> Live Packet Prober & Scanner
        </button>

        <button
          type="button"
          className={`cyber-btn ${activeTabMode === 'log' ? 'cyber-btn-primary' : 'cyber-btn-secondary'}`}
          onClick={() => setActiveTabMode('log')}
        >
          <FileText size={16} /> VPN Syslog Analyzer
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* Input Panel */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          {/* 1. CONFIG PARSER MODE */}
          {activeTabMode === 'config' && (
            <>
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>
                  QUICK LOAD ENTERPRISE SCENARIOS (SIH JURY BENCHMARKS):
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {scenarios?.map((sc) => (
                    <button
                      key={sc.id}
                      type="button"
                      className="cyber-btn cyber-btn-secondary"
                      style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                      onClick={() => handleSelectScenario(sc)}
                    >
                      {sc.name}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={configText}
                onChange={(e) => setConfigText(e.target.value)}
                placeholder="Paste Cisco ASA, strongSwan ipsec.conf, pfSense XML, or FortiOS config..."
                style={{
                  width: '100%',
                  height: '280px',
                  background: '#060B13',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  color: '#A5F3FC',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  lineHeight: '1.5',
                  outline: 'none',
                  resize: 'vertical',
                  marginBottom: '16px'
                }}
              />

              <button
                type="button"
                className="cyber-btn cyber-btn-primary"
                style={{ width: '100%' }}
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? 'Executing AI Deep Analysis...' : 'Start Security & Compliance Audit'}
              </button>
            </>
          )}

          {/* 2. PCAP PACKET DISSECTOR MODE */}
          {activeTabMode === 'pcap' && (
            <div>
              {/* 1-Click Pre-generated Scapy Packets for instant demonstration */}
              <div style={{ marginBottom: '20px', padding: '16px', background: 'rgba(15, 23, 42, 0.7)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <Sparkles size={16} color="var(--accent-cyan)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    PRELOADED SCAPY REAL PACKET CAPTURES (1-CLICK LOAD):
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Sample 1: User Traffic Analysis PCAP */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', background: '#08101E', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0, 229, 255, 0.3)' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                        🔵 User Traffic Analysis PCAP (22,473 Packets)
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        2026-08-09-traffic-analysis-exercise.pcap (15.3 MB network capture)
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        id="btn-load-pcap-user-traffic"
                        className="cyber-btn cyber-btn-primary"
                        style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                        onClick={() => handleSelectSamplePcap('sample-user-traffic')}
                        disabled={isAnalyzing}
                      >
                        <FileCheck size={14} /> Calculate Score
                      </button>
                    </div>
                  </div>

                  {/* Sample 2: Critical IKEv1 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', background: '#08101E', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-red)' }}>
                        🔴 IKEv1 Aggressive Mode Leak (.pcap)
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Scapy capture: UDP 500 ISAKMP with Sweet32 3DES & Cleartext PSK Hash leak
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        id="btn-load-pcap-ikev1"
                        className="cyber-btn cyber-btn-danger"
                        style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                        onClick={() => handleSelectSamplePcap('sample-ikev1-legacy')}
                        disabled={isAnalyzing}
                      >
                        <FileCheck size={14} /> Calculate Score
                      </button>
                      <a
                        href="http://127.0.0.1:8000/api/pcap/download/sample-ikev1-legacy"
                        className="cyber-btn cyber-btn-secondary"
                        style={{ fontSize: '0.78rem', padding: '6px 10px' }}
                        title="Download sample PCAP for Wireshark"
                        download
                      >
                        <Download size={14} />
                      </a>
                    </div>
                  </div>

                  {/* Sample 3: Secure IKEv2 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', background: '#08101E', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-green)' }}>
                        🟢 IKEv2 Zero-Trust Gateway (.pcap)
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Scapy capture: UDP 500 IKE_SA_INIT with AES-256-GCM & DH Group 19 (ECP-256)
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        id="btn-load-pcap-ikev2"
                        className="cyber-btn cyber-btn-primary"
                        style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                        onClick={() => handleSelectSamplePcap('sample-ikev2-secure')}
                        disabled={isAnalyzing}
                      >
                        <FileCheck size={14} /> Calculate Score
                      </button>
                      <a
                        href="http://127.0.0.1:8000/api/pcap/download/sample-ikev2-secure"
                        className="cyber-btn cyber-btn-secondary"
                        style={{ fontSize: '0.78rem', padding: '6px 10px' }}
                        title="Download sample PCAP for Wireshark"
                        download
                      >
                        <Download size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom File Upload Box */}
              <div style={{
                border: '2px dashed var(--border-glow)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px 20px',
                textAlign: 'center',
                background: 'rgba(15, 23, 42, 0.4)'
              }}>
                <Upload size={36} color="var(--accent-cyan)" style={{ margin: '0 auto 10px' }} />
                <h4 style={{ marginBottom: '6px', fontSize: '1rem' }}>Upload Custom Packet Capture (.pcap / .pcapng)</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Dissects UDP 500/4500 packets, extracts SA transforms, identifies Diffie-Hellman groups, and calculates Security Posture Score.
                </p>

                <input
                  type="file"
                  accept=".pcap,.pcapng"
                  id="pcap-upload"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                  <label htmlFor="pcap-upload" className="cyber-btn cyber-btn-secondary" style={{ cursor: 'pointer' }}>
                    <Upload size={16} /> {uploadedFile ? 'Change PCAP File' : 'Browse Local PCAP File'}
                  </label>

                  {uploadedFile && (
                    <button
                      type="button"
                      id="btn-analyze-uploaded-pcap"
                      className="cyber-btn cyber-btn-primary"
                      onClick={handleRunUploadedPcapAnalysis}
                      disabled={isAnalyzing}
                    >
                      <Zap size={16} /> {isAnalyzing ? 'Dissecting Packets...' : 'Start PCAP Audit & Calculate Score'}
                    </button>
                  )}
                </div>

                {uploadedFile && (
                  <div style={{
                    marginTop: '16px',
                    padding: '12px 16px',
                    background: '#08101E',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FileCheck size={20} color="var(--accent-cyan)" />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {uploadedFileName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Size: {uploadedFileSize} | Ready for packet dissection & AI score calculation
                        </div>
                      </div>
                    </div>
                    <span className="cyber-badge cyber-badge-green" style={{ fontSize: '0.72rem' }}>
                      FILE LOADED
                    </span>
                  </div>
                )}

                {isAnalyzing && (
                  <div style={{ marginTop: '14px', padding: '10px 14px', background: 'rgba(0, 229, 255, 0.1)', borderRadius: '8px', color: 'var(--accent-cyan)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                    ⚡ Processing PCAP frames & running Random Forest Posture Classifier...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. LIVE PACKET PROBER & SCANNER MODE */}
          {activeTabMode === 'probe' && (
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
                LIVE SCAPY IKE PACKET PROBE & TRANSMITTER:
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Target Host / IP:</label>
                  <input
                    type="text"
                    value={probeTarget}
                    onChange={(e) => setProbeTarget(e.target.value)}
                    placeholder="127.0.0.1 or domain"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: '#060B13',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      color: '#A5F3FC',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Port (IKE / NAT-T):</label>
                  <input
                    type="number"
                    value={probePort}
                    onChange={(e) => setProbePort(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: '#060B13',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      color: '#A5F3FC',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Protocol:</label>
                  <select
                    value={probeProtocol}
                    onChange={(e) => setProbeProtocol(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: '#060B13',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      color: '#A5F3FC',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="IKEv2">IKEv2 (RFC 7296)</option>
                    <option value="IKEv1">IKEv1 (Legacy)</option>
                    <option value="Both">Both (IKEv1 + IKEv2)</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                id="btn-send-probe"
                className="cyber-btn cyber-btn-primary"
                style={{ width: '100%', marginBottom: '16px' }}
                onClick={handleExecuteProbe}
                disabled={isProbing}
              >
                <Zap size={16} />
                {isProbing ? 'Crafting & Transmitting UDP Probe...' : 'Transmit Scapy Probe Datagram'}
              </button>

              {/* Probe Result Stream */}
              {probeResult && (
                <div style={{
                  background: '#050A14',
                  border: '1px solid var(--border-glow)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  lineHeight: '1.6'
                }}>
                  <div style={{ color: 'var(--accent-green)', fontWeight: 700, marginBottom: '6px' }}>
                    ✔ {probeResult.summary}
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    Target: <strong>{probeResult.target}:{probeResult.port}</strong> | Timestamp: {probeResult.timestamp}
                  </div>

                  {probeResult.probes && Object.entries(probeResult.probes).map(([proto, pData]) => (
                    <div key={proto} style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
                        {pData.packet_name} ({pData.packet_length_bytes} bytes):
                      </div>
                      <div style={{ color: 'var(--text-muted)', wordBreak: 'break-all', fontSize: '0.72rem', margin: '4px 0' }}>
                        HEXDUMP: {pData.hexdump_preview}...
                      </div>
                      <div style={{ color: pData.scan_result?.status === 'Open' ? 'var(--accent-green)' : 'var(--accent-amber)' }}>
                        Status: <strong>{pData.scan_result?.status}</strong> {pData.scan_result?.response && `(${pData.scan_result.response})`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. SYSLOG ANALYZER MODE */}
          {activeTabMode === 'log' && (
            <>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>
                VPN SYSLOG / CHARON.LOG / AUTH STREAM:
              </div>
              <textarea
                value={logText}
                onChange={(e) => setLogText(e.target.value)}
                style={{
                  width: '100%',
                  height: '280px',
                  background: '#060B13',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  color: '#A5F3FC',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  lineHeight: '1.5',
                  outline: 'none',
                  resize: 'vertical',
                  marginBottom: '16px'
                }}
              />
              <button
                type="button"
                className="cyber-btn cyber-btn-primary"
                style={{ width: '100%' }}
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? 'Analyzing Log Stream...' : 'Analyze VPN Authentication & Rekey Events'}
              </button>
            </>
          )}
        </div>

        {/* Live Analysis Output Summary */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Layers size={18} color="var(--accent-cyan)" />
            Real-Time Audit Results
          </h3>

          {analysisData ? (
            <div>
              {/* Score Indicator */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SECURITY POSTURE SCORE</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: analysisData.risk_assessment.security_posture_score < 50 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                    {analysisData.risk_assessment.security_posture_score} / 100
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`cyber-badge ${analysisData.risk_assessment.risk_level === 'Critical' ? 'cyber-badge-red' : (analysisData.risk_assessment.risk_level === 'High' ? 'cyber-badge-amber' : 'cyber-badge-green')}`}>
                    {analysisData.risk_assessment.risk_level} RISK
                  </span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Confidence: {analysisData.risk_assessment.confidence}%
                  </div>
                </div>
              </div>

              {/* Protocol Spec Breakdown */}
              <div style={{ fontSize: '0.85rem', marginBottom: '16px', lineHeight: 1.8 }}>
                <div><strong>Target:</strong> {analysisData.vendor}</div>
                <div><strong>Protocol:</strong> <span style={{ color: analysisData.ike_version === 'IKEv1' ? 'var(--accent-red)' : 'var(--accent-green)' }}>{analysisData.ike_version}</span></div>
                <div><strong>Encryption:</strong> {analysisData.encryption?.join(', ') || 'N/A'}</div>
                <div><strong>Hash:</strong> {analysisData.integrity?.join(', ') || 'N/A'}</div>
                <div><strong>Diffie-Hellman:</strong> {analysisData.dh_groups?.join(', ') || 'N/A'}</div>
                <div><strong>PFS:</strong> <span style={{ color: analysisData.pfs === 'Enabled' ? 'var(--accent-green)' : 'var(--accent-red)' }}>{analysisData.pfs ? 'Enabled' : 'Disabled'}</span></div>
                <div><strong>Aggressive Mode:</strong> {analysisData.aggressive_mode ? <span style={{ color: 'var(--accent-red)', fontWeight: 600 }}>YES (PSK Cleartext Leak)</span> : 'NO'}</div>
              </div>

              {/* Vulnerabilities detected count */}
              <div style={{
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--accent-red)',
                fontSize: '0.85rem',
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span><strong>{analysisData.vulnerabilities?.length || 0} CVE Vulnerabilities</strong> Detected</span>
                <button
                  type="button"
                  className="cyber-btn cyber-btn-danger"
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                  onClick={() => setActiveTab('vulnerabilities')}
                >
                  View Details & Fixes
                </button>
              </div>

              {/* Blockchain Anchor */}
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                ANCHORED ON BLOCKCHAIN: <span style={{ color: 'var(--accent-cyan)' }}>{analysisData.blockchain_hash ? `${analysisData.blockchain_hash.slice(0, 20)}...` : 'Pending...'}</span>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '40px 20px' }}>
              Select a packet capture or transmit a probe to view instant analysis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
