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

// CORS before other middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Log all incoming requests
app.use((req, res, next) => {
  // eslint-disable-next-line no-console
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use('/auth', authRoutes);

app.get('/health', (req, res) => {
  // eslint-disable-next-line no-console
  console.log('Health check called');
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'ok', 
    service: 'auth-service',
    mongodb: mongoStatus
  });
});

// Root endpoint for testing
app.get('/', (req, res) => {
  // eslint-disable-next-line no-console
  console.log('Root endpoint called');
  res.json({ message: 'Auth service is running', port: PORT });
});

// Start server first, then connect to MongoDB
app.listen(PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`========================================`);
  // eslint-disable-next-line no-console
  console.log(`Auth service running on port ${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`MONGO_URI: ${MONGO_URI ? 'Set (' + MONGO_URI.substring(0, 20) + '...)' : 'Not set'}`);
  // eslint-disable-next-line no-console
  console.log(`Server is ready to accept connections`);
  // eslint-disable-next-line no-console
  console.log(`========================================`);
  
  // Connect to MongoDB
  mongoose
    .connect(MONGO_URI)
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
