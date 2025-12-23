const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');

const app = express();

const PORT = process.env.PORT || process.env.AUTH_PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dsa_sheet_auth';

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

app.use('/auth', authRoutes);

app.get('/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'ok', 
    service: 'auth-service',
    mongodb: mongoStatus
  });
});

// Start server first, then connect to MongoDB
app.listen(PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`Auth service running on port ${PORT}`);
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
      console.log('Auth service connected to MongoDB');
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Auth service MongoDB connection error', err);
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
