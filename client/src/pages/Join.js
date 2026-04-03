import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Join({ setUser }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    if (!form.name || !form.email || !form.password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    if (form.password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/join', form);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка сервера. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-overlay" />
      <div className="auth-card">
        <div className="auth-logo">📖</div>
        <h1 className="auth-title">Присоединяйтесь к нашему клубу!</h1>
        <p className="auth-sub">Место, где книги оживают в разговорах</p>

        <div className="auth-fields">
          <div className="form-group">
            <input
              className="form-input"
              placeholder="Ваше имя"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              onKeyDown={handleKey}
            />
          </div>
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
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Регистрируем...' : 'Вступить в клуб'}
          </button>

          <div className="auth-socials">
            <a href="#" className="social-icon" title="WhatsApp">💬</a>
            <a href="#" className="social-icon" title="ВКонтакте">В</a>
            <a href="#" className="social-icon" title="Telegram">✈</a>
          </div>
        </div>

        <p className="auth-switch">
          Уже в клубе?{' '}
          <Link to="/login" className="auth-link">Войти</Link>
        </p>
      </div>
    </div>
  );
}