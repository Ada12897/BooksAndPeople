import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const EVENTS = [
  {
    id: 1,
    title: 'Обсуждение «Мастер и Маргарита»',
    author: 'Михаил Булгаков',
    description: 'Один из самых загадочных романов русской литературы. Разберём скрытые смыслы, библейские параллели и магический реализм Булгакова. Почему этот роман запрещали — и почему он до сих пор актуален?',
    date: '18 апреля 2025',
    time: '19:00',
    location: 'Кофейня «Буква», ул. Кенесары 52',
    format: 'Живая встреча',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&fit=crop',
    totalSpots: 12,
    spots: 4,
    genre: 'Классика',
  },
  {
    id: 2,
    title: '«Сто лет одиночества» — магический реализм Маркеса',
    author: 'Габриэль Гарсиа Маркес',
    description: 'Семь поколений рода Буэндиа, Макондо и бесконечное одиночество. Разберём, как Маркес смешивает реальное и фантастическое, и почему эта книга изменила мировую литературу.',
    date: '2 мая 2025',
    time: '18:30',
    location: 'Zoom (ссылка придёт на email)',
    format: 'Онлайн',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&fit=crop',
    totalSpots: 30,
    spots: 17,
    genre: 'Магический реализм',
  },
  {
    id: 3,
    title: 'Авторская встреча: Айгерим Бекова',
    author: 'Айгерим Бекова',
    description: 'Казахстанский автор дебютного романа «Степная тишина» встретится с читателями. Расскажет о процессе написания, вдохновении и о том, каково это — писать о современном Казахстане.',
    date: '15 мая 2025',
    time: '19:00',
    location: 'Библиотека им. Пушкина, зал 3',
    format: 'Авторская встреча',
    image: 'https://images.unsplash.com/photo-1529148482759-b35b25c5f217?w=600&fit=crop',
    totalSpots: 20,
    spots: 0,
    genre: 'Современная проза',
  },
  {
    id: 4,
    title: '«Преступление и наказание»: психология Раскольникова',
    author: 'Фёдор Достоевский',
    description: 'Можно ли убить ради идеи? Достоевский исследует границы морали, вины и искупления. Поговорим о психологии главного героя и вечных вопросах, которые роман поднимает.',
    date: '30 мая 2025',
    time: '19:30',
    location: 'Кофейня «Буква», ул. Кенесары 52',
    format: 'Живая встреча',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&fit=crop',
    totalSpots: 12,
    spots: 8,
    genre: 'Классика',
  },
  {
    id: 5,
    title: 'Феминизм в литературе: от Вирджинии Вулф до наших дней',
    author: 'Тематическая встреча',
    description: 'Обсудим несколько ключевых текстов: «Своя комната» Вулф, «Вторая половина» Мари-Клер Блэ и современные манифесты. Как изменился женский голос в литературе за 100 лет?',
    date: '13 июня 2025',
    time: '18:00',
    location: 'Zoom (ссылка придёт на email)',
    format: 'Онлайн',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&fit=crop',
    totalSpots: 40,
    spots: 23,
    genre: 'Нон-фикшн',
  },
];

