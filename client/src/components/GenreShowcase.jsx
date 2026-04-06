import React from 'react';
import { motion } from 'framer-motion';
import { Music, Heart, Sparkles, Radio, Mic2, BookOpen } from 'lucide-react';

const GenreShowcase = () => {
  const genres = [
    {
      name: 'Classical',
      icon: Music,
      description: 'Explore the timeless raags and compositions of Hindustani classical music',
      color: 'from-amber-500 to-orange-500',
    },
    {
      name: 'Bhajan',
      icon: Heart,
      description: 'Devotional songs that connect the soul with the divine',
      color: 'from-rose-500 to-pink-500',
    },
    {
      name: 'Folk',
      icon: Sparkles,
      description: 'Traditional folk music celebrating regional cultures and stories',
      color: 'from-green-500 to-emerald-500',
    },
    {
      name: 'Bollywood',
      icon: Radio,
      description: 'Popular film music blending classical traditions with modern styles',
      color: 'from-purple-500 to-violet-500',
    },
    {
      name: 'Gujarati',
      icon: Mic2,
      description: 'Regional music showcasing the vibrant culture of Gujarat',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Ghazal',
      icon: BookOpen,
      description: 'Poetic expressions of love, loss, and longing set to melodic tunes',
      color: 'from-indigo-500 to-purple-500',
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-12 text-white"
        >
          Explore Musical Genres
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {genres.map((genre, index) => {
            const Icon = genre.icon;
            return (
              <motion.div
                key={genre.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glassmorphism p-6 rounded-xl cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${genre.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-gradient transition-all">
                  {genre.name}
                </h3>
                <p className="text-gray-400">{genre.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GenreShowcase;