import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Terminal, 
  Copy, 
  Check, 
  Sparkles, 
  Code, 
  ShieldCheck, 
  Cpu
} from 'lucide-react';

export default function AiCopilotView({ chatMessages, onSendMessage, isTyping }) {
  const [inputText, setInputText] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const quickPrompts = [
    { label: 'Cisco ASA Fix', text: 'Generate Cisco ASA hardening configuration for NIST SP 800-77' },
    { label: 'strongSwan PQC', text: 'Show strongSwan swanctl.conf configuration with ML-KEM PQC' },
    { label: 'pfSense XML', text: 'Show pfSense Phase 1 and Phase 2 XML snippet' },
    { label: 'Explain Sweet32', text: 'Why is Sweet32 (3DES) dangerous on IPsec VPNs?' },
    { label: 'Aggressive Mode', text: 'Explain IKEv1 Aggressive Mode PSK offline cracking (CVE-2002-1623)' }
  ];

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="content-viewport">
      <div className="page-title">
        <Bot size={28} color="var(--accent-cyan)" />
        AI Security Copilot & Remediation Engine
      </div>
      <div className="section-subtitle" style={{ marginBottom: '24px' }}>
        Conversational cybersecurity intelligence. Asks questions, generates hardened vendor CLI scripts, and references RFC 7296 & NIST standards.
      </div>

      {/* Quick Prompts Bar */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {quickPrompts.map((p, i) => (
          <button
            key={i}
            className="cyber-btn cyber-btn-secondary"
            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            onClick={() => onSendMessage(p.text)}
          >
            <Sparkles size={13} color="var(--accent-cyan)" />
            {p.label}
          </button>
        ))}
      </div>

      {/* Main Chat Interface */}
      <div className="glass-panel" style={{ height: '580px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Messages Feed */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {chatMessages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}
            >
              {msg.sender === 'ai' && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #00E5FF, #0284C7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Bot size={18} color="#0B1220" />
                </div>
              )}

              <div style={{
                background: msg.sender === 'user' ? 'linear-gradient(135deg, #0284C7, #0369A1)' : 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 20px',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                lineHeight: 1.6
              }}>
                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>

                {/* Code Block if available */}
                {msg.code && (
                  <div style={{ marginTop: '12px', position: 'relative' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#04070D',
                      padding: '6px 12px',
                      borderTopLeftRadius: '6px',
                      borderTopRightRadius: '6px',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-muted)'
                    }}>
                      <span>VENDOR CONFIG SCRIPT</span>
                      <button
                        onClick={() => handleCopyCode(msg.code, idx)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--accent-cyan)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.75rem'
                        }}
                      >
                        {copiedIndex === idx ? <Check size={14} color="var(--accent-green)" /> : <Copy size={14} />}
                        <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="cyber-terminal" style={{ margin: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                      <code>{msg.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} color="var(--accent-cyan)" />
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                AI Copilot is synthesizing remediation advice...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} style={{
          padding: '16px 20px',
          background: 'rgba(11, 18, 32, 0.95)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '12px'
        }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask AI Copilot (e.g. 'How do I fix CVE-2016-2183 on Cisco ASA?')..."
            style={{
              flex: 1,
              background: '#060B13',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 18px',
              color: '#F8FAFC',
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
          <button type="submit" className="cyber-btn cyber-btn-primary" disabled={isTyping}>
            <Send size={16} /> Send
          </button>
        </form>
      </div>
    </div>
  );
}
