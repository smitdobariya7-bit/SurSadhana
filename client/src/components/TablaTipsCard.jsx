import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const TablaTipsCard = ({ title, description, steps, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glassmorphism rounded-xl p-6 hover:shadow-2xl hover:scale-105 transition-all"
    >
      <h3 className="text-2xl font-bold mb-2 text-gradient">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>

      <div className="space-y-2">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start text-sm text-gray-300">
            <CheckCircle className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
            <span>{step}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TablaTipsCard;