import React from 'react';
import { Clock, MessageSquare, UserCheck, Mail, Phone, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';

export default function TimelineView({ customer, notes = [] }) {
  // Combine customer creation and notes into a sorted chronological timeline
  const events = [];

  if (customer) {
    events.push({
      id: 'create-event',
      type: 'creation',
      date: new Date(customer.created_at || Date.now()),
      title: 'Customer Account Created',
      description: `Lead profile created in CRM under stage '${customer.stage}' with initial deal value $${customer.value?.toLocaleString() || 0}.`,
      icon: UserCheck,
      badge: customer.stage
    });
  }

  notes.forEach((n) => {
    let icon = MessageSquare;
    if (n.category === 'Email') icon = Mail;
    if (n.category === 'Call') icon = Phone;
    if (n.category === 'Meeting') icon = Calendar;

    events.push({
      id: `note-${n.id}`,
      type: 'note',
      date: new Date(n.created_at || Date.now()),
      title: `${n.category || 'Note'} Logged by ${n.author || 'Sales Rep'}`,
      description: n.content,
      icon,
      sentiment: n.sentiment
    });
  });

  // Sort descending (latest first)
  events.sort((a, b) => b.date - a.date);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={18} color="var(--primary-cyan)" />
          Activity & Interaction Timeline
        </h3>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {events.length} Total Milestones Logged
        </span>
      </div>

      <div style={{ position: 'relative', paddingLeft: '28px', borderLeft: '2px solid var(--border-color)' }}>
        {events.map((event) => {
          const IconComponent = event.icon;
          return (
            <div 
              key={event.id}
              style={{
                position: 'relative',
                marginBottom: '24px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px'
              }}
            >
              {/* Timeline Dot Icon */}
              <div style={{
                position: 'absolute',
                left: '-44px',
                top: '16px',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: event.type === 'creation' 
                  ? 'linear-gradient(135deg, #3b82f6, #06b6d4)' 
                  : 'rgba(17, 24, 39, 0.9)',
                border: '2px solid var(--primary-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <IconComponent size={14} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>
                  {event.title}
                </h4>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {event.date.toLocaleDateString()} {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                {event.description}
              </p>

              {event.sentiment && (
                <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                  <span style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontWeight: 600,
                    background: event.sentiment === 'Positive' ? 'rgba(16, 185, 129, 0.15)' : event.sentiment === 'Negative' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                    color: event.sentiment === 'Positive' ? '#34d399' : event.sentiment === 'Negative' ? '#f87171' : 'var(--text-muted)'
                  }}>
                    Sentiment: {event.sentiment}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
