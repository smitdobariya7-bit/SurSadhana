import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import RaagCard from '@/components/RaagCard';

const RaagLibraryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedThaat, setSelectedThaat] = useState('All');

  const raags = [
    {
      name: 'Bhairav',
      thaat: 'Bhairav',
      aaroh: 'S r G M P d N S',
      avaroh: 'S N d P M G r S',
      pakad: 'r G M P, M G r S',
      mood: 'Devotional, Serious',
      time: 'Morning (6-9 AM)',
      examples: ['Raghupati Raghav Raja Ram', 'Shiva Tandava Stotram']
    },
    {
      name: 'Yaman',
      thaat: 'Kalyan',
      aaroh: 'N R G M# P D N S',
      avaroh: 'S N D P M# G R S',
      pakad: 'N R G R, G M# D N',
      mood: 'Romantic, Devotional',
      time: 'Evening (6-9 PM)',
      examples: ['Piya Bina', 'Ae Malik Tere Bande Hum']
    },
    {
      name: 'Kafi',
      thaat: 'Kafi',
      aaroh: 'S R g M P D n S',
      avaroh: 'S n D P M g R S',
      pakad: 'M P g M R, g R S',
      mood: 'Light, Joyful',
      time: 'Any time',
      examples: ['Vaishnav Jan To', 'Raghupati Raghav']
    },
    {
      name: 'Asavari',
      thaat: 'Asavari',
      aaroh: 'S R g M P d n S',
      avaroh: 'S n d P M g R S',
      pakad: 'M P d n S, n d P M g',
      mood: 'Sad, Longing',
      time: 'Morning (9-12 AM)',
      examples: ['Man Tarpat Hari Darshan Ko Aaj']
    },
    {
      name: 'Bhimpalasi',
      thaat: 'Kafi',
      aaroh: 'S R g M P M D n S',
      avaroh: 'S n D P M g M R S',
      pakad: 'M P g M R, n S R g M',
      mood: 'Devotional, Serious',
      time: 'Afternoon (3-6 PM)',
      examples: ['Thumak Chalat Ramachandra']
    },
    {
      name: 'Darbari Kanada',
      thaat: 'Asavari',
      aaroh: 'S R g M P d n S',
      avaroh: 'S n d P M g R S',
      pakad: 'R g M R, g M P d',
      mood: 'Serious, Deep',
      time: 'Night (9-12 AM)',
      examples: ['Classical compositions']
    },
    {
      name: 'Malkauns',
      thaat: 'Bhairavi',
      aaroh: 'S g M d n S',
      avaroh: 'S n d M g S',
      pakad: 'n S g M d n',
      mood: 'Deep, Meditative',
      time: 'Night (9 PM-12 AM)',
      examples: ['Man Rang Rangaayee']
    },
    {
      name: 'Todi',
      thaat: 'Todi',
      aaroh: 'S r g M# P d N S',
      avaroh: 'S N d P M# g r S',
      pakad: 'g r S, M# g r g M# P',
      mood: 'Longing, Pathos',
      time: 'Late Morning (10 AM-1 PM)',
      examples: ['Classical compositions']
    },
    {
      name: 'Bageshri',
      thaat: 'Kafi',
      aaroh: 'S R M P N S',
      avaroh: 'S N D P M g R S',
      pakad: 'M g R S N, M P N S',
      mood: 'Romantic, Devotional',
      time: 'Night (9 PM-12 AM)',
      examples: ['Ketaki Gulab Juhi']
    },
    {
      name: 'Multani',
      thaat: 'Todi',
      aaroh: 'S r g M# d N S',
      avaroh: 'S N d M# g r S',
      pakad: 'N S r g M# d',
      mood: 'Contemplative',
      time: 'Late Afternoon (4-7 PM)',
      examples: ['Classical compositions']
    },
    {
      name: 'Jaunpuri',
      thaat: 'Asavari',
      aaroh: 'S R g M D n S',
      avaroh: 'S n D M g R S',
      pakad: 'M D n S, g M D n',
      mood: 'Serious, Devotional',
      time: 'Morning',
      examples: ['Bhajans']
    },
    {
      name: 'Marwa',
      thaat: 'Marwa',
      aaroh: 'N r G M# D N S',
      avaroh: 'S N D M# G r S',
      pakad: 'G M# D N, r G',
      mood: 'Intense, Passionate',
      time: 'Evening (5-8 PM)',
      examples: ['Classical compositions']
    }
  ];

  const thaats = ['All', 'Bhairav', 'Kalyan', 'Kafi', 'Asavari', 'Bhairavi', 'Todi', 'Marwa'];

  const filteredRaags = raags.filter(raag => {
    const matchesSearch = raag.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesThaat = selectedThaat === 'All' || raag.thaat === selectedThaat;
    return matchesSearch && matchesThaat;
  });

  return (
    <>
      <Helmet>
        <title>Raag Library - SurSadhana</title>
        <meta name="description" content="Comprehensive library of Hindustani classical raags with detailed information on aaroh, avaroh, pakad, mood, and timing." />
      </Helmet>

      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4 text-white">Raag Library</h1>
            <p className="text-xl text-gray-400">
              Explore the rich world of Hindustani classical raags
            </p>
          </motion.div>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search raags..."
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-gray-500"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {thaats.map(thaat => (
                <button
                  key={thaat}
                  onClick={() => setSelectedThaat(thaat)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedThaat === thaat
                      ? 'gradient-saffron text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {thaat}
                </button>
              ))}
            </div>
          </div>

          {/* Raag Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRaags.map((raag, index) => (
              <RaagCard key={raag.name} {...raag} index={index} />
            ))}
          </div>

          {filteredRaags.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-xl">No raags found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RaagLibraryPage;