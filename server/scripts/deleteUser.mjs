import mongoose from 'mongoose';
import User from '../models/User.js';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sursadhana';

async function run() {
  try {
    await mongoose.connect(uri);
    const res = await User.deleteOne({ email: 'tester1@example.com' });
    console.log('delete result:', res);
  } catch (err) {
    console.error('Error deleting user:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
