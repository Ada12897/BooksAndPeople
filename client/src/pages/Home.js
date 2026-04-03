import React from 'react';
import { Link } from 'react-router-dom';


export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-emblem">📖</div>
          <h1 className="hero-title">BOOKS&amp;PEOPLE</h1>
          <p className="hero-sub">Место, где книги оживают в разговорах</p>
          <div className="hero-dots">
            <div className="hero-dot active" />
            <div className="hero-dot" />
            <div className="hero-dot" />
          </div>
          <div className="hero-cta">
            <Link to="/events" className="btn-primary">Смотреть афишу</Link>
            <Link to="/join" className="btn-outline">Вступить в клуб</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">О нашем клубе</h2>
        <div className="section-divider" />
        <p style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 48px', lineHeight: 1.85, color: 'var(--text-mid)', fontSize: '0.95rem', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1.05rem' }}>
          Books&People — это неформальный книжный клуб в Астане, где встречаются люди, которые любят читать и говорить о прочитанном. Мы обсуждаем разные жанры, задаём неудобные вопросы и находим в книгах то, что раньше не замечали.
        </p>
        <div className="features-grid">
          {[
            { icon: '🕯️', title: 'Живые встречи', text: 'Уютные собрания в небольших группах — для тех, кто ценит настоящий разговор без спешки.' },
            { icon: '🌐', title: 'Онлайн-формат', text: 'Участвуйте из любой точки мира. Zoom-встречи с той же тёплой атмосферой и глубокими обсуждениями.' },
            { icon: '✍️', title: 'Авторские встречи', text: 'Иногда мы приглашаем писателей — задать вопрос создателю книги особенно ценно.' },
          ].map(f => (
            <div key={f.title} className="feature-card fade-in">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-text">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div style={{ background: 'var(--bg-dark)', padding: '64px 48px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: 'var(--text-light)', marginBottom: 12 }}>
          Готовы к следующей книге?
        </h2>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', color: 'var(--brown-pale)', marginBottom: 28 }}>
          Присоединяйтесь — следующая встреча уже скоро
        </p>
        <Link to="/join" className="btn-primary">Вступить в клуб</Link>
      </div>
    </>
  );
}