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

app.set('trust proxy', true);

app.use(helmet());
app.use(
  cors({
    origin: '*', // adjust in production
    credentials: true
  })
);
app.use(express.json());
app.use(morgan('dev'));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200
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
    const response = await axios.post(`${AUTH_SERVICE_URL}/auth/register`, req.body);
    res.status(response.status).json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json(err.response?.data || { message: 'Auth service error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/auth/login`, req.body);
    res.status(response.status).json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json(err.response?.data || { message: 'Auth service error' });
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

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API Gateway running on port ${PORT}`);
});


