import React, { useState } from 'react';

const FAQ_DATA = [
  {
    id: 1,
    category: 'О клубе',
    question: 'Что такое Books&People?',
    answer: 'Books&People — это неформальный книжный клуб в Астане. Мы собираемся раз в две недели, чтобы обсуждать книги, делиться мыслями и находить людей, которые любят читать так же, как вы. У нас нет строгих правил — только честный разговор о хороших книгах.',
  },
  {
    id: 2,
    category: 'О клубе',
    question: 'Нужно ли быть опытным читателем, чтобы вступить?',
    answer: 'Абсолютно нет! Мы рады всем — от тех, кто прочитал одну книгу за год, до заядлых книголюбов. Главное — желание читать и говорить о прочитанном. Никто вас не экзаменует и не оценивает.',
  },
  {
    id: 3,
    category: 'О клубе',
    question: 'Как часто проходят встречи?',
    answer: 'Живые встречи проходят примерно раз в две недели в Астане. Онлайн-встречи — по мере необходимости, когда тема или гость особенно интересны. Актуальное расписание всегда есть в разделе «Афиша».',
  },
  {
    id: 4,
    category: 'Участие',
    question: 'Как записаться на встречу?',
    answer: 'Зайдите в раздел «Афиша», выберите интересующую вас встречу и нажмите «Записаться». Заполните простую форму с именем и email — и готово! Подтверждение придёт на почту.',
  },
  {
    id: 5,
    category: 'Участие',
    question: 'Сколько стоит участие?',
    answer: 'Вступление в клуб и участие во встречах — бесплатное. Мы иногда проводим встречи в кафе, и в этом случае каждый платит за себя. Если встреча платная (например, авторский вечер), это всегда указано в афише.',
  },
  {
    id: 6,
    category: 'Участие',
    question: 'Нужно ли читать книгу заранее?',
    answer: 'Желательно, но не обязательно. Многие приходят, не дочитав — и это нормально. Мы стараемся вести обсуждение так, чтобы оно было интересно всем: и тем, кто прочитал, и тем, кто только начал, и тем, кто ещё не открывал книгу.',
  },
  {
    id: 7,
    category: 'Формат',
    question: 'Как проходит типичная встреча?',
    answer: 'Встреча длится около двух часов. Первые 20–30 минут — свободное общение, знакомство новых участников. Затем модератор задаёт несколько вопросов, которые направляют разговор. В конце — обычно голосование за следующую книгу и небольшое чаепитие.',
  },
  {
    id: 8,
    category: 'Формат',
    question: 'Как вы выбираете книги для обсуждения?',
    answer: 'Книги предлагают сами участники! В конце каждой встречи мы голосуем за следующую книгу из нескольких предложений. Если хотите предложить свою — просто напишите нам или скажите на встрече. Мы стараемся чередовать жанры: классика, современная проза, нон-фикшн.',
  },
  {
    id: 9,
    category: 'Онлайн',
    question: 'Можно ли участвовать онлайн, если я не в Астане?',
    answer: 'Да! Часть наших встреч проходит в Zoom, и к ним присоединяются люди из разных городов и стран. Ссылку на встречу мы отправляем всем, кто зарегистрировался через афишу.',
  },
  {
    id: 10,
    category: 'Онлайн',
    question: 'Как мне узнавать о новых встречах?',
    answer: 'Самый надёжный способ — зарегистрироваться на сайте и следить за афишей. Мы также публикуем анонсы в Telegram-канале. Ссылку на канал можно найти в профиле после регистрации.',
  },
];

const CATEGORIES = ['Все', 'О клубе', 'Участие', 'Формат', 'Онлайн'];

export default function FAQ() {
  const [open, setOpen] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Все');

  const filtered = activeCategory === 'Все'
    ? FAQ_DATA
    : FAQ_DATA.filter(f => f.category === activeCategory);

  const toggle = (id) => setOpen(open === id ? null : id);

  return (
    <>
      <div className="page-hero">
        <div className="page-hero-bg" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <h1 className="page-hero-title">FAQ</h1>
          <p className="page-hero-sub">Часто задаваемые вопросы</p>
        </div>
      </div>

      <section className="section">
        <h2 className="section-title">Ответы на вопросы</h2>
        <div className="section-divider" />

        <div className="faq-categories">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="faq-list">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className={`faq-item fade-in ${open === item.id ? 'faq-open' : ''}`}
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => toggle(item.id)}
            >
              <div className="faq-question">
                <div className="faq-question-left">
                  <span className="faq-category-tag">{item.category}</span>
                  <span className="faq-question-text">{item.question}</span>
                </div>
                <span className={`faq-icon ${open === item.id ? 'open' : ''}`}>+</span>
              </div>
              <div className={`faq-answer ${open === item.id ? 'open' : ''}`}>
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>


      </section>
    </>
  );
}