import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-overlay" />
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div className="auth-logo" style={{ fontSize: '3rem' }}>📚</div>
        <h1 className="auth-title" style={{ fontSize: '3rem', marginBottom: 8 }}>404</h1>
        <p className="auth-title" style={{ fontSize: '1.2rem', marginBottom: 8 }}>Страница не найдена</p>
        <p className="auth-sub">Кажется, эта страница пропала как закладка из книги</p>
        <div className="auth-fields" style={{ marginTop: 24 }}>
          <Link to="/" className="btn-primary auth-btn" style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}>
            На главную
          </Link>
          <Link to="/events" className="btn-outline auth-btn" style={{ textAlign: 'center', textDecoration: 'none', display: 'block', marginTop: 12, color: 'var(--text-light)' }}>
            Смотреть афишу
          </Link>
        </div>
      </div>
    </div>
  );
}