const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      default: '',
      trim: true,
    },

    comment: {
      type: String,
      default: '',
      trim: true,
    },

    eventId: {
      type: String,
      required: true,
    },

    eventTitle: {
      type: String,
      default: '',
      trim: true,
    },

    eventDate: {
      type: String,
      default: '',
      trim: true,
    },

    eventTime: {
      type: String,
      default: '',
      trim: true,
    },

    eventLocation: {
      type: String,
      default: '',
      trim: true,
    },

    eventFormat: {
      type: String,
      default: '',
      trim: true,
    },

    eventImage: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

registrationSchema.index({ email: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('EventRegistration', registrationSchema);