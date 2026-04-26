import React from 'react';
import Header from '../components/layout/Header';
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react';
import type { NoteData } from './Notes';

interface NoteDetailProps {
  note: NoteData;
  onBack: () => void;
}

const NoteDetail: React.FC<NoteDetailProps> = ({ note, onBack }) => {
  const diffColor =
    note.difficulty === 'EASY' ? 'var(--accent-green)' :
      note.difficulty === 'HARD' ? 'var(--secondary)' :
        'var(--tertiary)';

  const diffBg =
    note.difficulty === 'EASY' ? 'rgba(16,185,129,0.1)' :
      note.difficulty === 'HARD' ? 'rgba(255,45,85,0.1)' :
        'rgba(255,214,0,0.1)';

  return (
    <div>
      <Header
        title={note.title}
        subtitle={`${note.topic || note.tags?.[0] || 'GENERAL'} · ${(note.difficulty || 'unknown').toLowerCase()}`}
      />

      <button
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--text-dim)',
          marginBottom: '2.5rem',
          fontSize: '0.875rem',
          fontWeight: 500,
          background: 'none',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <ArrowLeft size={16} />
        back to notes
      </button>

      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {note.topic || note.tags?.[0] || 'GENERAL'}
          </span>
          <span style={{
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '4px 8px',
            borderRadius: '4px',
            color: diffColor,
            background: diffBg
          }}>
            {note.difficulty}
          </span>
        </div>

        <h1 style={{ fontSize: '3.5rem', fontWeight: 700, marginBottom: '2rem', letterSpacing: '-0.02em' }}>{note.title}</h1>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', color: 'var(--text-dim)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={14} />
            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tag size={14} />
            <span>{note.tags?.length ?? 0} tags</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', maxWidth: '64rem' }}>
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <p style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
            // SUMMARY
          </p>
          <p style={{ fontSize: '1.125rem', lineHeight: 1.7, color: '#cbd5e1' }}>{note.summary}</p>
        </div>

        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <p style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
            // APPROACH
          </p>
          <div style={{ lineHeight: 1.7, color: '#cbd5e1', marginBottom: '2rem', fontWeight: 400, whiteSpace: 'pre-wrap' }}>
            {note.approach || 'Detailed approach breakdown coming soon...'}
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                background: 'rgba(0,210,255,0.05)',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)'
              }}>
                <Clock size={20} />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 700 }}>Complexity Analysis</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Detailed analysis available in approach
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NoteDetail;
