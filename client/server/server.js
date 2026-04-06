import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sursadhana';
await mongoose.connect(mongoUri);

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  subscription: { type: String, default: 'free' },
  subscriptionExpiry: { type: Date, default: null },
  practiceStats: { type: Object, default: {} },
  preferences: { type: Object, default: {} }
}, { timestamps: true });
const User = mongoose.model('User', UserSchema);

const JWT_SECRET = process.env.JWT_SECRET || (() => {
  console.warn('WARNING: JWT_SECRET not set in environment. Using development default. This must be set in production!');
  return 'dev-secret-change-in-production';
})();
const sign = (u) => jwt.sign({ uid: u._id, email: u.email }, JWT_SECRET, { expiresIn: '7d' });
const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.uid).lean();
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    let { email, password, name } = req.body || {};
    email = String(email || '').trim().toLowerCase();
    if (!email || !password || !name) return res.status(400).json({ error: 'Missing fields' });
    const exists = await User.findOne({ email }) || await User.findOne({ email: new RegExp('^' + email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') });
    if (exists) return res.status(409).json({ error: 'Email already exists' });
    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, password: hash, name });
    const token = sign(user);
    const safe = { _id: user._id, email: user.email, name: user.name };
    res.status(201).json({ user: safe, token });
  } catch {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    let { email, password } = req.body || {};
    email = String(email || '').trim().toLowerCase();
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
    const user =
      (await User.findOne({ email })) ||
      (await User.findOne({ email: new RegExp('^' + email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') }));
    if (!user) return res.status(401).json({ error: 'Invalid Credentials' });
    const hashField = user.password || user.passwordHash || '';
    const ok = await bcrypt.compare(password, hashField);
    if (!ok) return res.status(401).json({ error: 'Invalid Credentials' });
    const token = sign(user);
    const safe = { _id: user._id, email: user.email, name: user.name };
    res.json({ user: safe, token });
  } catch {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', auth, async (req, res) => {
  const u = req.user;
  const safe = { _id: u._id, email: u.email, name: u.name };
  res.json({ user: safe });
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {});
server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    const fallback = Number(port) + 1;
    app.listen(fallback, () => {});
  }
});
