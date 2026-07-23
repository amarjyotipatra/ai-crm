import React, { useState } from 'react';
import { X, FileText, Send } from 'lucide-react';

export default function NoteModal({ isOpen, onClose, onSave, customerId, customerName }) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Meeting');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      await onSave({
        customer_id: customerId,
        content,
        category,
        author: 'Sales Executive'
      });
      setContent('');
      onClose();
    } catch (err) {
      alert("Failed to add note: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} color="var(--primary-cyan)" />
            Add Note for {customerName}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Interaction Type / Category
            </label>
            <select 
              className="glass-input" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Meeting" style={{ background: '#111827' }}>Meeting / Demo</option>
              <option value="Call" style={{ background: '#111827' }}>Phone Call</option>
              <option value="Email" style={{ background: '#111827' }}>Email Exchange</option>
              <option value="General" style={{ background: '#111827' }}>General Note</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Note Content *
            </label>
            <textarea 
              required
              rows={4}
              className="glass-input"
              style={{ resize: 'vertical' }}
              placeholder="e.g. Discussed budget constraints and technical requirements. Client asked for security documentation..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              <Send size={16} />
              {loading ? 'Saving...' : 'Add Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
