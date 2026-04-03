import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

export default function Admin() {
  const savedUser = localStorage.getItem('user');
  const user = savedUser ? JSON.parse(savedUser) : null;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    author: '',
    description: '',
    date: '',
    time: '',
    location: '',
    format: 'Живая встреча',
    image: '',
    totalSpots: 10,
    spots: 10,
    genre: 'Классика',
  });

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const { data } = await axios.get('/api/events');
        setEvents(Array.isArray(data) ? data : []);
      } catch (e) {
        console.log(e);
        setError('Ошибка загрузки событий');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleAddEvent = async () => {
    if (
      !form.title ||
      !form.author ||
      !form.description ||
      !form.date ||
      !form.time ||
      !form.location ||
      !form.format
    ) {
      setError('Заполните обязательные поля');
      return;
    }

    try {
      setError('');
      const { data } = await axios.post('/api/events', form);
      setEvents((prev) => [data, ...prev]);
      setForm({
        title: '',
        author: '',
        description: '',
        date: '',
        time: '',
        location: '',
        format: 'Живая встреча',
        image: '',
        totalSpots: 10,
        spots: 10,
        genre: 'Классика',
      });
    } catch (e) {
      console.log(e);
      setError(e?.response?.data?.error || 'Ошибка при создании события');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/events/${id}`);
      setEvents((prev) => prev.filter((event) => event._id !== id));
    } catch (e) {
      console.log(e);
      setError('Ошибка при удалении события');
    }
  };

  return (
    <div className="section" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <h1 className="section-title">Админ-панель</h1>
      <div className="section-divider" />

      <div className="profile-card" style={{ marginBottom: 32 }}>
        <h2 className="profile-card-title">Добавить афишу</h2>

        <div className="profile-fields" style={{ display: 'grid', gap: 14 }}>
          <input
            className="form-input dark"
            placeholder="Название"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            className="form-input dark"
            placeholder="Автор / ведущий"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />

          <textarea
            className="form-input dark"
            placeholder="Описание"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <input
            className="form-input dark"
            placeholder="Дата"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />

          <input
            className="form-input dark"
            placeholder="Время"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
          />

          <input
            className="form-input dark"
            placeholder="Место"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          <select
            className="form-input dark"
            value={form.format}
            onChange={(e) => setForm({ ...form, format: e.target.value })}
          >
            <option value="Живая встреча">Живая встреча</option>
            <option value="Онлайн">Онлайн</option>
            <option value="Авторская встреча">Авторская встреча</option>
          </select>

          <input
            className="form-input dark"
            placeholder="Ссылка на картинку"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />

          <input
            className="form-input dark"
            type="number"
            placeholder="Всего мест"
            value={form.totalSpots}
            onChange={(e) => setForm({ ...form, totalSpots: e.target.value })}
          />

          <input
            className="form-input dark"
            type="number"
            placeholder="Свободных мест"
            value={form.spots}
            onChange={(e) => setForm({ ...form, spots: e.target.value })}
          />

          <input
            className="form-input dark"
            placeholder="Жанр"
            value={form.genre}
            onChange={(e) => setForm({ ...form, genre: e.target.value })}
          />

          {error ? <p className="auth-error">{error}</p> : null}

          <button className="btn-primary" onClick={handleAddEvent}>
            Добавить событие
          </button>
        </div>
      </div>

      <div className="events-list">
        {loading ? (
          <p className="loading">Загрузка...</p>
        ) : events.length === 0 ? (
          <p className="loading">Событий пока нет</p>
        ) : (
          events.map((ev) => (
            <div key={ev._id} className="event-card">
              <div className="event-card-img-wrap">
                {ev.image ? (
                  <img src={ev.image} alt={ev.title} className="event-card-img" />
                ) : null}
                <span className="event-format-badge">{ev.format}</span>
              </div>

              <div className="event-card-body">
                <div className="event-card-top">
                  <p className="event-date">📅 {ev.date} · {ev.time}</p>
                  <h3 className="event-title">{ev.title}</h3>
                  <p className="event-author-tag">✍️ {ev.author}</p>
                  <p className="event-desc">{ev.description}</p>
                </div>

                <div className="event-card-footer" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <p className="event-location">📍 {ev.location}</p>
                  <button className="btn-logout" onClick={() => handleDelete(ev._id)}>
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}