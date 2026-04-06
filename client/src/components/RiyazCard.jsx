import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RiyazCard = ({ title, description, duration, difficulty, steps, index }) => {
  const [expanded, setExpanded] = useState(false);

  const difficultyColors = {
    Beginner: 'text-green-500',
    Intermediate: 'text-yellow-500',
    Advanced: 'text-red-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glassmorphism rounded-xl p-6 hover:shadow-2xl hover:scale-105 transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`text-sm font-semibold ${difficultyColors[difficulty]}`}>
          {difficulty}
        </span>
        <div className="flex items-center text-gray-400 text-sm">
          <Clock className="h-4 w-4 mr-1" />
          {duration}
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>

      <Button
        onClick={() => setExpanded(!expanded)}
        variant="outline"
        className="w-full border-amber-500 text-amber-500 hover:bg-amber-500/10"
      >
        {expanded ? (
          <>
            Hide Steps <ChevronUp className="ml-2 h-4 w-4" />
          </>
        ) : (
          <>
            View Steps <ChevronDown className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-white/10"
          >
            <h4 className="font-semibold text-white mb-3">Step-by-Step Instructions:</h4>
            <ol className="space-y-2">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start text-sm text-gray-300">
                  <span className="text-amber-500 mr-2 font-semibold">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RiyazCard;