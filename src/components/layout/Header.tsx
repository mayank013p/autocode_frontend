import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dashboardService } from '../../services/dashboardService';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { user } = useAuth();
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    async function loadStreak() {
      try {
        const summary = await dashboardService.getSummary();
        setStreak(summary.currentStreak);
      } catch (err) {
        console.error("Failed to load streak in header", err);
      }
    }
    loadStreak();
  }, []);
  
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>{title}</h2>
        {subtitle && <p style={{ fontSize: '0.875rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{subtitle}</p>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '9999px',
          padding: '0.3rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Flame size={16} style={{ color: streak && streak > 0 ? 'var(--secondary)' : 'var(--text-dim)' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{streak ?? 0}d streak</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 700, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'Developer'}
            </p>
            <p style={{ fontSize: '10px', color: 'var(--text-dim)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email || 'dev@autocode.io'}
            </p>
          </div>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '0.5rem',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'octocat'}`}
              alt="Profile"
              style={{ width: '2rem', height: '2rem' }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
