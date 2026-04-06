import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PracticeTaskCard from '@/components/PracticeTaskCard';
import TaskCreationModal from '@/components/TaskCreationModal';
import ProgressDashboard from '@/components/ProgressDashboard';
import AudioRecordingSection from '@/components/AudioRecordingSection';
import TanpuraPracticeSection from '@/components/TanpuraPracticeSection';
import { useAuth } from '@/contexts/AuthContext';
import {
  buildUpdatedPracticeMetrics,
  createEmptyPracticeMetrics,
  loadPracticeMetricsForUser,
  loadTasksForUser,
  savePracticeMetricsForUser,
  saveTasksForUser,
} from '@/lib/practiceStorage';

const PracticeTasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [practiceMetrics, setPracticeMetrics] = useState(createEmptyPracticeMetrics());

  const loadTasksFromStorage = () => {
    setTasks(loadTasksForUser(user));
  };

  const loadPracticeMetrics = () => {
    setPracticeMetrics(loadPracticeMetricsForUser(user));
  };

  useEffect(() => {
    loadTasksFromStorage();
    loadPracticeMetrics();

    const onStorage = (event) => {
      if (
        event.key?.includes('sursadhana_tasks') ||
        event.key?.includes('sursadhana_practice_metrics')
      ) {
        loadTasksFromStorage();
        loadPracticeMetrics();
      }
    };

    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('storage', onStorage);
    };
  }, [user]);

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      progress: 0
    };
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    saveTasksForUser(user, updatedTasks);
  };

  const updateTask = (taskId, updates) => {
    const updatedTasks = tasks.map(task => {
      if (task.id !== taskId) return task;

      const next = {
        ...task,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      if (updates.status === 'completed' && task.status !== 'completed') {
        next.completedAt = new Date().toISOString();
      }

      if (updates.status === 'active' && task.status === 'completed') {
        next.completedAt = null;
      }

      return next;
    });
    setTasks(updatedTasks);
    saveTasksForUser(user, updatedTasks);
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasksForUser(user, updatedTasks);
  };

  const handlePracticeTick = (deltaSeconds) => {
    setPracticeMetrics((currentMetrics) => {
      const nextMetrics = buildUpdatedPracticeMetrics(currentMetrics, deltaSeconds);
      savePracticeMetricsForUser(user, nextMetrics);
      return nextMetrics;
    });
  };

  return (
    <>
      <Helmet>
        <title>Practice Tasks - SurSadhana</title>
        <meta name="description" content="Manage your practice tasks, track progress, and record your practice sessions." />
      </Helmet>

      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">Practice Tasks</h1>
              <p className="text-xl text-gray-400">
                Track your musical journey and stay motivated
              </p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="gradient-saffron"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Task
            </Button>
          </motion.div>

          {/* Progress Dashboard */}
          <ProgressDashboard tasks={tasks} practiceMetrics={practiceMetrics} />

          {/* Tanpura Practice Section */}
          <TanpuraPracticeSection
            onPracticeTick={handlePracticeTick}
            totalPracticeSeconds={practiceMetrics.tanpuraPracticeSeconds || 0}
          />

          {/* Audio Recording Section */}
          <AudioRecordingSection />

          {/* Task List */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Your Tasks</h2>
            {tasks.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map((task, index) => (
                  <PracticeTaskCard
                    key={task.id}
                    task={task}
                    index={index}
                    onUpdate={updateTask}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            ) : (
              <div className="glassmorphism p-12 rounded-2xl text-center">
                <p className="text-gray-400 text-lg mb-4">
                  No practice tasks yet. Create your first task to get started!
                </p>
                <Button onClick={() => setIsModalOpen(true)} className="gradient-saffron">
                  Create Task
                </Button>
              </div>
            )}
          </div>

          {/* Task Creation Modal */}
          <TaskCreationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={addTask}
          />
        </div>
      </div>
    </>
  );
};

export default PracticeTasksPage;
