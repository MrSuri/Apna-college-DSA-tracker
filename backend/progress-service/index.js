const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const progressRoutes = require('./routes/progress');

const app = express();

const PORT = process.env.PORT || process.env.AUTH_PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dsa_sheet_progress';

app.use(helmet());
app.use(
  cors({
    origin: '*'
  })
);
app.use(express.json());
app.use(morgan('dev'));

app.use('/progress', progressRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'progress-service' });
});

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Progress service connected to MongoDB');
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Progress service running on port ${PORT}`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Progress service MongoDB connection error', err);
  });


