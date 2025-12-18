const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

progressSchema.index({ userId: 1, problemId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);


