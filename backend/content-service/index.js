const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const topicsRoute = require('./routes/topics');

const app = express();

const PORT = process.env.CONTENT_PORT || 5002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dsa_sheet_content';

app.use(helmet());
app.use(
  cors({
    origin: '*'
  })
);
app.use(express.json());
app.use(morgan('dev'));

app.use('/topics', topicsRoute);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'content-service' });
});

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Content service connected to MongoDB');
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Content service running on port ${PORT}`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Content service MongoDB connection error', err);
  });


