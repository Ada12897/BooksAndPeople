# 📖 Books&People — Книжный клуб

Полноценное React + Express приложение для книжного клуба.

## Структура проекта

```
books-and-people/
├── client/          # React фронтенд
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── pages/
│   │       ├── Home.js
│   │       ├── Events.js
│   │       ├── Team.js
│   │       ├── Reviews.js
│   │       ├── FAQ.js
│   │       └── Join.js
│   └── package.json
└── server/          # Express бэкенд
    ├── index.js
    └── package.json
```

## Запуск

### 1. Установка зависимостей и запуск сервера
```bash
cd server
npm install
npm start
# Сервер запустится на http://localhost:5000
```

### 2. Установка зависимостей и запуск клиента
```bash
cd client
npm install
npm start
# Клиент откроется на http://localhost:3000
```

## Страницы

| Страница | Маршрут | Описание |
|----------|---------|----------|
| Главная | `/` | Hero + о клубе + CTA |
| Афиша | `/events` | Список событий с записью |
| Наша команда | `/team` | Карточки участников |
| Рецензии | `/reviews` | Отзывы + форма |
| FAQ | `/faq` | Аккордеон с вопросами |
| Вступить | `/join` | Форма регистрации |

## API Endpoints

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/events` | Список событий |
| GET | `/api/team` | Команда |
| GET | `/api/reviews` | Рецензии |
| GET | `/api/faq` | Вопросы и ответы |
| POST | `/api/register` | Запись на событие |
| POST | `/api/join` | Вступление в клуб |
| POST | `/api/review` | Отправить отзыв |

## Технологии

- **Frontend**: React 18, React Router v6, Axios
- **Backend**: Express.js, CORS
- **Шрифты**: Playfair Display, Cormorant Garamond, Raleway
- **Палитра**: тёплые оттенки коричневого (#7A6055, #F5F5F5, #4A3B34)
