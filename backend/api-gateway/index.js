const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:5001';
const CONTENT_SERVICE_URL = process.env.CONTENT_SERVICE_URL || 'http://localhost:5002';
const PROGRESS_SERVICE_URL = process.env.PROGRESS_SERVICE_URL || 'http://localhost:5003';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key_change_me';

// Trust proxy - required for Railway and other cloud platforms
app.set('trust proxy', true);

// Configure CORS before other middleware
app.use(
  cors({
    origin: true, // Allow all origins - will reflect the request origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'Content-Type']
  })
);

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());
app.use(morgan('dev'));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  // Skip trust proxy validation for Railway/proxy environments
  validate: {
    trustProxy: false
  }
});

app.use('/api/', apiLimiter);

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Missing token' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

app.post('/api/auth/register', async (req, res) => {
  try {
    // eslint-disable-next-line no-console
    console.log('Register request received, forwarding to:', `${AUTH_SERVICE_URL}/auth/register`);
    const response = await axios.post(`${AUTH_SERVICE_URL}/auth/register`, req.body);
    // eslint-disable-next-line no-console
    console.log('Auth service responded with status:', response.status);
    res.status(response.status).json(response.data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Auth service register error:', err.message);
    // eslint-disable-next-line no-console
    console.error('Error code:', err.code);
    // eslint-disable-next-line no-console
    console.error('Error response:', err.response?.data);
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      // eslint-disable-next-line no-console
      console.error('Cannot connect to auth service at:', AUTH_SERVICE_URL);
    }
    const status = err.response?.status || 500;
    res.status(status).json(err.response?.data || { message: 'Auth service error', details: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/auth/login`, req.body);
    res.status(response.status).json(response.data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Auth service login error:', err.message);
    const status = err.response?.status || 500;
    res.status(status).json(err.response?.data || { message: 'Auth service error', details: err.message });
  }
});

app.get('/api/topics', authenticateToken, async (req, res) => {
  try {
    const response = await axios.get(`${CONTENT_SERVICE_URL}/topics`, {
      headers: { 'x-user-id': req.user.id }
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json(err.response?.data || { message: 'Content service error' });
  }
});

app.get('/api/progress', authenticateToken, async (req, res) => {
  try {
    const response = await axios.get(`${PROGRESS_SERVICE_URL}/progress`, {
      headers: { 'x-user-id': req.user.id }
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json(err.response?.data || { message: 'Progress service error' });
  }
});

app.post('/api/progress', authenticateToken, async (req, res) => {
  try {
    const response = await axios.post(
      `${PROGRESS_SERVICE_URL}/progress`,
      { ...req.body },
      {
        headers: { 'x-user-id': req.user.id }
      }
    );
    res.status(response.status).json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json(err.response?.data || { message: 'Progress service error' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

// Global error handler
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API Gateway running on port ${PORT}`);
  // eslint-disable-next-line no-console
  console.log('AUTH_SERVICE_URL:', AUTH_SERVICE_URL);
  // eslint-disable-next-line no-console
  console.log('CONTENT_SERVICE_URL:', CONTENT_SERVICE_URL);
  // eslint-disable-next-line no-console
  console.log('PROGRESS_SERVICE_URL:', PROGRESS_SERVICE_URL);
});
