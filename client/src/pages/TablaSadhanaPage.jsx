import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TablaTipsCard from '@/components/TablaTipsCard';
import TaalCard from '@/components/TaalCard';
import MetronomeSection from '@/components/MetronomeSection';

const TablaSadhanaPage = () => {
  const tablaTips = [
    {
      title: 'Proper Sitting Posture',
      description: 'Learn the correct way to sit and position your tabla',
      steps: [
        'Sit cross-legged with straight back',
        'Place tabla at comfortable height',
        'Keep shoulders relaxed',
        'Position tabla at 45-degree angle'
      ]
    },
    {
      title: 'Basic Strokes (Bols)',
      description: 'Master fundamental tabla strokes',
      steps: [
        'Na - index finger on dayan edge',
        'Tin - index finger on center',
        'Dha - combined stroke',
        'Ge - ring finger on bayan'
      ]
    },
    {
      title: 'Hand Position',
      description: 'Correct hand placement for clear sound',
      steps: [
        'Keep wrists flexible',
        'Fingers slightly curved',
        'Strike with fingertips',
        'Lift fingers quickly after strike'
      ]
    }
  ];

  const taals = [
    {
      name: 'Teental',
      beats: 16,
      thali: [1, 5, 13],
      khali: [9],
      description: 'The most popular taal in Hindustani music',
      composition: 'Dha Dhin Dhin Dha | Dha Dhin Dhin Dha | Dha Tin Tin Ta | Ta Dhin Dhin Dha'
    },
    {
      name: 'Jhaptal',
      beats: 10,
      thali: [1, 3],
      khali: [6],
      description: 'A 10-beat cycle with unique structure',
      composition: 'Dhi Na | Dhi Dhi Na | Ti Na | Dhi Dhi Na'
    },
    {
      name: 'Ektal',
      beats: 12,
      thali: [1, 5, 9],
      khali: [3],
      description: 'A 12-beat taal used in slow compositions',
      composition: 'Dhin Dhin | Dhage Terekete | Tun Na | Kat Ta | Dhage Terekete | Dhin Na'
    },
    {
      name: 'Rupak',
      beats: 7,
      thali: [4],
      khali: [1],
      description: 'A 7-beat taal starting with khali',
      composition: 'Tin Tin Na | Dhin Na | Dhin Na'
    },
    {
      name: 'Dadra',
      beats: 6,
      thali: [1],
      khali: [4],
      description: 'A light 6-beat taal for thumri and bhajans',
      composition: 'Dha Dhin Na | Dha Tin Na'
    },
    {
      name: 'Keherwa',
      beats: 8,
      thali: [1, 5],
      khali: [],
      description: 'Simple 8-beat taal for folk and film music',
      composition: 'Dha Ge Na Ti | Na Ke Dhi Na'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Tabla Sadhana - SurSadhana</title>
        <meta name="description" content="Learn tabla with comprehensive guides on taals, practice techniques, and rhythm patterns." />
      </Helmet>

      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4 text-white">Tabla Sadhana</h1>
            <p className="text-xl text-gray-400">
              Master the rhythm of Hindustani classical music
            </p>
          </motion.div>

          {/* Metronome Section */}
          <MetronomeSection />

          {/* Tabs for Learning and Taals */}
          <Tabs defaultValue="learning" className="mt-12">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-white/5">
              <TabsTrigger value="learning">Learning Tips</TabsTrigger>
              <TabsTrigger value="taals">Taals Library</TabsTrigger>
            </TabsList>

            <TabsContent value="learning">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tablaTips.map((tip, index) => (
                  <TablaTipsCard key={index} {...tip} index={index} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="taals">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {taals.map((taal, index) => (
                  <TaalCard key={taal.name} {...taal} index={index} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default TablaSadhanaPage;