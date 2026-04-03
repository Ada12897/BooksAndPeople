import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const STATIC_TEAM = [
  {
    id: 'static-1',
    name: 'Айгерим Сейткали',
    role: 'Основатель клуба',
    quote: 'Книги — это тихие разговоры с людьми, которых ты никогда не встречал.',
    favoriteBook: '«Сто лет одиночества» — Маркес',
    booksRead: 148,
    joined: 'март 2022',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: 'static-2',
    name: 'Даниар Жаксыбеков',
    role: 'Модератор встреч',
    quote: 'Хорошее обсуждение начинается с честного вопроса.',
    favoriteBook: '«Мастер и Маргарита» — Булгаков',
    booksRead: 94,
    joined: 'апрель 2022',
    photo: 'https://liter.kz/cache/imagine/1200/uploads/news/2024/07/10/668e3c133bce7476848039.jpg',
  },
  {
    id: 'static-3',
    name: 'Мадина Ережепова',
    role: 'Куратор рецензий',
    quote: 'Писать о книге — значит читать её заново.',
    favoriteBook: '«Дневник памяти» — Спаркс',
    booksRead: 211,
    joined: 'июнь 2022',
    photo: 'data:image/jpeg;base64,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',
  },
  {
    id: 'static-4',
    name: 'Тимур Асанов',
    role: 'Участник клуба',
    quote: 'Каждая книга открывает мир, который существовал всегда — но ты его не замечал.',
    favoriteBook: '«Идиот» — Достоевский',
    booksRead: 67,
    joined: 'сентябрь 2022',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: 'static-5',
    name: 'Сара Нурланова',
    role: 'Участница клуба',
    quote: 'Читать — это путешествовать, не выходя из комнаты.',
    favoriteBook: '«Анна Каренина» — Толстой',
    booksRead: 132,
    joined: 'январь 2023',
    photo: 'https://thumbs.dreamstime.com/b/none-179973809.jpg',
  },
];

export default function Team() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { data } = await axios.get('/api/users');

        const usersFromDb = data.map((user) => ({
          id: 'db-' + user._id,
          name: user.name,
          role: 'Участник клуба',
          quote: 'Рад быть частью этого замечательного клуба!',
          favoriteBook: 'Ещё не выбрана',
          booksRead: 0,
          joined: new Date().toLocaleDateString('ru-RU', {
            month: 'long',
            year: 'numeric',
          }),
          photo: null,
        }));

        const savedUser = localStorage.getItem('user');
        let currentUser = [];

        if (savedUser) {
          const user = JSON.parse(savedUser);

          const exists = usersFromDb.some(u => u.name === user.name);

          if (!exists) {
            currentUser = [{
              id: 'local-' + user.email,
              name: user.name,
              role: 'Вы',
              quote: 'Рад быть частью клуба!',
              favoriteBook: 'Ещё не выбрана',
              booksRead: 0,
              joined: new Date().toLocaleDateString('ru-RU', {
                month: 'long',
                year: 'numeric',
              }),
              photo: user.photo || null,
            }];
          }
        }

        setMembers([
          ...STATIC_TEAM,
          ...usersFromDb,
          ...currentUser
        ]);

      } catch (e) {
        console.log(e);
        setMembers(STATIC_TEAM);
      }
    };

    loadUsers();
  }, []);

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <h1 className="page-hero-title">Наша команда</h1>
          <p className="page-hero-sub">Люди, которые делают клуб живым</p>
        </div>
      </div>

      <div className="section-full team-bg" style={{ padding: '80px 48px' }}>
        <h2 className="section-title-light">Участники клуба</h2>
        <div className="section-divider-light" />

        <div className="team-grid">
          {members.map((member, i) => (
            <div
              key={member.id}
              className="team-card-new fade-in"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className="team-avatar-wrap">
                {member.photo ? (
                  <img src={member.photo} alt={member.name} className="team-avatar-img" />
                ) : (
                  <div className="team-avatar-initials">
                    {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="team-card-body">
                <h3 className="team-name">{member.name}</h3>
                <span className="team-role-badge">{member.role}</span>

                <p className="team-quote">«{member.quote}»</p>

                <div className="team-stats">
                  <div className="team-stat">
                    <span className="team-stat-value">{member.booksRead}</span>
                    <span className="team-stat-label">книг прочитано</span>
                  </div>

                  <div className="team-stat">
                    <span className="team-stat-value" style={{ fontSize: '0.75rem' }}>
                      {member.joined}
                    </span>
                    <span className="team-stat-label">в клубе с</span>
                  </div>
                </div>

                <div className="team-fav-book">
                  <span className="team-fav-label">Любимая книга</span>
                  <span className="team-fav-value">{member.favoriteBook}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}