const express = require('express');
const Progress = require('../models/Progress');

const router = express.Router();

function getUserId(req) {
  const userId = req.headers['x-user-id'];
  return userId;
}

router.get('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(400).json({ message: 'Missing user id' });
    }

    const items = await Progress.find({ userId });
    const map = {};
    items.forEach((item) => {
      map[item.problemId] = item.completed;
    });

    res.json(map);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Get progress error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(400).json({ message: 'Missing user id' });
    }

    const { problemId, completed } = req.body;
    if (!problemId || typeof completed !== 'boolean') {
      return res.status(400).json({ message: 'problemId and completed (boolean) are required' });
    }

    const progress = await Progress.findOneAndUpdate(
      { userId, problemId },
      { completed },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({
      id: progress._id,
      userId: progress.userId,
      problemId: progress.problemId,
      completed: progress.completed
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Update progress error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


