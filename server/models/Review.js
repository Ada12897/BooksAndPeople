const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    author: { type: String, required: true, trim: true },
    book: { type: String, required: true, trim: true },
    bookAuthor: { type: String, required: true, trim: true },
    genre: { type: String, default: 'Классика' },
    year: { type: Number, default: new Date().getFullYear() },
    text: { type: String, required: true, trim: true },
    cover: {
      type: String,
      default: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=120&h=180&fit=crop',
    },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    date: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);