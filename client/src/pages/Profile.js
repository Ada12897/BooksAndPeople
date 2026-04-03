import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Profile({ user, setUser }) {
  const navigate = useNavigate();
  const fileRef = useRef();
  const [photo, setPhoto] = useState(null);
  const [myEvents, setMyEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('info');
  const [favoriteBook, setFavoriteBook] = useState('');
  const [editingFav, setEditingFav] = useState(false);
  const [favInput, setFavInput] = useState('');
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;

      const savedPhoto = localStorage.getItem('userPhoto_' + user.email);
      if (savedPhoto) setPhoto(savedPhoto);

      const savedFav = localStorage.getItem('userFav_' + user.email);
      if (savedFav) setFavoriteBook(savedFav);

      try {
        const { data } = await axios.get(`/api/my-events?email=${encodeURIComponent(user.email)}`);
        setMyEvents(Array.isArray(data) ? data : []);
      } catch (e) {
        console.log(e);
        setMyEvents([]);
      } finally {
        setEventsLoading(false);
      }
    };

    loadProfileData();
  }, [user]);

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setPhoto(dataUrl);
      localStorage.setItem('userPhoto_' + user.email, dataUrl);
      const updatedUser = { ...user, photo: dataUrl };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    };
    reader.readAsDataURL(file);
  };

  const saveFavorite = () => {
    if (!user) return;
    setFavoriteBook(favInput);
    localStorage.setItem('userFav_' + user.email, favInput);
    setEditingFav(false);
  };

  if (!user) {
    return (
      <div className="auth-page">
        <div className="auth-bg" />
        <div className="auth-overlay" />
        <div className="auth-card">
          <div className="auth-logo">📖</div>
          <h2 className="auth-title">Вы не вошли в аккаунт</h2>
          <p className="auth-sub">Войдите, чтобы увидеть свой профиль</p>
          <div className="auth-fields">
            <Link
              to="/login"
              className="btn-primary auth-btn"
              style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}
            >
              Войти
            </Link>
            <Link
              to="/join"
              className="btn-outline auth-btn"
              style={{
                textAlign: 'center',
                textDecoration: 'none',
                display: 'block',
                marginTop: 12,
                color: 'var(--text-light)',
                borderColor: 'rgba(191,168,154,0.5)',
              }}
            >
              Вступить в клуб
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const TABS = [
    { id: 'info', label: 'Профиль' },
    { id: 'events', label: `Мои встречи${myEvents.length > 0 ? ` (${myEvents.length})` : ''}` },
  ];

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="profile-hero-bg" />
        <div className="profile-hero-overlay" />
        <div className="profile-hero-content">
          <div
            className="profile-avatar-wrap"
            onClick={() => fileRef.current.click()}
            title="Изменить фото"
          >
            {photo ? (
              <img src={photo} alt={user.name} className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar">{initials}</div>
            )}
            <div className="profile-avatar-overlay">
              <span>📷</span>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhotoUpload}
            />
          </div>

          <h1 className="profile-name">{user.name}</h1>
          <p className="profile-email">{user.email}</p>
          <span className="profile-badge">Участник клуба</span>
          <p className="profile-photo-hint">Нажмите на фото, чтобы изменить</p>
        </div>
      </div>

      <section className="section profile-section">
        <div className="profile-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'info' && (
          <div>
            <div className="profile-card">
              <h2 className="profile-card-title">Данные профиля</h2>
              <div className="profile-fields">
                <div className="profile-field">
                  <span className="profile-field-label">Имя</span>
                  <span className="profile-field-value">{user.name}</span>
                </div>

                <div className="profile-field">
                  <span className="profile-field-label">Email</span>
                  <span className="profile-field-value">{user.email}</span>
                </div>

                <div className="profile-field">
                  <span className="profile-field-label">Статус</span>
                  <span className="profile-field-value">Участник клуба ✓</span>
                </div>

                <div className="profile-field">
                  <span className="profile-field-label">Любимая книга</span>
                  {editingFav ? (
                    <div
                      style={{
                        display: 'flex',
                        gap: 8,
                        alignItems: 'center',
                        flex: 1,
                        justifyContent: 'flex-end',
                      }}
                    >
                      <input
                        className="form-input"
                        style={{ maxWidth: 240, padding: '6px 12px', fontSize: '0.9rem' }}
                        placeholder="Название книги"
                        value={favInput}
                        onChange={(e) => setFavInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && saveFavorite()}
                        autoFocus
                      />
                      <button type="button" className="btn-small" onClick={saveFavorite}>
                        Сохранить
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span className="profile-field-value">
                        {favoriteBook || (
                          <span style={{ color: 'var(--brown-pale)', fontStyle: 'italic' }}>
                            Не указана
                          </span>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setFavInput(favoriteBook);
                          setEditingFav(true);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--brown-light)',
                          fontSize: '0.8rem',
                          padding: '2px 6px',
                        }}
                      >
                        ✏️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <Link to="/events" className="btn-primary">
                Смотреть афишу
              </Link>
              <button type="button" onClick={logout} className="btn-logout">
                Выйти из аккаунта
              </button>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            {eventsLoading ? (
              <div className="profile-empty">
                <p className="profile-empty-text">Загрузка...</p>
              </div>
            ) : myEvents.length === 0 ? (
              <div className="profile-empty">
                <p className="profile-empty-icon">📅</p>
                <p className="profile-empty-text">Вы ещё не записались ни на одну встречу</p>
                <Link to="/events" className="btn-primary">
                  Смотреть афишу
                </Link>
              </div>
            ) : (
              <div className="profile-events-list">
                {myEvents.map((ev) => (
                  <div key={ev._id} className="profile-event-card">
                    {ev.eventImage ? (
                      <img src={ev.eventImage} alt={ev.eventTitle} className="profile-event-img" />
                    ) : null}

                    <div className="profile-event-body">
                      <span className="event-tag">{ev.eventFormat || 'Событие'}</span>
                      <h3 className="profile-event-title">{ev.eventTitle}</h3>
                      <p className="profile-event-meta">📅 {ev.eventDate} · {ev.eventTime}</p>
                      <p className="profile-event-meta">📍 {ev.eventLocation}</p>
                      {ev.comment ? <p className="profile-event-meta">💬 {ev.comment}</p> : null}
                      <span className="profile-event-badge">✓ Вы записаны</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}