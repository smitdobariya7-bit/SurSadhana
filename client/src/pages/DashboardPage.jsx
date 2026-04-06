import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Music, BookOpen, Mic, Brain, Target, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    practiceStreak: 0,
    totalPracticeTime: 0,
    raagsLearned: 0,
  });

  const { user } = useAuth();

  const quickLinks = [
    { name: 'Practice Tasks', icon: Target, path: '/practice', color: 'from-blue-500 to-cyan-500' },
    { name: 'Raag Library', icon: BookOpen, path: '/raag-library', color: 'from-green-500 to-emerald-500' },
    { name: 'Riyaz Guide', icon: Music, path: '/riyaz-guide', color: 'from-orange-500 to-red-500' },
  ];

  useEffect(() => {
  const fetchDashboardStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/dashboard");
      const data = await res.json();

      setStats({
        practiceStreak: data.practiceStreak || 0,
        totalPracticeTime: data.totalPracticeTime || 0,
        raagsLearned: data.raagsLearned || 0,
      });
    } catch (error) {
      console.error("Dashboard API error:", error);
    }
  };

  fetchDashboardStats();
}, []);


  return (
    <>
      <Helmet>
        <title>Dashboard - SurSadhana</title>
        <meta name="description" content="Your personal SurSadhana dashboard. Track progress, access features, and continue your musical journey." />
      </Helmet>

      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back, {user?.name || 'Musician'}! 🎵
            </h1>
            <p className="text-xl text-gray-400">
              Continue your musical journey with SurSadhana
            </p>
          </motion.div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glassmorphism p-6 rounded-xl"
            >
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 mb-1">Practice Streak</p>
                  <p className="text-3xl font-bold text-gradient">{stats.practiceStreak} days</p>
                </div>
                <Award className="h-12 w-12 text-amber-500" />
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
                  <p className="text-gray-400 mb-1">Total Practice Time</p>
                  <p className="text-3xl font-bold text-gradient">{stats.totalPracticeTime} hrs</p>
                </div>
                <Music className="h-12 w-12 text-amber-500" />
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
                  <p className="text-gray-400 mb-1">Raags Learned</p>
                  <p className="text-3xl font-bold text-gradient">{stats.raagsLearned}</p>
                </div>
                <BookOpen className="h-12 w-12 text-amber-500" />
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Quick Access</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <Link key={link.path} to={link.path}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="glassmorphism p-6 rounded-xl cursor-pointer group"
                    >
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${link.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-gradient transition-all">
                        {link.name}
                      </h3>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Subscription Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="glassmorphism p-8 rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Current Plan: {user?.subscription || 'Free'}</h2>
                <p className="text-gray-400">
                  {user?.subscription === 'free' 
                    ? 'Upgrade to unlock premium features and accelerate your learning'
                    : 'Enjoying premium features! Keep practicing.'}
                </p>
              </div>
              {user?.subscription === 'free' && (
                <Link to="/pricing">
                  <Button className="gradient-saffron">
                    Upgrade Now
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>

          {/* Motivational Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-12 text-center glassmorphism p-8 rounded-2xl"
          >
            <h3 className="text-2xl font-bold text-gradient mb-4">
              "संगीत साधना सदा सुखदायक है"
            </h3>
            <p className="text-gray-400 italic">
              Musical practice always brings joy and fulfillment
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
