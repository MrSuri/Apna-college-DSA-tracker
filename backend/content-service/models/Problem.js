const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema(
  {
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true
    },
    title: { type: String, required: true },
    youtubeUrl: { type: String },
    leetCodeUrl: { type: String },
    codeforcesUrl: { type: String },
    articleUrl: { type: String },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Tough'],
      required: true
    },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Problem', problemSchema);


