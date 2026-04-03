const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    format: { type: String, required: true, trim: true },
    image: { type: String, default: '', trim: true },
    totalSpots: { type: Number, default: 10 },
    spots: { type: Number, default: 10 },
    genre: { type: String, default: 'Классика', trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);