import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, LogOut, Building2, UserCheck, ShieldCheck } from 'lucide-react';

export default function Navbar({ onNavigateHome }) {
  const { user, logout } = useAuth();

  return (
    <header style={{
      borderBottom: '1px solid var(--border-color)',
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <div 
          onClick={onNavigateHome}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(6, 182, 212, 0.4)'
          }}>
            <Sparkles size={22} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
                Nexus<span style={{ color: 'var(--primary-cyan)' }}>CRM</span>
              </span>
              <span style={{
                background: 'rgba(139, 92, 246, 0.2)',
                color: '#c084fc',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                padding: '2px 8px',
                borderRadius: '999px',
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}>
                AI Powered
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sales Executive Control Center</p>
          </div>
        </div>

        {/* User profile & session */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 14px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-color)',
              borderRadius: '999px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '13px'
              }}>
                {user.name.charAt(0)}
              </div>
              <div style={{ fontSize: '13px' }}>
                <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>{user.name}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user.role}</p>
              </div>
            </div>

            <button 
              onClick={logout}
              className="btn-secondary"
              title="Sign Out"
              style={{ padding: '8px 12px' }}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
