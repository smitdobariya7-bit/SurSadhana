import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RiyazCard from '@/components/RiyazCard';

const RiyazGuidePage = () => {
  const beginnerTips = [
    {
      title: 'Humming Practice',
      description: 'Start with simple humming exercises to warm up your vocal cords',
      duration: '10-15 minutes',
      difficulty: 'Beginner',
      steps: [
        'Sit in a comfortable position with straight back',
        'Take deep breaths and relax your throat',
        'Start humming on a comfortable pitch',
        'Gradually increase and decrease the pitch',
        'Focus on smooth transitions'
      ]
    },
    {
      title: 'Aa-kar Practice',
      description: 'Open vowel singing to improve voice quality and breath control',
      duration: '15-20 minutes',
      difficulty: 'Beginner',
      steps: [
        'Begin with sa (shadja) in your comfortable range',
        'Sing "aaaa" with full, open throat',
        'Practice ascending: Sa Re Ga Ma Pa Dha Ni Sa',
        'Practice descending: Sa Ni Dha Pa Ma Ga Re Sa',
        'Maintain steady breath support throughout'
      ]
    },
    {
      title: 'Sa-kar Practice',
      description: 'Foundation exercise for pitch accuracy and voice stability',
      duration: '20 minutes',
      difficulty: 'Beginner',
      steps: [
        'Find your comfortable sa (tonic)',
        'Sing "saaaa" holding the note steady',
        'Practice with tanpura accompaniment',
        'Focus on maintaining pitch without wavering',
        'Gradually increase duration of held notes'
      ]
    }
  ];

  const intermediateTips = [
    {
      title: 'Basic Alankars',
      description: 'Melodic patterns to develop agility and note transitions',
      duration: '30 minutes',
      difficulty: 'Intermediate',
      steps: [
        'Sa Re Ga, Re Ga Ma, Ga Ma Pa (ascending pattern)',
        'Pa Ma Ga, Ma Ga Re, Ga Re Sa (descending pattern)',
        'Practice with different speeds: slow, medium, fast',
        'Maintain rhythmic precision with metronome',
        'Focus on clear note separation'
      ]
    },
    {
      title: 'Alankar Variations',
      description: 'Advanced patterns for mastering swar combinations',
      duration: '30-40 minutes',
      difficulty: 'Intermediate',
      steps: [
        'Sa Re Ga Re, Re Ga Ma Ga, Ga Ma Pa Ma (skipping pattern)',
        'Sa Ga Re Ga, Ma Ga Pa Ga (oscillating pattern)',
        'Practice in different taals (Teental, Ektal)',
        'Gradually increase tempo while maintaining clarity',
        'Apply to different raags'
      ]
    },
    {
      title: 'Straight Alankar',
      description: 'Sequential note practice for building melodic foundation',
      duration: '25 minutes',
      difficulty: 'Intermediate',
      steps: [
        'Sa Re Ga Ma Pa Dha Ni Sa (ascending straight)',
        'Sa Ni Dha Pa Ma Ga Re Sa (descending straight)',
        'Practice slowly with even rhythm',
        'Use tanpura for pitch reference',
        'Focus on smooth transitions between notes'
      ]
    },
    {
      title: 'Oscillating Alankar',
      description: 'Back-and-forth patterns for developing flexibility',
      duration: '30 minutes',
      difficulty: 'Intermediate',
      steps: [
        'Sa Ga Re Ga Ma Ga Pa Ga Dha Ga Ni Ga Sa Ga',
        'Start slow and gradually increase speed',
        'Maintain steady breath support',
        'Practice with different starting notes',
        'Focus on quick, precise oscillations'
      ]
    },
    {
      title: 'Skipping Alankar',
      description: 'Patterns with note skips for agility training',
      duration: '35 minutes',
      difficulty: 'Intermediate',
      steps: [
        'Sa Re Ga Re, Re Ga Ma Ga, Ga Ma Pa Ma',
        'Pa Ma Ga Ma, Ma Ga Re Ga, Ga Re Sa Re',
        'Practice ascending and descending',
        'Use metronome for rhythmic accuracy',
        'Work on smooth leaps between notes'
      ]
    },
    {
      title: 'Reverse Alankar',
      description: 'Backward patterns for reverse thinking and control',
      duration: '30 minutes',
      difficulty: 'Intermediate',
      steps: [
        'Sa Ni Dha Ni, Ni Dha Pa Dha, Dha Pa Ma Pa',
        'Ma Pa Ga Pa, Pa Ga Re Ga, Ga Re Sa Re',
        'Practice slowly to master backward movement',
        'Focus on maintaining pitch accuracy',
        'Combine with forward patterns for contrast'
      ]
    },
    {
      title: 'Zigzag Alankar',
      description: 'Alternating high-low patterns for range development',
      duration: '35 minutes',
      difficulty: 'Intermediate',
      steps: [
        'Sa Ma Ga Pa Re Dha Ma Ni Ga Pa Re',
        'Start with comfortable octave',
        'Practice with steady rhythm',
        'Focus on quick direction changes',
        'Expand range gradually as comfortable'
      ]
    },
    {
      title: 'Triplet Alankar',
      description: 'Three-note groupings for rhythmic complexity',
      duration: '40 minutes',
      difficulty: 'Intermediate',
      steps: [
        'Sa-Re-Ga, Re-Ga-Ma, Ga-Ma-Pa, Ma-Pa-Dha, Pa-Dha-Ni, Dha-Ni-Sa',
        'Ni-Dha-Pa, Dha-Pa-Ma, Pa-Ma-Ga, Ma-Ga-Re, Ga-Re-Sa',
        'Practice in triplets rhythm',
        'Maintain even spacing between notes',
        'Use metronome set to triplet subdivision'
      ]
    },
    {
      title: 'Mirror Alankar',
      description: 'Symmetric patterns for balanced development',
      duration: '30 minutes',
      difficulty: 'Intermediate',
      steps: [
        'Sa Re Ga Ma Ga Re Sa',
        'Sa Ga Ma Pa Ma Ga Sa',
        'Practice ascending and descending mirrors',
        'Focus on symmetry and balance',
        'Apply to different raag scales'
      ]
    },
    {
      title: 'Wave Alankar',
      description: 'Flowing patterns that create melodic waves',
      duration: '35 minutes',
      difficulty: 'Intermediate',
      steps: [
        'Sa Ga Ma Pa Dha Pa Ma Ga Sa',
        'Sa Re Ga Ma Pa Ma Ga Re Sa',
        'Practice with smooth, connected singing',
        'Focus on creating wave-like motion',
        'Experiment with different note combinations'
      ]
    }
  ];

  const advancedTips = [
    {
      title: 'Taan Practice',
      description: 'Fast melodic runs and improvisational techniques',
      duration: '40-50 minutes',
      difficulty: 'Advanced',
      steps: [
        'Master alapti (slow taan) before sapaat (straight taan)',
        'Practice various taan types: soot, kharvaa, gamak',
        'Develop breath control for long passages',
        'Incorporate taans into raag development',
        'Study taan patterns from established artists'
      ]
    },
    {
      title: 'Raag Development',
      description: 'Complete presentation of raag with aalap, vistar, and taans',
      duration: '60+ minutes',
      difficulty: 'Advanced',
      steps: [
        'Begin with slow aalap establishing raag character',
        'Gradually introduce all notes of the raag',
        'Develop vistar (elaboration) in medium tempo',
        'Incorporate complex patterns and ornamentations',
        'Practice different bandishes in the raag',
        'End with drut composition and taans'
      ]
    },
    {
      title: 'Improvisation Techniques',
      description: 'Creative exploration and spontaneous composition',
      duration: '45 minutes',
      difficulty: 'Advanced',
      steps: [
        'Study traditional raag structures deeply',
        'Practice spontaneous note combinations',
        'Develop personal style while respecting raag rules',
        'Record and analyze your improvisations',
        'Learn from criticism and refine technique'
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Riyaz Guide - SurSadhana</title>
        <meta name="description" content="Comprehensive riyaz practice guide for beginners, intermediate, and advanced learners of Hindustani classical music." />
      </Helmet>

      <div className="min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4 text-white">Riyaz Guide</h1>
            <p className="text-xl text-gray-400">
              Structured practice routines for every level
            </p>
          </motion.div>


          <Tabs defaultValue="beginner" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 bg-white/5">
              <TabsTrigger value="beginner">Beginner</TabsTrigger>
              <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="beginner">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {beginnerTips.map((tip, index) => (
                  <RiyazCard key={index} {...tip} index={index} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="intermediate">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {intermediateTips.map((tip, index) => (
                  <RiyazCard key={index} {...tip} index={index} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="advanced">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advancedTips.map((tip, index) => (
                  <RiyazCard key={index} {...tip} index={index} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Practice Tips */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 glassmorphism p-8 rounded-2xl"
          >
            <h2 className="text-3xl font-bold mb-6 text-gradient">Daily Practice Guidelines</h2>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start">
                <span className="text-amber-500 mr-3">•</span>
                <span>Practice at the same time daily, preferably early morning</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-3">•</span>
                <span>Start with at least 30 minutes and gradually increase duration</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-3">•</span>
                <span>Always use tanpura or shruti box for pitch reference</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-3">•</span>
                <span>Record your practice sessions to track improvement</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-3">•</span>
                <span>Focus on quality over quantity - deliberate practice is key</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-3">•</span>
                <span>Take breaks to avoid vocal strain and fatigue</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>



    </>

    
  );
};

export default RiyazGuidePage;
