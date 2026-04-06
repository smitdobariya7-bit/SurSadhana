import React from 'react';
import { motion } from 'framer-motion';
import { Music4 } from 'lucide-react';

const TaalCard = ({ name, beats, thali, khali, description, composition, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glassmorphism rounded-xl p-6 hover:shadow-2xl hover:scale-105 transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gradient">{name}</h3>
        <span className="px-3 py-1 bg-amber-500/20 text-amber-500 rounded-full text-sm">
          {beats} Beats
        </span>
      </div>

      <p className="text-gray-400 mb-4">{description}</p>

      <div className="space-y-3 mb-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Thali (Claps)</p>
          <div className="flex gap-2">
            {thali.map(beat => (
              <span key={beat} className="px-2 py-1 bg-green-500/20 text-green-500 rounded text-sm">
                {beat}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Khali (Wave)</p>
          <div className="flex gap-2">
            {khali.length > 0 ? (
              khali.map(beat => (
                <span key={beat} className="px-2 py-1 bg-red-500/20 text-red-500 rounded text-sm">
                  {beat}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">None</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-white/5 rounded-lg">
        <p className="text-sm text-gray-400 mb-2">Composition</p>
        <p className="font-mono text-white text-sm leading-relaxed">{composition}</p>
      </div>
    </motion.div>
  );
};

export default TaalCard;