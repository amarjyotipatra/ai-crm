import React, { useState, useEffect } from 'react';
import { customerAPI, noteAPI } from '../api/client';
import CustomerModal from '../components/CustomerModal';
import AISalesHub from '../components/AISalesHub';
import { 
  Plus, Search, Filter, Sparkles, DollarSign, Users, Award, 
  TrendingUp, LayoutGrid, List, FileText, ChevronRight, Trash2, Edit3, RefreshCw
} from 'lucide-react';

export default function CustomerList({ onSelectCustomer }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'kanban'

  // Modals
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [aiHubCustomer, setAiHubCustomer] = useState(null);
  const [aiHubNotes, setAiHubNotes] = useState([]);

  const stages = ['All', 'Lead', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await customerAPI.getCustomers(search, selectedStage === 'All' ? '' : selectedStage);
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search, selectedStage]);

  const handleCreateOrUpdateCustomer = async (formData) => {
    if (editingCustomer) {
      await customerAPI.updateCustomer(editingCustomer.id, formData);
    } else {
      await customerAPI.createCustomer(formData);
    }
    fetchCustomers();
  };

  const handleDeleteCustomer = async (id, name, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete customer '${name}'?`)) {
      try {
        await customerAPI.deleteCustomer(id);
        fetchCustomers();
      } catch (err) {
        alert("Failed to delete customer");
      }
    }
  };

  const handleOpenAiHub = async (cust, e) => {
    e.stopPropagation();
    try {
      const notes = await noteAPI.getNotesByCustomer(cust.id);
      setAiHubNotes(notes);
    } catch (err) {
      setAiHubNotes([]);
    }
    setAiHubCustomer(cust);
  };

  // Metric computations
  const safeCustomers = Array.isArray(customers) ? customers : [];
  const totalPipelineValue = safeCustomers.reduce((sum, c) => sum + (c.value || 0), 0);
  const wonDeals = safeCustomers.filter(c => c.stage === 'Won').length;
  const winRate = safeCustomers.length > 0 ? Math.round((wonDeals / safeCustomers.length) * 100) : 0;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
      {/* Top Banner & Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Total Accounts</span>
            <Users size={18} color="var(--primary-cyan)" />
          </div>
          <h3 style={{ fontSize: '28px', fontWeight: 800, marginTop: '8px' }}>{customers.length}</h3>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Active leads in CRM pipeline</p>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Total Pipeline Value</span>
            <DollarSign size={18} color="var(--accent-emerald)" />
          </div>
          <h3 style={{ fontSize: '28px', fontWeight: 800, marginTop: '8px', color: 'var(--accent-emerald)' }}>
            ${totalPipelineValue.toLocaleString()}
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Combined deal forecast</p>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Win Rate</span>
            <Award size={18} color="var(--primary-violet)" />
          </div>
          <h3 style={{ fontSize: '28px', fontWeight: 800, marginTop: '8px', color: 'var(--primary-violet)' }}>
            {winRate}%
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Closed Won ratio</p>
        </div>

        <div className="glass-panel" style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.15))' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--primary-cyan)' }}>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>AI Sales Engine</span>
            <Sparkles size={18} />
          </div>
          <p style={{ fontSize: '12px', color: '#e2e8f0', marginTop: '8px', lineHeight: 1.4 }}>
            Generate follow-up emails, next best actions & note summaries in 1-click.
          </p>
        </div>
      </div>

      {/* Control Header & Filters */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          {/* Search bar */}
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              className="glass-input"
              style={{ paddingLeft: '40px' }}
              placeholder="Search by customer name, company, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Stage pills */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {stages.map((stg) => (
              <button
                key={stg}
                onClick={() => setSelectedStage(stg)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  border: '1px solid',
                  borderColor: selectedStage === stg ? 'var(--primary-cyan)' : 'var(--border-color)',
                  background: selectedStage === stg ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: selectedStage === stg ? '#fff' : 'var(--text-muted)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {stg}
              </button>
            ))}
          </div>

          {/* View Toggle & Add Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.6)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <button 
                onClick={() => setViewMode('table')}
                style={{
                  background: viewMode === 'table' ? 'rgba(255, 255, 255, 0.1)' : 'none',
                  border: 'none',
                  color: viewMode === 'table' ? '#fff' : 'var(--text-muted)',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                <List size={16} />
              </button>
              <button 
                onClick={() => setViewMode('kanban')}
                style={{
                  background: viewMode === 'kanban' ? 'rgba(255, 255, 255, 0.1)' : 'none',
                  border: 'none',
                  color: viewMode === 'kanban' ? '#fff' : 'var(--text-muted)',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                <LayoutGrid size={16} />
              </button>
            </div>

            <button 
              className="btn-primary" 
              onClick={() => { setEditingCustomer(null); setIsCustomerModalOpen(true); }}
            >
              <Plus size={16} />
              <span>Add Customer</span>
            </button>
          </div>

        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <RefreshCw size={32} color="var(--primary-cyan)" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Loading CRM database records...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && customers.length === 0 && (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Users size={48} color="var(--text-dim)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>No Customers Found</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Try resetting your search query or add a new customer lead to get started.
          </p>
        </div>
      )}

      {/* TABLE VIEW */}
      {!loading && viewMode === 'table' && customers.length > 0 && (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(15, 23, 42, 0.6)', color: 'var(--text-muted)', fontSize: '12px' }}>
                <th style={{ padding: '16px 20px' }}>CUSTOMER / COMPANY</th>
                <th style={{ padding: '16px 20px' }}>STAGE</th>
                <th style={{ padding: '16px 20px' }}>DEAL VALUE</th>
                <th style={{ padding: '16px 20px' }}>TAGS</th>
                <th style={{ padding: '16px 20px' }}>NOTES</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust) => {
                const stageClass = `badge badge-${cust.stage.toLowerCase()}`;
                return (
                  <tr 
                    key={cust.id}
                    onClick={() => onSelectCustomer(cust.id)}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{cust.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {cust.company || 'N/A'} • {cust.email}
                      </div>
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <span className={stageClass}>{cust.stage}</span>
                    </td>

                    <td style={{ padding: '16px 20px', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                      ${cust.value?.toLocaleString() || '0'}
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontSize: '11px', background: 'rgba(255, 255, 255, 0.06)', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                        {cust.tags || 'General'}
                      </span>
                    </td>

                    <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px' }}>
                      {cust.notes ? `${cust.notes.length} notes` : '0 notes'}
                    </td>

                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                        <button 
                          className="btn-ai"
                          style={{ padding: '6px 10px', fontSize: '12px' }}
                          title="Open AI Studio"
                          onClick={(e) => handleOpenAiHub(cust, e)}
                        >
                          <Sparkles size={14} /> AI Studio
                        </button>
                        
                        <button 
                          className="btn-secondary"
                          style={{ padding: '6px 10px' }}
                          title="Edit Customer"
                          onClick={(e) => { e.stopPropagation(); setEditingCustomer(cust); setIsCustomerModalOpen(true); }}
                        >
                          <Edit3 size={14} />
                        </button>

                        <button 
                          className="btn-danger"
                          title="Delete Customer"
                          onClick={(e) => handleDeleteCustomer(cust.id, cust.name, e)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* KANBAN VIEW */}
      {!loading && viewMode === 'kanban' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px', alignItems: 'start' }}>
          {['Lead', 'Contacted', 'Qualified', 'Proposal', 'Won'].map((colStage) => {
            const colCustomers = customers.filter(c => c.stage === colStage);
            return (
              <div key={colStage} className="glass-panel" style={{ padding: '14px', minHeight: '400px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700 }}>{colStage}</span>
                  <span style={{ fontSize: '11px', background: 'rgba(255, 255, 255, 0.1)', padding: '2px 6px', borderRadius: '999px' }}>
                    {colCustomers.length}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {colCustomers.map((cust) => (
                    <div 
                      key={cust.id}
                      onClick={() => onSelectCustomer(cust.id)}
                      style={{
                        background: 'rgba(15, 23, 42, 0.7)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '10px',
                        padding: '12px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <h4 style={{ fontSize: '13.5px', fontWeight: 700 }}>{cust.name}</h4>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{cust.company || 'N/A'}</p>
                      
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                          ${cust.value?.toLocaleString() || 0}
                        </span>
                        <button 
                          onClick={(e) => handleOpenAiHub(cust, e)}
                          style={{ background: 'none', border: 'none', color: 'var(--primary-violet)', cursor: 'pointer' }}
                          title="Run AI Studio"
                        >
                          <Sparkles size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Customer Modal */}
      <CustomerModal 
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSave={handleCreateOrUpdateCustomer}
        customer={editingCustomer}
      />

      {/* AI Studio Drawer */}
      <AISalesHub 
        isOpen={!!aiHubCustomer}
        onClose={() => setAiHubCustomer(null)}
        customer={aiHubCustomer}
        notes={aiHubNotes}
      />
    </div>
  );
}
