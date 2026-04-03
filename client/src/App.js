import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

import Home from './pages/Home';
import Events from './pages/Events';
import Team from './pages/Team';
import Reviews from './pages/Reviews';
import FAQ from './pages/FAQ';
import Join from './pages/Join';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

import './App.css';

function Navbar({ user }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const links = [
    { to: '/events', label: 'Афиша' },
    { to: '/team', label: 'Наша команда' },
    { to: '/reviews', label: 'Рецензии' },
    { to: '/faq', label: 'FAQ' },
  ];

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="logo-text">BOOKS<span>&</span>PEOPLE</span>
      </Link>

      <ul className="nav-links desktop-nav">
        {links.map(link => (
          <li key={link.to}>
            <Link to={link.to} className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}>
              {link.label}
            </Link>
          </li>
        ))}
        {user ? (
          <li>
            <Link to="/profile" className="nav-link nav-cta">
              {user.name.split(' ')[0]}
            </Link>
          </li>
        ) : (
          <>
            <li><Link to="/join" className="nav-link">Регистрация</Link></li>
            <li><Link to="/login" className="nav-link nav-cta">Войти</Link></li>
          </>
        )}
      </ul>

      <button
        className={`burger ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Меню"
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-links">
          {links.map(link => (
            <li key={link.to}>
              <Link to={link.to} className={`mobile-nav-link ${location.pathname === link.to ? 'active' : ''}`}>
                {link.label}
              </Link>
            </li>
          ))}
          {user ? (
            <li>
              <Link to="/profile" className="mobile-nav-link">👤 {user.name.split(' ')[0]}</Link>
            </li>
          ) : (
            <>
              <li><Link to="/join" className="mobile-nav-link">Регистрация</Link></li>
              <li><Link to="/login" className="mobile-nav-link mobile-nav-cta">Войти</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  return (
    <div className="app">
      <Navbar user={user} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/team" element={<Team />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/join" element={<Join setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}