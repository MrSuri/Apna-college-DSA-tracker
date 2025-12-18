import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../state/AuthContext';

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const res = await api.post(endpoint, { email, password });
      login(res.data);
      navigate('/profile');
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="app-title">DSA Sheet Tracker</h1>
        <p className="app-subtitle">
          Practice DSA systematically and track your progress topic-wise.
        </p>
        <div className="auth-toggle">
          <button
            type="button"
            className={mode === 'login' ? 'toggle-btn active' : 'toggle-btn'}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'toggle-btn active' : 'toggle-btn'}
            onClick={() => setMode('register')}
          >
            Sign up
          </button>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <label className="form-label">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </label>
          <label className="form-label">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="At least 6 characters"
            />
          </label>
          {error && <div className="error-text">{error}</div>}
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>
        <p className="hint-text">
          This is a student-only app; use a valid email and a strong password.
        </p>
      </div>
    </div>
  );
}


