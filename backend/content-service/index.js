const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const topicsRoute = require('./routes/topics');

const app = express();

const PORT = process.env.PORT || process.env.CONTENT_PORT || 5002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dsa_sheet_content';

// Trust proxy - required for Railway
app.set('trust proxy', true);

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
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'ok', 
    service: 'content-service',
    mongodb: mongoStatus
  });
});

// Start server first, then connect to MongoDB
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Content service running on port ${PORT}`);
  // eslint-disable-next-line no-console
  console.log('MONGO_URI:', MONGO_URI ? 'Set' : 'Not set');
  
  // Connect to MongoDB
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      // eslint-disable-next-line no-console
      console.log('Content service connected to MongoDB');
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Content service MongoDB connection error', err);
      // eslint-disable-next-line no-console
      console.error('MONGO_URI:', MONGO_URI ? 'Set' : 'Not set');
    });
});

// Handle uncaught errors
process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});


