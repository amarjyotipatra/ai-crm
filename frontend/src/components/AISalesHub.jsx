import React, { useState } from 'react';
import { aiAPI } from '../api/client';
import { Sparkles, Mail, FileText, Target, Video, Copy, Check, RefreshCw, X, Zap } from 'lucide-react';

export default function AISalesHub({ isOpen, onClose, customer, notes = [] }) {
  const [activeTab, setActiveTab] = useState('email');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [resultText, setResultText] = useState('');

  // Form states for AI
  const [emailTone, setEmailTone] = useState('Professional');
  const [emailObjective, setEmailObjective] = useState('Follow up after demo and present next steps');
  const [meetingTranscript, setMeetingTranscript] = useState(
    'Alex: Thanks for joining today Sarah. How are your team handling the current workflow?\n' +
    'Sarah: We are struggling with manual data entry and lack of follow-up visibility.\n' +
    'Alex: Our platform automates lead scoring and follow-ups. We can get you set up in 2 days.\n' +
    'Sarah: Send over the proposal by Friday for executive sign-off.'
  );

  if (!isOpen || !customer) return null;

  const handleGenerateEmail = async () => {
    setLoading(true);
    setResultText('');
    try {
      const res = await aiAPI.generateEmail(customer.id, emailTone, emailObjective);
      setResultText(res.result);
    } catch (err) {
      alert("Error generating email: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSummarizeNotes = async () => {
    setLoading(true);
    setResultText('');
    try {
      const res = await aiAPI.summarizeNotes(customer.id);
      setResultText(res.result);
    } catch (err) {
      alert("Error summarizing notes: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleNextBestAction = async () => {
    setLoading(true);
    setResultText('');
    try {
      const res = await aiAPI.getNextBestAction(customer.id);
      setResultText(res.result);
    } catch (err) {
      alert("Error generating next best action: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleMeetingSummary = async () => {
    if (!meetingTranscript.trim()) return;
    setLoading(true);
    setResultText('');
    try {
      const res = await aiAPI.generateMeetingSummary(customer.id, meetingTranscript);
      setResultText(res.result);
    } catch (err) {
      alert("Error generating meeting summary: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!resultText) return;
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={22} color="var(--primary-violet)" />
              AI Sales Assistant Studio
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Generating insights for <strong style={{ color: 'var(--primary-cyan)' }}>{customer.name}</strong> ({customer.company || 'Client'})
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Studio Feature Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '6px',
          borderRadius: '12px',
          marginBottom: '20px',
          border: '1px solid var(--border-color)'
        }}>
          <button 
            onClick={() => { setActiveTab('email'); setResultText(''); }}
            style={{
              padding: '10px 8px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: activeTab === 'email' ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)' : 'transparent',
              color: activeTab === 'email' ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            <Mail size={14} /> Email Draft
          </button>

          <button 
            onClick={() => { setActiveTab('summary'); setResultText(''); }}
            style={{
              padding: '10px 8px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: activeTab === 'summary' ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)' : 'transparent',
              color: activeTab === 'summary' ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            <FileText size={14} /> Notes Summary
          </button>

          <button 
            onClick={() => { setActiveTab('action'); setResultText(''); }}
            style={{
              padding: '10px 8px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: activeTab === 'action' ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)' : 'transparent',
              color: activeTab === 'action' ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            <Target size={14} /> Next Action
          </button>

          <button 
            onClick={() => { setActiveTab('meeting'); setResultText(''); }}
            style={{
              padding: '10px 8px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: activeTab === 'meeting' ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)' : 'transparent',
              color: activeTab === 'meeting' ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            <Video size={14} /> Meeting Digest
          </button>
        </div>

        {/* Tab Controls & Controls Form */}
        <div style={{ marginBottom: '16px' }}>
          {activeTab === 'email' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '12px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Desired Tone</label>
                <select className="glass-input" value={emailTone} onChange={(e) => setEmailTone(e.target.value)}>
                  <option value="Professional" style={{ background: '#111827' }}>Professional</option>
                  <option value="Urgent" style={{ background: '#111827' }}>Urgent / Closing</option>
                  <option value="Friendly" style={{ background: '#111827' }}>Warm & Friendly</option>
                  <option value="Re-engagement" style={{ background: '#111827' }}>Re-engagement</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Email Goal / Objective</label>
                <input 
                  type="text" 
                  className="glass-input"
                  value={emailObjective} 
                  onChange={(e) => setEmailObjective(e.target.value)} 
                />
              </div>
              <button className="btn-ai" onClick={handleGenerateEmail} disabled={loading}>
                <Zap size={16} />
                {loading ? 'Generating...' : 'Generate Email'}
              </button>
            </div>
          )}

          {activeTab === 'summary' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Analyze all {notes.length} logged notes to create an executive relationship summary.
              </p>
              <button className="btn-ai" onClick={handleSummarizeNotes} disabled={loading}>
                <Zap size={16} />
                {loading ? 'Summarizing...' : 'Summarize Notes'}
              </button>
            </div>
          )}

          {activeTab === 'action' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Predict strategic next step & deal probability based on current stage '{customer.stage}'.
              </p>
              <button className="btn-ai" onClick={handleNextBestAction} disabled={loading}>
                <Zap size={16} />
                {loading ? 'Analyzing...' : 'Generate Action'}
              </button>
            </div>
          )}

          {activeTab === 'meeting' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Paste Raw Meeting Transcript or Rough Notes</label>
              <textarea 
                rows={4} 
                className="glass-input"
                style={{ resize: 'vertical' }}
                value={meetingTranscript}
                onChange={(e) => setMeetingTranscript(e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn-ai" onClick={handleMeetingSummary} disabled={loading}>
                  <Zap size={16} />
                  {loading ? 'Processing...' : 'Summarize Meeting'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* AI Output Window */}
        {loading && (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            background: 'rgba(15, 23, 42, 0.5)',
            borderRadius: '12px',
            border: '1px dashed var(--primary-violet)'
          }}>
            <RefreshCw size={28} color="var(--primary-violet)" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '12px', fontSize: '14px', color: 'var(--text-muted)' }}>
              AI is crafting response using Gemini Sales Intelligence model...
            </p>
          </div>
        )}

        {resultText && !loading && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '14px',
            padding: '18px',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary-violet)', textTransform: 'uppercase' }}>
                Generated Output
              </span>
              <button 
                onClick={handleCopy}
                className="btn-secondary" 
                style={{ padding: '4px 10px', fontSize: '12px' }}
              >
                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy Result'}
              </button>
            </div>

            <div style={{
              whiteSpace: 'pre-wrap',
              fontSize: '13px',
              lineHeight: '1.6',
              color: '#e2e8f0',
              maxHeight: '300px',
              overflowY: 'auto',
              fontFamily: 'monospace'
            }}>
              {resultText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