export default function Events() {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', comment: '' });
  const [formState, setFormState] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [events, setEvents] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Все');
  const [myEventIds, setMyEventIds] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const formats = ['Все', 'Живая встреча', 'Онлайн', 'Авторская встреча'];

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const { data } = await axios.get('/api/events');

        if (Array.isArray(data) && data.length) {
          setEvents(data);
        } else {
          setEvents(EVENTS);
        }
      } catch (e) {
        console.log(e);
        setEvents(EVENTS);
      } finally {
        setLoadingEvents(false);
      }
    };

    loadEvents();
  }, []);

  useEffect(() => {
    const loadMyEvents = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (!savedUser) return;

        const user = JSON.parse(savedUser);
        if (!user?.email) return;

        const { data } = await axios.get(`/api/my-events?email=${encodeURIComponent(user.email)}`);

        if (Array.isArray(data)) {
          setMyEventIds(
            data.map((item) => String(item.eventId))
          );
        }
      } catch (e) {
        console.log(e);
      }
    };

    loadMyEvents();
  }, []);

  const filtered = useMemo(() => {
    return activeFilter === 'Все'
      ? events
      : events.filter((e) => e.format === activeFilter);
  }, [events, activeFilter]);

  const openModal = (ev) => {
    const savedUser = localStorage.getItem('user');
    const parsedUser = savedUser ? JSON.parse(savedUser) : null;

    setModal(ev);
    setForm({
      name: parsedUser?.name || '',
      email: parsedUser?.email || '',
      phone: '',
      comment: '',
    });
    setFormState('idle');
    setErrorMsg('');
  };

  const closeModal = () => {
    setModal(null);
    setFormState('idle');
    setErrorMsg('');
  };

  const handleRegister = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setErrorMsg('Пожалуйста, заполните имя и email');
      return;
    }

    if (!modal) return;

    try {
      setFormState('loading');
      setErrorMsg('');

      const eventKey = modal._id || modal.id;

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        comment: form.comment.trim(),
        eventId: eventKey,
        eventTitle: modal.title,
        eventDate: modal.date,
        eventTime: modal.time,
        eventLocation: modal.location,
        eventFormat: modal.format,
        eventImage: modal.image,
      };

      await axios.post('/api/register', payload);

      setEvents((prev) =>
        prev.map((e) =>
          String(e._id || e.id) === String(eventKey)
            ? { ...e, spots: Math.max(0, Number(e.spots) - 1) }
            : e
        )
      );

      setMyEventIds((prev) =>
        prev.includes(String(eventKey)) ? prev : [...prev, String(eventKey)]
      );

      setFormState('success');
    } catch (error) {
      console.log(error);
      setFormState('idle');
      setErrorMsg(error?.response?.data?.error || 'Ошибка при записи на встречу');
    }
  };

  const spotsPercent = (ev) => {
    const total = Number(ev.totalSpots) || 1;
    const free = Number(ev.spots) || 0;
    return Math.round(((total - free) / total) * 100);
  };

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <h1 className="page-hero-title">Афиша</h1>
          <p className="page-hero-sub">Ближайшие встречи клуба</p>
        </div>
      </div>

      <section className="section">
        <div className="events-filters">
          {formats.map((f) => (
            <button
              key={f}
              type="button"
              className={`filter-btn ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="events-list">
          {loadingEvents ? (
            <p className="loading">Загрузка...</p>
          ) : (
            filtered.map((ev, i) => {
              const eventKey = String(ev._id || ev.id);
              const alreadyRegistered = myEventIds.includes(eventKey);

              return (
                <div
                  key={eventKey}
                  className="event-card fade-in"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="event-card-img-wrap">
                    <img src={ev.image} alt={ev.title} className="event-card-img" />
                    <span className="event-format-badge">{ev.format}</span>
                  </div>

                  <div className="event-card-body">
                    <div className="event-card-top">
                      <p className="event-date">📅 {ev.date} · {ev.time}</p>
                      <h3 className="event-title">{ev.title}</h3>
                      <p className="event-author-tag">✍️ {ev.author}</p>
                      <p className="event-desc">{ev.description}</p>
                    </div>

                    <div className="event-card-footer">
                      <p className="event-location">📍 {ev.location}</p>

                      <div className="event-seats-bar-wrap">
                        <div className="event-seats-bar">
                          <div
                            className="event-seats-fill"
                            style={{ width: `${spotsPercent(ev)}%` }}
                          />
                        </div>
                        <span className="event-spots">
                          {Number(ev.spots) > 0
                            ? `Осталось мест: ${ev.spots} из ${ev.totalSpots}`
                            : '🔴 Все места заняты'}
                        </span>
                      </div>

                      <button
                        type="button"
                        className={`btn-small ${Number(ev.spots) === 0 || alreadyRegistered ? 'btn-small-disabled' : ''}`}
                        onClick={() => Number(ev.spots) > 0 && !alreadyRegistered && openModal(ev)}
                        disabled={Number(ev.spots) === 0 || alreadyRegistered}
                      >
                        {alreadyRegistered
                          ? '✓ Вы записаны'
                          : Number(ev.spots) === 0
                            ? 'Мест нет'
                            : 'Записаться →'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {modal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            {formState === 'success' ? (
              <div className="modal-success">
                <div className="modal-success-icon">✓</div>
                <h3 className="modal-success-title">Вы записаны!</h3>
                <p className="modal-success-text">
                  Ждём вас на встрече <b>«{modal.title}»</b>
                  <br />
                  {modal.date} · {modal.time}
                  <br />
                  Подтверждение привязано к {form.email}.
                </p>
                <button type="button" className="btn-primary" onClick={closeModal}>
                  Отлично!
                </button>
              </div>
            ) : (
              <>
                <button type="button" className="modal-close" onClick={closeModal}>
                  ✕
                </button>

                <div className="modal-header">
                  <span className="modal-tag">{modal.format}</span>
                  <h3 className="modal-title">Запись на встречу</h3>
                  <p className="modal-event-name">«{modal.title}»</p>
                  <div className="modal-event-meta">
                    <span>📅 {modal.date} · {modal.time}</span>
                    <span>📍 {modal.location}</span>
                  </div>
                </div>

                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Ваше имя *</label>
                    <input
                      className="form-input dark"
                      placeholder="Как вас зовут?"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input
                      className="form-input dark"
                      placeholder="для подтверждения"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Телефон</label>
                    <input
                      className="form-input dark"
                      placeholder="+7 (___) ___-__-__"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Комментарий</label>
                    <textarea
                      className="form-input dark"
                      placeholder="Вопросы, пожелания..."
                      rows={3}
                      style={{ resize: 'none' }}
                      value={form.comment}
                      onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    />
                  </div>

                  {errorMsg && <p className="auth-error">{errorMsg}</p>}

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={handleRegister}
                      disabled={formState === 'loading'}
                      style={{ flex: 1 }}
                    >
                      {formState === 'loading' ? 'Отправляем...' : 'Подтвердить запись'}
                    </button>

                    <button
                      type="button"
                      className="btn-logout"
                      onClick={closeModal}
                      style={{ flex: 'none' }}
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}