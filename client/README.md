# Books&People — Книжный клуб Астаны

Веб-приложение для книжного клуба: афиша встреч, регистрация, рецензии, команда, профиль.

## Автор
Курсовой проект по дисциплине ПМ04 «Проектирование и обеспечение бесперебойной работы web-сайта»

---

## Стек технологий

| Слой | Технология |
|---|---|
| Frontend | React 19, React Router DOM 7, Axios, CSS3 |
| Backend | Node.js, Express 5 |
| База данных | MongoDB Atlas (Mongoose) |
| Безопасность | bcrypt (хеширование паролей), JWT (аутентификация) |

---

## Установка и запуск

### 1. Клонировать репозиторий
```bash
git clone https://github.com/your-username/bookspeople.git
cd bookspeople
```

### 2. Настроить MongoDB Atlas
1. Создать кластер на [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Получить строку подключения вида:
   `mongodb+srv://<user>:<password>@cluster0.mongodb.net/booksclub`
3. Добавить IP `0.0.0.0/0` в Network Access

### 3. Запустить сервер (backend)
```bash
cd server
npm install
# Задать переменные окружения:
export MONGO_URI="mongodb+srv://..."
export JWT_SECRET="your_secret_key"
npm start        # продакшн
# или
npm run dev      # разработка (nodemon)
```

### 4. Запустить клиент (frontend)
```bash
cd client
npm install
npm start
```
Приложение откроется на `http://localhost:3000`

> Proxy настроен на `http://localhost:5000` в `client/package.json`

---

## Структура проекта

```
bookspeople/
├── client/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── pages/
│       │   ├── Home.js
│       │   ├── Events.js
│       │   ├── Team.js
│       │   ├── Reviews.js
│       │   ├── FAQ.js
│       │   ├── Join.js
│       │   ├── Login.js
│       │   ├── Profile.js
│       │   └── NotFound.js
│       │   └── Admin.js
│       ├── App.js
│       ├── App.css
│       └── index.js
└── server/
    ├── models/
    │   ├── User.js
    │   ├── Review.js
    │   └── EventRegistration.js
    ├── index.js
    └── package.json
```

---

## API — Документация эндпоинтов

### Аутентификация

#### `POST /api/join` — Регистрация
**Тело запроса:**
```json
{ "name": "Алия", "email": "aliya@mail.com", "password": "secret123" }
```
**Ответ (200):**
```json
{ "success": true, "token": "jwt...", "user": { "name": "Алия", "email": "aliya@mail.com" } }
```
**Ошибки:** `400` — поля не заполнены / пользователь уже существует

---

#### `POST /api/login` — Вход
**Тело запроса:**
```json
{ "email": "aliya@mail.com", "password": "secret123" }
```
**Ответ (200):**
```json
{ "success": true, "token": "jwt...", "user": { "name": "Алия", "email": "aliya@mail.com" } }
```
**Ошибки:** `400` — пользователь не найден / неверный пароль

---

### Профиль

#### `PUT /api/profile` — Обновить профиль 🔒
*Требует заголовок: `Authorization: Bearer <token>`*

**Тело запроса:**
```json
{ "favoriteBook": "Мастер и Маргарита", "photo": "data:image/jpeg;base64,..." }
```
**Ответ (200):**
```json
{ "success": true, "user": { "name": "...", "email": "...", "photo": "...", "favoriteBook": "..." } }
```

---

### Мероприятия

#### `GET /api/events` — Список всех событий
**Ответ (200):** массив объектов события

#### `GET /api/my-registrations` — Мои записи 🔒
**Ответ (200):** массив регистраций текущего пользователя

#### `POST /api/register` — Записаться на событие
**Тело запроса:**
```json
{ "name": "Алия", "email": "aliya@mail.com", "eventId": 1, "eventTitle": "...", "eventDate": "..." }
```
**Ошибки:** `400` — уже записаны на это событие

---

### Рецензии

#### `GET /api/reviews` — Все одобренные рецензии
**Ответ (200):** массив рецензий, отсортированных по дате (новые первые)

#### `POST /api/review` — Добавить рецензию
**Тело запроса:**
```json
{ "author": "Алия", "book": "Идиот", "bookAuthor": "Достоевский", "genre": "Классика", "year": 1869, "rating": 5, "text": "Замечательная книга..." }
```

#### `DELETE /api/review/:id` — Удалить рецензию 🔒
**Ответ (200):** `{ "success": true, "message": "Рецензия удалена" }`

---

### Прочее

#### `GET /api/team` — Команда клуба
#### `GET /api/faq` — Часто задаваемые вопросы

---

## Функциональность

- ✅ Регистрация и вход (JWT + bcrypt)
- ✅ Афиша с фильтрацией и бронированием мест
- ✅ Рецензии с фильтрацией по жанру, году, поиском
- ✅ Страница команды (участники отображаются автоматически)
- ✅ Профиль с загрузкой фото
- ✅ Полная адаптивность (mobile / tablet / desktop)
- ✅ 404 страница для неизвестных маршрутов
- ✅ Обработка ошибок на клиенте и сервере
- ✅ CRUD: GET, POST, PUT, DELETE через REST API
