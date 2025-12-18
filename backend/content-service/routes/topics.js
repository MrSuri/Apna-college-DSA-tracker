const express = require('express');
const Topic = require('../models/Topic');
const Problem = require('../models/Problem');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const topics = await Topic.find().sort({ order: 1 });
    const problems = await Problem.find().sort({ order: 1 });

    const topicMap = topics.map((topic) => ({
      id: topic._id,
      title: topic.title,
      description: topic.description,
      order: topic.order,
      problems: problems
        .filter((p) => p.topicId.toString() === topic._id.toString())
        .map((p) => ({
          id: p._id,
          title: p.title,
          youtubeUrl: p.youtubeUrl,
          leetCodeUrl: p.leetCodeUrl,
          codeforcesUrl: p.codeforcesUrl,
          articleUrl: p.articleUrl,
          difficulty: p.difficulty,
          order: p.order
        }))
    }));

    res.json(topicMap);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Get topics error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


