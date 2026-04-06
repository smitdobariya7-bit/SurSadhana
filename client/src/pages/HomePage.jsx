import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import GenreShowcase from '@/components/GenreShowcase';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>SurSadhana - Your Digital Music Guru</title>
        <meta name="description" content="Master Hindustani classical music with SurSadhana. Learn raags, practice riyaz, and explore instruments with authentic guidance." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
         <div
    className="absolute inset-0 z-0 bg-black/40 bg-cover bg-center"
    style={{
      backgroundImage:
        "url(https://tfipost.com/wp-content/uploads/2023/07/Indian-Music-composers-.jpg)",
    }}
  />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0f0f0f]"></div>
        {/* </div> */}

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="text-white">SurSadhana</span>
            <br />
            <span className="text-gradient">Your Digital Music Guru</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Master the timeless art of Hindustani classical music with comprehensive resources and personalized practice tools.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/signup">
              <Button size="lg" className="gradient-saffron text-lg px-8 py-6 group">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/riyaz-guide">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-amber-500 text-amber-500 hover:bg-amber-500">
                Explore Riyaz Guide
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-amber-500 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-amber-500 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">The Ancient Art of Hindustani Music</h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-4">
              Hindustani classical music is a profound tradition that has evolved over centuries, rooted in the rich cultural heritage of North India. It is a journey of exploring melodic raags, rhythmic taals, and the spiritual connection between sound and soul.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              SurSadhana bridges the gap between tradition and technology, offering you a comprehensive platform to learn, practice, and master this beautiful art form with the guidance of AI and authentic resources.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Genre Showcase */}
      <GenreShowcase />

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-radial">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12 text-white"
          >
            Why Choose SurSadhana?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Comprehensive Library',
                description: 'Access extensive resources on raags, taals, instruments, and techniques with detailed explanations and examples.',
              },
              {
                title: 'Practice Tools',
                description: 'Track your progress, record your practice sessions, and get practical feedback to improve faster.',
              },
              {
                title: 'Expert Guidance',
                description: 'Learn with structured support, authentic musical knowledge, and guided resources tailored for steady improvement.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glassmorphism p-8 rounded-2xl hover:scale-105 transition-transform"
              >
                <h3 className="text-2xl font-bold mb-4 text-gradient">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glassmorphism p-12 rounded-3xl text-center"
        >
          <h2 className="text-4xl font-bold mb-6 text-white">Ready to Begin Your Musical Journey?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of music enthusiasts learning Hindustani classical music with SurSadhana.
          </p>
          <Link to="/signup">
            <Button size="lg" className="gradient-saffron text-lg px-12 py-6">
              Get Started Free
            </Button>
          </Link>
        </motion.div>
      </section>
    </>
  );
};

export default HomePage;
