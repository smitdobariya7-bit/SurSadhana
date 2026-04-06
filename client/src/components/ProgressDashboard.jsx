import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Award, Clock } from 'lucide-react';

const toDayKey = (dateValue) => {
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

const calculateStreak = (tasks) => {
  const completedDayKeys = new Set(
    tasks
      .filter((t) => t.status === 'completed')
      .map((t) => toDayKey(t.completedAt || t.updatedAt || t.createdAt))
      .filter(Boolean)
  );

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (true) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
    if (!completedDayKeys.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

const calculatePracticeStreak = (practiceDays) => {
  if (!practiceDays || Object.keys(practiceDays).length === 0) return 0;

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (!practiceDays[key]) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

const ProgressDashboard = ({ tasks, practiceMetrics }) => {
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const totalPracticeTime = Math.round((practiceMetrics?.totalPracticeSeconds || 0) / 60);
  const averageProgress = totalTasks > 0 ? tasks.reduce((sum, t) => sum + t.progress, 0) / totalTasks : 0;
  const streak = calculatePracticeStreak(practiceMetrics?.practiceDays) || calculateStreak(tasks);

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glassmorphism p-6 rounded-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Tasks Completed</p>
            <p className="text-3xl font-bold text-gradient">{completedTasks}/{totalTasks}</p>
          </div>
          <Target className="h-10 w-10 text-amber-500" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glassmorphism p-6 rounded-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Practice Time</p>
            <p className="text-3xl font-bold text-gradient">{totalPracticeTime}m</p>
          </div>
          <Clock className="h-10 w-10 text-amber-500" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glassmorphism p-6 rounded-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Avg Progress</p>
            <p className="text-3xl font-bold text-gradient">{Math.round(averageProgress)}%</p>
          </div>
          <TrendingUp className="h-10 w-10 text-amber-500" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glassmorphism p-6 rounded-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Streak</p>
            <p className="text-3xl font-bold text-gradient">{streak} days</p>
          </div>
          <Award className="h-10 w-10 text-amber-500" />
        </div>
      </motion.div>
    </div>
  );
};

export default ProgressDashboard;
