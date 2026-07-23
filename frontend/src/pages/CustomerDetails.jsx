import React, { useState, useEffect } from 'react';
import { customerAPI, noteAPI } from '../api/client';
import NoteModal from '../components/NoteModal';
import CustomerModal from '../components/CustomerModal';
import TimelineView from '../components/TimelineView';
import AISalesHub from '../components/AISalesHub';
import { 
  ArrowLeft, Building, Mail, Phone, Calendar, DollarSign, 
  Sparkles, FileText, Clock, Edit, Plus, Trash2, ShieldCheck, Tag, RefreshCw
} from 'lucide-react';

export default function CustomerDetails({ customerId, onBack }) {
  const [customer, setCustomer] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'timeline' | 'ai'

  // Modals
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isAiHubOpen, setIsAiHubOpen] = useState(false);

  const fetchCustomerDetails = async () => {
    setLoading(true);
    try {
      const custData = await customerAPI.getCustomerById(customerId);
      setCustomer(custData);

      const notesData = await noteAPI.getNotesByCustomer(customerId);
      setNotes(notesData);
    } catch (err) {
      console.error("Error loading customer details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchCustomerDetails();
    }
  }, [customerId]);

  const handleAddNote = async (noteData) => {
    await noteAPI.createNote(noteData);
    fetchCustomerDetails();
  };

  const handleUpdateCustomer = async (formData) => {
    await customerAPI.updateCustomer(customerId, formData);
    fetchCustomerDetails();
  };

  const handleDeleteCustomer = async () => {
    if (window.confirm(`Are you sure you want to delete ${customer.name}?`)) {
      await customerAPI.deleteCustomer(customerId);
      onBack();
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px' }}>
        <RefreshCw size={36} color="var(--primary-cyan)" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '14px', color: 'var(--text-muted)' }}>Loading customer workspace...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px' }}>
        <button className="btn-secondary" onClick={onBack} style={{ marginBottom: '20px' }}>
          <ArrowLeft size={16} /> Back to Customers
        </button>
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Customer Record Not Found</h2>
        </div>
      </div>
    );
  }

  const stageClass = `badge badge-${customer.stage.toLowerCase()}`;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
      {/* Back Button */}
      <button className="btn-secondary" onClick={onBack} style={{ marginBottom: '20px' }}>
        <ArrowLeft size={16} /> Back to Customer Directory
      </button>

      {/* Customer Header Card */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: '800',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
            }}>
              {customer.name.charAt(0)}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h1 style={{ fontSize: '26px', fontWeight: 800 }}>{customer.name}</h1>
                <span className={stageClass}>{customer.stage}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
                {customer.company && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Building size={14} color="var(--primary-cyan)" /> {customer.company}
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Mail size={14} /> {customer.email}
                </span>
                {customer.phone && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Phone size={14} /> {customer.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Pipeline Value</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                ${customer.value?.toLocaleString() || '0'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn-ai"
                onClick={() => setIsAiHubOpen(true)}
              >
                <Sparkles size={16} /> AI Studio
              </button>

              <button 
                className="btn-secondary"
                onClick={() => setIsCustomerModalOpen(true)}
              >
                <Edit size={16} /> Edit
              </button>

              <button 
                className="btn-danger"
                onClick={handleDeleteCustomer}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('notes')}
          style={{
            background: activeTab === 'notes' ? 'rgba(6, 182, 212, 0.2)' : 'none',
            border: '1px solid',
            borderColor: activeTab === 'notes' ? 'var(--primary-cyan)' : 'transparent',
            color: activeTab === 'notes' ? '#fff' : 'var(--text-muted)',
            padding: '8px 16px',
            borderRadius: '10px',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FileText size={16} /> Notes ({notes.length})
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          style={{
            background: activeTab === 'timeline' ? 'rgba(6, 182, 212, 0.2)' : 'none',
            border: '1px solid',
            borderColor: activeTab === 'timeline' ? 'var(--primary-cyan)' : 'transparent',
            color: activeTab === 'timeline' ? '#fff' : 'var(--text-muted)',
            padding: '8px 16px',
            borderRadius: '10px',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Clock size={16} /> Activity Timeline
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'notes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Logged Customer Notes & Interactions</h3>
            <button className="btn-primary" onClick={() => setIsNoteModalOpen(true)}>
              <Plus size={16} /> Add Note
            </button>
          </div>

          {notes.length === 0 ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <FileText size={32} style={{ marginBottom: '8px' }} />
              <p>No notes logged yet. Add your first note or run AI note summary generator.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {notes.map((note) => (
                <div key={note.id} className="glass-panel" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      background: 'rgba(6, 182, 212, 0.15)',
                      color: 'var(--primary-cyan)',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      {note.category}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {new Date(note.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p style={{ fontSize: '14px', lineHeight: 1.5, color: '#e2e8f0' }}>
                    {note.content}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-color)', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>Author: {note.author}</span>
                    <span style={{
                      color: note.sentiment === 'Positive' ? '#34d399' : note.sentiment === 'Negative' ? '#f87171' : 'var(--text-muted)',
                      fontWeight: 600
                    }}>
                      {note.sentiment} Sentiment
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <TimelineView customer={customer} notes={notes} />
        </div>
      )}

      {/* Modals */}
      <NoteModal 
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSave={handleAddNote}
        customerId={customer.id}
        customerName={customer.name}
      />

      <CustomerModal 
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSave={handleUpdateCustomer}
        customer={customer}
      />

      <AISalesHub 
        isOpen={isAiHubOpen}
        onClose={() => setIsAiHubOpen(false)}
        customer={customer}
        notes={notes}
      />
    </div>
  );
}
