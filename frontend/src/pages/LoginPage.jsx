import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Shield, ArrowRight, UserCheck, CheckCircle, Zap } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('alex.rivers@salesforce.ai');
  const [name, setName] = useState('Alex Rivers');
  const [role, setRole] = useState('Senior Sales Executive');

  const handleCustomLogin = (e) => {
    e.preventDefault();
    login({ name, email, role });
  };

  const handleQuickLogin = (presetRole, presetName, presetEmail) => {
    login({ name: presetName, email: presetEmail, role: presetRole });
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 70px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        maxWidth: '960px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '32px',
        alignItems: 'center'
      }}>
        {/* Left Side: Product Showcase */}
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(6, 182, 212, 0.15)',
            color: 'var(--primary-cyan)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            padding: '6px 14px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 700,
            marginBottom: '16px'
          }}>
            <Sparkles size={14} /> AI Sales Executive Platform
          </div>

          <h1 style={{ fontSize: '38px', fontWeight: 800, lineHeight: 1.15, marginBottom: '16px' }}>
            Supercharge Your <span style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Pipeline</span> with AI.
          </h1>

          <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
            Empower sales representatives with automated note summaries, instant high-conversion follow-up emails, deal win probability scores, and meeting transcript digests.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              "Instant AI Follow-up Email Generator with Tone Selector",
              "Automated Customer Notes Sentiment Analysis",
              "Next Best Action Recommendation Engine",
              "Single Command Docker Compose Setup"
            ].map((feat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: '#e2e8f0' }}>
                <CheckCircle size={16} color="var(--primary-cyan)" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Welcome Back</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Sign in to access your sales dashboard
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', display: 'block', marginBottom: '8px' }}>
              ONE-CLICK DEMO ACCOUNTS:
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                className="btn-secondary" 
                style={{ width: '100%', justifyContent: 'space-between', padding: '10px 14px' }}
                onClick={() => handleQuickLogin('Senior Sales Executive', 'Alex Rivers', 'alex@nexus.ai')}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                  <UserCheck size={16} color="var(--primary-cyan)" /> Alex Rivers (Sales Rep)
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Demo Admin</span>
              </button>

              <button 
                className="btn-secondary" 
                style={{ width: '100%', justifyContent: 'space-between', padding: '10px 14px' }}
                onClick={() => handleQuickLogin('VP of Global Sales', 'Sarah Connor', 'sarah@nexus.ai')}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                  <Shield size={16} color="var(--primary-violet)" /> Sarah Connor (VP Sales)
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Executive</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0', color: 'var(--text-dim)', fontSize: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
            <span>OR CUSTOM SIGN IN</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
          </div>

          <form onSubmit={handleCustomLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Full Name</label>
              <input 
                type="text" 
                required 
                className="glass-input" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Email Address</label>
              <input 
                type="email" 
                required 
                className="glass-input" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
              <span>Enter Sales Hub</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
