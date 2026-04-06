import React from 'react';
import { motion } from 'framer-motion';
import { Music, Users, BookOpen } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const InstrumentCard = ({ name, description, history, technique, artists, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glassmorphism rounded-xl p-6 hover:shadow-2xl hover:scale-105 transition-all"
    >
      <div className="flex items-center mb-4">
        <Music className="h-8 w-8 text-amber-500 mr-3" />
        <h3 className="text-2xl font-bold text-white">{name}</h3>
      </div>

      <p className="text-gray-400 mb-4">{description}</p>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full border-amber-500 text-amber-500 hover:bg-amber-500/10">
            Learn More
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl text-gradient flex items-center">
              <Music className="h-8 w-8 mr-3" />
              {name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <h4 className="font-semibold text-amber-500 mb-2">Description</h4>
              <p>{description}</p>
            </div>
            <div>
              <h4 className="font-semibold text-amber-500 mb-2 flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                History
              </h4>
              <p>{history}</p>
            </div>
            <div>
              <h4 className="font-semibold text-amber-500 mb-2">Playing Technique</h4>
              <p>{technique}</p>
            </div>
            <div>
              <h4 className="font-semibold text-amber-500 mb-2 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Famous Artists
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {artists.map((artist, i) => (
                  <li key={i}>{artist}</li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default InstrumentCard;