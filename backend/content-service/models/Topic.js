const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Topic', topicSchema);


