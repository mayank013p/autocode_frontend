import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import { Search, Filter, Loader2 } from 'lucide-react';
import { dashboardService } from '../services/dashboardService';

export interface NoteData {
  id: string;
  title: string;
  topic?: string;
  difficulty: string;
  summary: string;
  tags: string[];
  createdAt: string;
  approach?: string;
  solutionCode?: string;
  problemId: string;
}

interface NotesProps {
  onOpenNote: (note: any) => void;
}

const categories = ["all", "ARRAYS", "STRINGS", "GRAPHS", "TREES", "DP"];
const difficulties = ["all", "EASY", "MEDIUM", "HARD"];

const diffColor = (diff: string) =>
  diff === 'EASY' ? 'var(--accent-green)' : diff === 'HARD' ? 'var(--secondary)' : 'var(--tertiary)';
const diffBg = (diff: string) =>
  diff === 'EASY' ? 'rgba(16,185,129,0.1)' : diff === 'HARD' ? 'rgba(255,45,85,0.1)' : 'rgba(255,214,0,0.1)';

const Notes: React.FC<NotesProps> = ({ onOpenNote }) => {
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('all');
  const [activeDiff, setActiveDiff] = useState('all');
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    async function loadNotes() {
      setLoading(true);
      try {
        const data = await dashboardService.getNotes(activeCat, activeDiff, debouncedSearch);
        setNotes(data);
      } catch (err) {
        console.error("Failed to load notes", err);
      } finally {
        setLoading(false);
      }
    }
    loadNotes();
  }, [activeCat, activeDiff, debouncedSearch]);

  const btnStyle = (active: boolean) => ({
    padding: '0.3rem 0.75rem',
    borderRadius: '6px',
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    border: active ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.08)',
    color: active ? 'var(--primary)' : 'var(--text-dim)',
    background: active ? 'rgba(0,210,255,0.08)' : 'transparent',
    cursor: 'pointer',
  });

  return (
    <div>
      <Header title="Notes" subtitle={`// found ${notes.length} note(s)`} />

      {/* Search bar */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '0.75rem 1rem',
        alignItems: 'center'
      }}>
        <Search size={18} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search notes, tags, topics..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-main)',
            fontSize: '0.9rem',
            fontFamily: 'var(--font-sans)'
          }}
        />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Filter size={12} style={{ color: 'var(--text-dim)' }} />
          <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Topic</span>
          {categories.map(cat => (
            <button key={cat} style={btnStyle(activeCat === cat)} onClick={() => setActiveCat(cat)}>{cat}</button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Difficulty</span>
          {difficulties.map(d => (
            <button key={d} style={btnStyle(activeDiff === d)} onClick={() => setActiveDiff(d)}>{d}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <Loader2 className="animate-spin" size={32} color="var(--primary)" />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {notes.map((note, i) => (
            <div
              key={note.id || i}
              className="glass-card"
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}
              onClick={() => onOpenNote(note)}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {note.topic || note.tags?.[0] || 'GENERAL'}
                  </span>
                  <span style={{
                    fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                    padding: '3px 7px', borderRadius: '4px',
                    color: diffColor(note.difficulty), background: diffBg(note.difficulty)
                  }}>
                    {note.difficulty}
                  </span>
                </div>
                <h5 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem' }}>{note.title}</h5>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-dim)', marginBottom: '1.5rem', lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                  {note.summary}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                  {note.tags?.map(tag => (
                    <span key={tag} style={{
                      fontSize: '10px',
                      background: 'rgba(255,255,255,0.05)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      color: 'var(--text-dim)',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
                <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>read →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && notes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-dim)' }}>
          <p style={{ fontSize: '0.875rem' }}>No notes found matching your filters.</p>
        </div>
      )}
    </div>
  );
};

export default Notes;
