import React, { useEffect, useState } from 'react';
import axios from 'axios';

const INITIAL_REVIEWS = [
  {
    id: 1,
    author: 'Айгерим С.',
    book: 'Сто лет одиночества',
    bookAuthor: 'Габриэль Гарсиа Маркес',
    genre: 'Магический реализм',
    year: 1967,
    rating: 5,
    text: 'Эта книга — как сон, из которого не хочется выходить. Маркес создал целый мир, живущий по своим законам. Читала три раза и каждый раз открываю что-то новое. Особенно поражает, как автор говорит о памяти и забвении — так просто и так глубоко одновременно.',
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=120&h=180&fit=crop',
    date: 'Март 2025',
  },
  {
    id: 2,
    author: 'Даниар Ж.',
    book: 'Мастер и Маргарита',
    bookAuthor: 'Михаил Булгаков',
    genre: 'Классика',
    year: 1967,
    rating: 5,
    text: 'Роман, который невозможно однозначно интерпретировать — и в этом его сила. Воланд — один из лучших литературных персонажей всех времён. Булгаков написал книгу о свободе в несвободное время, и это чувствуется в каждой строчке.',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=120&h=180&fit=crop',
    date: 'Февраль 2025',
  },
  {
    id: 3,
    author: 'Мадина Е.',
    book: 'Норвежский лес',
    bookAuthor: 'Харуки Мураками',
    genre: 'Современная проза',
    year: 1987,
    rating: 4,
    text: 'Пронзительно тихая книга о потере и взрослении. Мураками пишет о горе так, как будто это нечто живое — оно дышит между строк. Не самый лёгкий роман, но именно такие книги остаются с тобой надолго.',
    cover: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=120&h=180&fit=crop',
    date: 'Январь 2025',
  },
  {
    id: 4,
    author: 'Тимур А.',
    book: 'Идиот',
    bookAuthor: 'Фёдор Достоевский',
    genre: 'Классика',
    year: 1869,
    rating: 5,
    text: 'Достоевский создал персонажа, который слишком хорош для этого мира — и показал, что с такими людьми делает общество. Роман болезненный, но честный. Мышкин — один из немногих по-настоящему положительных героев в литературе.',
    cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=120&h=180&fit=crop',
    date: 'Декабрь 2024',
  },
  {
    id: 5,
    author: 'Сара Н.',
    book: 'Маленькая жизнь',
    bookAuthor: 'Ханья Янагихара',
    genre: 'Современная проза',
    year: 2015,
    rating: 5,
    text: 'Самая тяжёлая книга, которую я читала в жизни — и самая важная. Янагихара пишет о травме, дружбе и выживании с такой точностью, что иногда приходится откладывать книгу и просто дышать. Обязательно к прочтению.',
    cover: 'https://images.unsplash.com/photo-1529148482759-b35b25c5f217?w=120&h=180&fit=crop',
    date: 'Ноябрь 2024',
  },
  {
    id: 6,
    author: 'Алия М.',
    book: 'Sapiens. Краткая история человечества',
    bookAuthor: 'Юваль Ной Харари',
    genre: 'Нон-фикшн',
    year: 2011,
    rating: 4,
    text: 'Харари умеет рассказывать о сложном просто. После этой книги начинаешь смотреть на историю совсем иначе. Некоторые тезисы спорны, но именно это делает её такой интересной для обсуждения в клубе.',
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=120&h=180&fit=crop',
    date: 'Октябрь 2024',
  },
];

const ALL_GENRES = ['Все', 'Классика', 'Современная проза', 'Магический реализм', 'Нон-фикшн'];
const ALL_YEARS = ['Все', 'До 1900', '1900–1970', '1971–2000', '2001–сейчас'];
const DEFAULT_COVER = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=120&h=180&fit=crop';

function matchYear(book, filter) {
  if (filter === 'Все') return true;
  if (filter === 'До 1900') return Number(book.year) < 1900;
  if (filter === '1900–1970') return Number(book.year) >= 1900 && Number(book.year) <= 1970;
  if (filter === '1971–2000') return Number(book.year) >= 1971 && Number(book.year) <= 2000;
  if (filter === '2001–сейчас') return Number(book.year) >= 2001;
  return true;
}

