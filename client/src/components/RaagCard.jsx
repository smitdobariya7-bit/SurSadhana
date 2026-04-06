import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Music, Heart, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const RaagCard = ({ name, thaat, aaroh, avaroh, pakad, mood, time, examples, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="glassmorphism rounded-xl p-6 hover:shadow-2xl hover:scale-105 transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gradient">{name}</h3>
        <span className="px-3 py-1 bg-amber-500/20 text-amber-500 rounded-full text-sm">
          {thaat}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <p className="text-gray-400 text-sm mb-1">Aaroh (Ascending)</p>
          <p className="text-white font-mono">{aaroh}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm mb-1">Avaroh (Descending)</p>
          <p className="text-white font-mono">{avaroh}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm mb-1">Pakad</p>
          <p className="text-white font-mono">{pakad}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-300">
          <Heart className="h-4 w-4 mr-2 text-amber-500" />
          <span>{mood}</span>
        </div>
        <div className="flex items-center text-sm text-gray-300">
          <Clock className="h-4 w-4 mr-2 text-amber-500" />
          <span>{time}</span>
        </div>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full border-amber-500 text-amber-500 hover:bg-amber-500/10">
            <Info className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl text-gradient">{name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <h4 className="font-semibold text-amber-500 mb-2">Thaat</h4>
              <p>{thaat}</p>
            </div>
            <div>
              <h4 className="font-semibold text-amber-500 mb-2">Aaroh (Ascending Scale)</h4>
              <p className="font-mono text-lg">{aaroh}</p>
            </div>
            <div>
              <h4 className="font-semibold text-amber-500 mb-2">Avaroh (Descending Scale)</h4>
              <p className="font-mono text-lg">{avaroh}</p>
            </div>
            <div>
              <h4 className="font-semibold text-amber-500 mb-2">Pakad (Characteristic Phrase)</h4>
              <p className="font-mono text-lg">{pakad}</p>
            </div>
            <div>
              <h4 className="font-semibold text-amber-500 mb-2">Mood/Rasa</h4>
              <p>{mood}</p>
            </div>
            <div>
              <h4 className="font-semibold text-amber-500 mb-2">Time of Singing</h4>
              <p>{time}</p>
            </div>
            <div>
              <h4 className="font-semibold text-amber-500 mb-2">Example Songs/Compositions</h4>
              <ul className="list-disc list-inside space-y-1">
                {examples.map((example, i) => (
                  <li key={i}>{example}</li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default RaagCard;