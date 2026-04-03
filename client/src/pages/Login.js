import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login({ setUser }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const handleLogin = async () => {
  setError('');
  if (!form.email || !form.password) {
    setError('Введите email и пароль');
    return;
  }

  setLoading(true);

  try {
    const { data } = await axios.post('/api/login', form);

    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);

    if (data.user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/profile');
    }

  } catch (err) {
    setError(err.response?.data?.error || 'Ошибка входа');
  } finally {
    setLoading(false);
  }
};

  const handleKey = (e) => { if (e.key === 'Enter') handleLogin(); };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-overlay" />
      <div className="auth-card">
        <div className="auth-logo">📖</div>
        <h1 className="auth-title">Вход в клуб</h1>
        <p className="auth-sub">Рады видеть вас снова</p>

        <div className="auth-fields">
          <div className="form-group">
            <input
              className="form-input"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              onKeyDown={handleKey}
            />
          </div>
          <div className="form-group">
            <input
              className="form-input"
              placeholder="Пароль"
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={handleKey}
            />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button
            className="btn-primary auth-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Входим...' : 'Войти'}
          </button>
        </div>

        <p className="auth-switch">
          Ещё не с нами?{' '}
          <Link to="/join" className="auth-link">Вступить в клуб</Link>
        </p>
      </div>
    </div>
  );
}