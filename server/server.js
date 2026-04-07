import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import practiceRoutes from './routes/practice.js';
import subscriptionRoutes from './routes/subscription.js';
import aiRoutes from './routes/aiRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

// import authRoutes from './routes/authRoutes.js'; 

dotenv.config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(express.json({ limit: '25mb' }));

// CORS - allow local dev origins (adjust via CLIENT_ORIGIN env var if needed)
const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://127.0.0.1:3000'
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback){
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // allow other origins in dev; change to callback(new Error('Not allowed by CORS')) in prod
    }
  },
  credentials: true
}));

console.log('test', process.env.MONGODB_URI);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sursadhana')
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  console.log('Server will continue without database connection. Some features may not work.');
});

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', userRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/subscription', subscriptionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SurSadhana Backend is running' });
});

// Serve frontend in production if built
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.join(__dirname, '..', 'client', 'dist');
try {
  // If dist exists, serve it as static files
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    // Only handle non-API requests
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
  console.log('Static frontend serving enabled from', clientDist);
} catch (e) {
  // ignore if dist not present
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err && (err.type === 'entity.too.large' || err.status === 413)) {
    return res.status(413).json({ error: 'Request payload too large. Please upload a smaller audio file.' });
  }
  return res.status(500).json({ error: err?.message || 'Something went wrong!' });
});
// const cors = require('cors');

// Attach AI routes
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
