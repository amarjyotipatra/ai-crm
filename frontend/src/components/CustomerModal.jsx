import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, Building, Mail, Phone, DollarSign, Tag } from 'lucide-react';

export default function CustomerModal({ isOpen, onClose, onSave, customer = null }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    stage: 'Lead',
    value: 0,
    status: 'Active',
    tags: 'General'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        company: customer.company || '',
        stage: customer.stage || 'Lead',
        value: customer.value || 0,
        status: customer.status || 'Active',
        tags: customer.tags || 'General'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        stage: 'Lead',
        value: 0,
        status: 'Active',
        tags: 'General'
      });
    }
  }, [customer, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        ...formData,
        value: parseFloat(formData.value) || 0
      });
      onClose();
    } catch (err) {
      alert("Failed to save customer: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {customer ? <Save size={20} color="var(--primary-cyan)" /> : <UserPlus size={20} color="var(--primary-cyan)" />}
            {customer ? 'Edit Customer Details' : 'Add New Customer'}
          </h2>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Full Name *
            </label>
            <input 
              type="text" 
              required
              className="glass-input"
              placeholder="e.g. Sarah Jenkins"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Email Address *
              </label>
              <input 
                type="email" 
                required
                className="glass-input"
                placeholder="sarah@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Phone Number
              </label>
              <input 
                type="text" 
                className="glass-input"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Company Name
              </label>
              <input 
                type="text" 
                className="glass-input"
                placeholder="Acme Corp"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Estimated Deal Value ($)
              </label>
              <input 
                type="number" 
                step="500"
                className="glass-input"
                placeholder="25000"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Pipeline Stage
              </label>
              <select 
                className="glass-input"
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
              >
                <option value="Lead" style={{ background: '#111827' }}>Lead</option>
                <option value="Contacted" style={{ background: '#111827' }}>Contacted</option>
                <option value="Qualified" style={{ background: '#111827' }}>Qualified</option>
                <option value="Proposal" style={{ background: '#111827' }}>Proposal</option>
                <option value="Won" style={{ background: '#111827' }}>Closed Won</option>
                <option value="Lost" style={{ background: '#111827' }}>Closed Lost</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Tags / Labels
              </label>
              <input 
                type="text" 
                className="glass-input"
                placeholder="Enterprise, High Intent"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : customer ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
