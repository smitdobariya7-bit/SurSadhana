import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import InstrumentCard from '@/components/InstrumentCard';

const InstrumentsPage = () => {
  const instruments = [
    {
      name: 'Sitar',
      description: 'A plucked string instrument with a long neck and resonating gourd, central to Hindustani classical music.',
      history: 'Originated in the 13th century, popularized by maestros like Ravi Shankar.',
      technique: 'Played with a mizrab (plectrum), features sympathetic strings and meend (bending notes).',
      artists: ['Pt. Ravi Shankar', 'Pt. Nikhil Banerjee', 'Ustad Vilayat Khan']
    },
    {
      name: 'Tabla',
      description: 'A pair of hand drums - dayan (right) and bayan (left) - fundamental to North Indian rhythm.',
      history: 'Evolved in the 18th century, attributed to Amir Khusrau.',
      technique: 'Complex finger techniques including na, tin, dha, ge, producing varied tones.',
      artists: ['Zakir Hussain', 'Pt. Kumar Bose', 'Ustad Alla Rakha']
    },
    {
      name: 'Harmonium',
      description: 'A keyboard instrument with bellows, widely used in devotional and classical music.',
      history: 'Introduced to India in the 19th century by European missionaries.',
      technique: 'Played with one hand on keys, other hand pumping the bellows.',
      artists: ['Pt. Tulsidas Borkar', 'Pt. Appa Jalgaonkar']
    },
    {
      name: 'Bansuri',
      description: 'A bamboo flute, one of the oldest instruments in Indian classical music.',
      history: 'Ancient origins dating back thousands of years, associated with Lord Krishna.',
      technique: 'Requires precise breath control and finger positioning for various notes.',
      artists: ['Pt. Hariprasad Chaurasia', 'Pt. Pannalal Ghosh']
    },
    {
      name: 'Sarangi',
      description: 'A bowed string instrument with a haunting, vocal-like quality.',
      history: 'Traditional instrument used to accompany vocal performances.',
      technique: 'Played with a bow, features sympathetic strings for rich resonance.',
      artists: ['Ustad Sultan Khan', 'Pt. Ram Narayan']
    },
    {
      name: 'Tanpura',
      description: 'A drone instrument providing the tonal foundation for Indian classical music.',
      history: 'Essential accompanying instrument for vocal and instrumental performances.',
      technique: 'Four or five strings tuned to create a continuous harmonic drone.',
      artists: ['Used by all classical musicians']
    }
  ];

  return (
    <>
      <Helmet>
        <title>Instruments - SurSadhana</title>
        <meta name="description" content="Explore Indian classical instruments including sitar, tabla, harmonium, bansuri, and more. Learn about their history, technique, and famous artists." />
      </Helmet>

      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4 text-white">Indian Classical Instruments</h1>
            <p className="text-xl text-gray-400">
              Discover the rich tapestry of sounds in Hindustani music
            </p>
          </motion.div>

          {/* Instrument Cards */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8 text-white">Instrument Gallery</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instruments.map((instrument, index) => (
                <InstrumentCard key={instrument.name} {...instrument} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstrumentsPage;
