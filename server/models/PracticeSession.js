import mongoose from 'mongoose';

const practiceSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['riyaz', 'raag-practice', 'taal-practice', 'instrument-practice', 'vocal-practice'],
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  completed: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  audioRecording: {
    filename: String,
    url: String,
    duration: Number
  },
  practiceGoals: [{
    goal: String,
    achieved: { type: Boolean, default: false }
  }],
  mood: {
    type: String,
    enum: ['excellent', 'good', 'okay', 'challenging', 'frustrated'],
    default: 'good'
  }
}, {
  timestamps: true
});

// Index for efficient queries
practiceSessionSchema.index({ user: 1, date: -1 });
practiceSessionSchema.index({ category: 1, user: 1 });

export default mongoose.model('PracticeSession', practiceSessionSchema);