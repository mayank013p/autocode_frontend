import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import './Login.css';

const GithubIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface LoginProps {
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (!email || !password) { setError('Please fill in all fields'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email'); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, password);
      login(data.token, data.user);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('credentials') || msg.includes('400')) {
        setError('Invalid email or password.');
      } else if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('fetch')) {
        setError('Cannot connect to server. Is the backend running?');
      } else {
        setError(msg || 'Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHub = () => {
    const clientId = 'Ov23lifFAmwi0235qhZz';
    const redirect = window.location.origin;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirect}&scope=user:email`;
  };

  return (
    <div className="auth-container">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to AutoCode</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="error-message">
              <AlertCircle size={14} />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="auth-form-group">
            <label className="auth-label">Email</label>
            <div className="auth-input-wrapper">
              <Mail className="auth-icon" />
              <input type="email" value={email} onChange={e => { setEmail(e.target.value); if (error) setError(null); }} className="auth-input" placeholder="you@example.com" autoComplete="email" />
            </div>
          </div>

          <div className="auth-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="auth-label">Password</label>
              <button type="button" style={{ fontSize: '10px', color: 'var(--indigo-light)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', marginBottom: '0.5rem' }}
                onClick={() => alert('Password reset not yet implemented.')}>
                FORGOT?
              </button>
            </div>
            <div className="auth-input-wrapper">
              <Lock className="auth-icon" />
              <input type="password" value={password} onChange={e => { setPassword(e.target.value); if (error) setError(null); }} className="auth-input" placeholder="••••••••" autoComplete="current-password" />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="auth-submit-btn">
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><span>Sign In</span><ArrowRight size={16} /></>}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <button onClick={handleGitHub} className="github-btn">
          <GithubIcon size={16} />
          <span>Continue with GitHub</span>
        </button>

        <p className="auth-footer">
          No account?{' '}
          <button onClick={onSwitchToRegister} className="auth-link">Create one</button>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
