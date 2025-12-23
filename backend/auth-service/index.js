const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');

const app = express();

const PORT = process.env.PORT || process.env.AUTH_PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dsa_sheet_auth';

// Trust proxy - required for Railway
app.set('trust proxy', true);

app.use(cors());
app.use(express.json());
// Temporarily remove helmet and morgan to isolate the issue

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-service' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Auth service is running' });
});

app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
  mongoose.connect(MONGO_URI).catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });
});