function normalizeReview(review) {
  return {
    ...review,
    author: review.author || 'Аноним',
    book: review.book || 'Без названия',
    bookAuthor: review.bookAuthor || 'Автор не указан',
    genre: review.genre || 'Классика',
    year: Number(review.year) || new Date().getFullYear(),
    rating: Math.min(5, Math.max(1, Number(review.rating) || 5)),
    text: review.text || '',
    cover: review.cover || DEFAULT_COVER,
    date:
      review.date ||
      (review.createdAt
        ? new Date(review.createdAt).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
        : new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })),
  };
}

function StarRating({ rating }) {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= rating ? '#C4AFA8' : 'rgba(196,175,168,0.3)', fontSize: '0.9rem' }}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS.map(normalizeReview));
  const [genreFilter, setGenreFilter] = useState('Все');
  const [yearFilter, setYearFilter] = useState('Все');
  const [authorSearch, setAuthorSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    author: '',
    book: '',
    bookAuthor: '',
    genre: 'Классика',
    year: '',
    text: '',
    cover: '',
    rating: 5,
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get('/api/reviews');
        if (Array.isArray(data) && data.length) {
          const normalizedDbReviews = data.map(normalizeReview);
          const normalizedInitialReviews = INITIAL_REVIEWS.map(normalizeReview);
          setReviews([...normalizedDbReviews, ...normalizedInitialReviews]);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const filtered = reviews.filter(
    (r) =>
      (genreFilter === 'Все' || r.genre === genreFilter) &&
      matchYear(r, yearFilter) &&
      (authorSearch === '' ||
        (r.bookAuthor || '').toLowerCase().includes(authorSearch.toLowerCase()) ||
        (r.book || '').toLowerCase().includes(authorSearch.toLowerCase()))
  );

  const handleSubmit = async () => {
    if (!form.author || !form.book || !form.bookAuthor || !form.text) {
      setError('Заполните обязательные поля');
      setSuccess('');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    const wordCount = form.text.trim().split(/\s+/).filter(Boolean).length;

    if (wordCount > 50) {
      setError('Рецензия должна быть не длиннее 50 слов');
      return;
    }

    const payload = {
      author: form.author.trim(),
      book: form.book.trim(),
      bookAuthor: form.bookAuthor.trim(),
      genre: form.genre || 'Классика',
      year: parseInt(form.year, 10) || new Date().getFullYear(),
      text: form.text.trim(),
      cover: form.cover.trim() || DEFAULT_COVER,
      rating: Number(form.rating) || 5,
      date: new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }),
    };

    try {
      const { data } = await axios.post('/api/reviews', payload);
      setReviews((prev) => [normalizeReview(data), ...prev]);
      setSuccess('Ваша рецензия добавлена!');
      setForm({
        author: '',
        book: '',
        bookAuthor: '',
        genre: 'Классика',
        year: '',
        text: '',
        cover: '',
        rating: 5,
      });
      setTimeout(() => {
        setShowForm(false);
        setSuccess('');
      }, 2000);
    } catch (e) {
      setError(e?.response?.data?.error || 'Ошибка при сохранении рецензии');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <h1 className="page-hero-title">Рецензии</h1>
          <p className="page-hero-sub">Что думают участники клуба</p>
        </div>
      </div>

      <section className="section">
        <h2 className="section-title">Рецензии членов клуба</h2>
        <div className="section-divider" />

        <div className="reviews-filters">
          <div className="reviews-filter-group">
            <span className="filter-label">Жанр:</span>
            <div className="filter-pills">
              {ALL_GENRES.map((g) => (
                <button key={g} className={`filter-btn ${genreFilter === g ? 'active' : ''}`} onClick={() => setGenreFilter(g)}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="reviews-filter-group">
            <span className="filter-label">Год:</span>
            <div className="filter-pills">
              {ALL_YEARS.map((y) => (
                <button key={y} className={`filter-btn ${yearFilter === y ? 'active' : ''}`} onClick={() => setYearFilter(y)}>
                  {y}
                </button>
              ))}
            </div>
          </div>

          <div className="reviews-filter-group">
            <span className="filter-label">Поиск:</span>
            <input
              className="reviews-search"
              placeholder="Автор или книга..."
              value={authorSearch}
              onChange={(e) => setAuthorSearch(e.target.value)}
            />
          </div>
        </div>

        <p className="reviews-count">Найдено: {filtered.length} рецензий</p>

        <div className="reviews-grid">
          {loading ? (
            <p className="loading">Загрузка...</p>
          ) : (
            <>
              {filtered.map((r, i) => (
                <div key={r._id || r.id} className="review-card fade-in" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="review-header">
                    <img
                      src={r.cover}
                      alt={r.book}
                      className="review-cover"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_COVER;
                      }}
                    />
                    <div className="review-book-info">
                      <p className="review-book-title">{r.book}</p>
                      <p className="review-book-author">{r.bookAuthor}</p>
                      <span className="review-genre-badge">{r.genre}</span>
                      <p className="review-year">Год издания: {r.year}</p>
                      <StarRating rating={r.rating} />
                    </div>
                  </div>
                  <p className="review-text">{r.text}</p>
                  <div className="review-footer">
                    <span className="review-author">— {r.author}</span>
                    <span className="review-date">
                      {(r.date || '')
                        .replace(' г.', '')
                        .replace(/^./, (c) => c.toUpperCase())}
                    </span>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <p className="loading">По выбранным фильтрам рецензий не найдено</p>}
            </>
          )}
        </div>

        <div className="reviews-cta">
          {!showForm ? (
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              Написать рецензию
            </button>
          ) : (
            <div className="review-form-wrapper">
              <h3 className="form-title">Поделитесь впечатлением</h3>
              {success ? <p className="success-msg">{success}</p> : null}
              {error ? <p className="error-msg">{error}</p> : null}

              {!success ? (
                <>
                  <div className="review-form-grid">
                    <div className="form-group">
                      <label className="form-label">Ваше имя *</label>
                      <input
                        className="form-input dark"
                        placeholder="Ваше имя"
                        value={form.author}
                        onChange={(e) => setForm({ ...form, author: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Название книги *</label>
                      <input
                        className="form-input dark"
                        placeholder="Название книги"
                        value={form.book}
                        onChange={(e) => setForm({ ...form, book: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Автор книги *</label>
                      <input
                        className="form-input dark"
                        placeholder="Автор книги"
                        value={form.bookAuthor}
                        onChange={(e) => setForm({ ...form, bookAuthor: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Год издания *</label>
                      <input
                        className="form-input dark"
                        placeholder="Например, 1984"
                        type="number"
                        value={form.year}
                        onChange={(e) => setForm({ ...form, year: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Жанр *</label>
                      <select className="form-input dark" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}>
                        {ALL_GENRES.filter((g) => g !== 'Все').map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Оценка</label>
                      <div className="rating-input">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setForm({ ...form, rating: s })}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '1.4rem',
                              color: s <= form.rating ? 'var(--brown)' : 'rgba(122,96,85,0.3)',
                            }}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-group form-group-full">
                      <label className="form-label">Ссылка на обложку (необязательно)</label>
                      <input
                        className="form-input dark"
                        placeholder="https://..."
                        value={form.cover}
                        onChange={(e) => setForm({ ...form, cover: e.target.value })}
                      />
                    </div>

                    <div className="form-group form-group-full">
                      <label className="form-label">Ваша рецензия *</label>
                      <textarea
                        className="form-input dark"
                        placeholder="Поделитесь впечатлением..."
                        rows={5}
                        style={{ resize: 'vertical' }}
                        value={form.text}
                        onChange={(e) => {
                          const value = e.target.value;
                          const words = value.trim().split(/\s+/).filter(Boolean);

                          if (words.length <= 50) {
                            setForm({ ...form, text: value });
                          }
                        }}
                      />
                      <p style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: 6 }}>
                        {form.text.trim() ? form.text.trim().split(/\s+/).filter(Boolean).length : 0}/50 слов
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
                      {submitting ? 'Сохранение...' : 'Опубликовать'}
                    </button>
                    <button
                      className="btn-logout"
                      onClick={() => {
                        setShowForm(false);
                        setError('');
                        setSuccess('');
                      }}
                    >
                      Отмена
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          )}
        </div>
      </section>
    </>
  );
}