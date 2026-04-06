import mongoose from 'mongoose';
import User from '../models/User.js';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sursadhana';

async function run() {
  try {
    await mongoose.connect(uri);
    const user = await User.findOne({ email: 'tester1@example.com' }).lean();
    console.log('User from DB:', user);
  } catch (err) {
    console.error('Error inspecting user:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
