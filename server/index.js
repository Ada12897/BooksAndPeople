const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const EventRegistration = require('./models/EventRegistration');
const Review = require('./models/Review');
const Event = require('./models/Event');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;
const JWT_SECRET = 'supersecretkey';
const DEFAULT_COVER =
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=120&h=180&fit=crop';

mongoose
  .connect(
    'mongodb+srv://monopolyfifa1234:SWvgYadiIu7F63pM@bookpeople.zznmy2i.mongodb.net/bookpeople?retryWrites=true&w=majority&appName=bookpeople'
  )
  .then(() => console.log('MongoDB подключена'))
  .catch((err) => console.log('Ошибка MongoDB:', err));

const team = [];
const faq = [];

app.get('/', (req, res) => {
  res.json({ message: 'API работает' });
});

app.get('/api/team', (req, res) => {
  res.json(team);
});

app.get('/api/faq', (req, res) => {
  res.json(faq);
});

app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки событий' });
  }
});

app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера при загрузке отзывов' });
  }
});

app.post('/api/reviews', async (req, res) => {
  const {
    author,
    book,
    bookAuthor,
    genre,
    year,
    text,
    cover,
    rating,
    date,
  } = req.body;

  if (!author || !book || !bookAuthor || !text) {
    return res.status(400).json({
      error: 'Поля author, book, bookAuthor и text обязательны',
    });
  }

  try {
    const review = new Review({
      author: author.trim(),
      book: book.trim(),
      bookAuthor: bookAuthor.trim(),
      genre: genre || 'Классика',
      year: year ? Number(year) : new Date().getFullYear(),
      text: text.trim(),
      cover: cover || DEFAULT_COVER,
      rating: rating ? Number(rating) : 5,
      date:
        date ||
        new Date()
          .toLocaleDateString('ru-RU', {
            month: 'long',
            year: 'numeric',
          })
          .replace(' г.', '')
          .replace(/^./, (c) => c.toUpperCase()),
    });

    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера при сохранении отзыва' });
  }
});

app.post('/api/join', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  try {
    const existingUser = await User.findOne({ email: email.trim() });

    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера при регистрации' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email и пароль обязательны' });
  }

  try {
    const user = await User.findOne({ email: email.trim() });

    if (!user) {
      return res.status(400).json({ error: 'Пользователь не найден' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Неверный пароль' });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера при логине' });
  }
});

app.post('/api/register', async (req, res) => {
  const {
    name,
    email,
    phone,
    comment,
    eventId,
    eventTitle,
    eventDate,
    eventTime,
    eventLocation,
    eventFormat,
    eventImage,
  } = req.body;

  if (!name || !email || !eventId) {
    return res.status(400).json({ error: 'Имя, email и событие обязательны' });
  }

  try {
    const cleanEmail = email.trim().toLowerCase();
    const cleanEventId = String(eventId).trim();

    console.log('REGISTER BODY:', req.body);
    console.log('eventId after normalize:', cleanEventId);

    const existingRegistration = await EventRegistration.findOne({
      email: cleanEmail,
      eventId: cleanEventId,
    });

    if (existingRegistration) {
      return res.status(400).json({ error: 'Вы уже записаны на это событие' });
    }

    const registration = new EventRegistration({
      name: name.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : '',
      comment: comment ? comment.trim() : '',
      eventId: cleanEventId,
      eventTitle: eventTitle ? eventTitle.trim() : '',
      eventDate: eventDate ? eventDate.trim() : '',
      eventTime: eventTime ? eventTime.trim() : '',
      eventLocation: eventLocation ? eventLocation.trim() : '',
      eventFormat: eventFormat ? eventFormat.trim() : '',
      eventImage: eventImage ? eventImage.trim() : '',
    });

    await registration.save();

    res.status(201).json({
      success: true,
      message: `${name}, вы успешно записались!`,
      registration,
    });
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    res.status(500).json({
      error: 'Ошибка сервера при записи на событие',
      details: err.message,
    });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки пользователей' });
  }
});

app.get('/api/my-events', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email обязателен' });
  }

  try {
    const registrations = await EventRegistration.find({
      email: String(email).trim().toLowerCase(),
    }).sort({ createdAt: -1 });

    res.json(registrations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки событий' });
  }
});

app.post('/api/events', async (req, res) => {
  const {
    title,
    author,
    description,
    date,
    time,
    location,
    format,
    image,
    totalSpots,
    spots,
    genre,
  } = req.body;

  if (!title || !author || !description || !date || !time || !location || !format) {
    return res.status(400).json({ error: 'Заполните обязательные поля' });
  }

  try {
    const total = Number(totalSpots) || 10;
    const freeSpots =
      spots !== undefined && spots !== null && spots !== ''
        ? Number(spots)
        : total;

    const event = new Event({
      title: title.trim(),
      author: author.trim(),
      description: description.trim(),
      date: date.trim(),
      time: time.trim(),
      location: location.trim(),
      format: format.trim(),
      image: image ? image.trim() : '',
      totalSpots: total,
      spots: freeSpots,
      genre: genre ? genre.trim() : 'Классика',
    });

    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при создании события' });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return res.status(404).json({ error: 'Событие не найдено' });
    }

    res.json({ success: true, message: 'Событие удалено' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при удалении события' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});