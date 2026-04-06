import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Target, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const PracticeTaskCard = ({ task, index, onUpdate, onDelete }) => {
  const categoryColors = {
    Riyaz: 'from-blue-500 to-cyan-500',
    Raag: 'from-purple-500 to-pink-500',
    Tabla: 'from-green-500 to-emerald-500',
    Instrument: 'from-orange-500 to-red-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="glassmorphism rounded-xl p-6 hover:shadow-2xl transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${categoryColors[task.category]} text-white`}>
          {task.category}
        </span>
        <button
          onClick={() => onDelete(task.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{task.name}</h3>
      <p className="text-gray-400 text-sm mb-4">{task.description}</p>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-300">
          <Clock className="h-4 w-4 mr-2 text-amber-500" />
          <span>{task.targetDuration} minutes</span>
        </div>
        <div className="flex items-center text-sm text-gray-300">
          <Target className="h-4 w-4 mr-2 text-amber-500" />
          <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm text-amber-500 font-semibold">{task.progress}%</span>
        </div>
        <Slider
          value={[task.progress]}
          onValueChange={(value) => onUpdate(task.id, { progress: value[0] })}
          max={100}
          step={5}
          className="w-full"
        />
      </div>

      <Button
        onClick={() => onUpdate(task.id, { status: task.status === 'active' ? 'completed' : 'active', progress: 100 })}
        variant="outline"
        className={`w-full ${
          task.status === 'completed'
            ? 'border-green-500 text-green-500 hover:bg-green-500/10'
            : 'border-amber-500 text-amber-500 hover:bg-amber-500/10'
        }`}
      >
        {task.status === 'completed' ? (
          <>
            <CheckCircle className="h-4 w-4 mr-2" />
            Completed
          </>
        ) : (
          'Mark as Complete'
        )}
      </Button>
    </motion.div>
  );
};

export default PracticeTaskCard;