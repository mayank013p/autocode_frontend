import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import './Register.css';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error when user types
  useEffect(() => {
    if (error) setError(null);
  }, [name, email, password]);

  const validateForm = () => {
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await authService.register(name, email, password);
      login(data.token, data.user);
    } catch (err: any) {
      console.error("Registration Error:", err);
      if (err.message.toLowerCase().includes('already') || err.message.includes('409')) {
        setError('An account with this email already exists.');
      } else if (err.message.includes('fetch') || err.message.includes('Network')) {
        setError('Connection error. Is the backend server running?');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-card"
      >
        <div className="auth-header">
          <h1 className="auth-title">Register</h1>
          <p className="auth-subtitle">Create your AutoCode account</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="error-message"
            >
              <AlertCircle size={14} />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="auth-form-group">
            <label className="auth-label">Full Name</label>
            <div className="auth-input-wrapper">
              <User className="auth-icon" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="auth-input"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Email</label>
            <div className="auth-input-wrapper">
              <Mail className="auth-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                placeholder="email@example.com"
                required
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrapper">
              <Lock className="auth-icon" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                placeholder="Minimum 8 characters"
                required
                minLength={8}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="auth-submit-btn"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="auth-link"
          >
            Log in
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
