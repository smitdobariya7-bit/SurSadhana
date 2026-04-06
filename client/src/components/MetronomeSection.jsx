import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';

const MetronomeSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(60);
  const [volume, setVolume] = useState(70);
  const { toast } = useToast();

  const handlePlayPause = () => {
    toast({
      title: '🚧 Audio Feature Coming Soon',
      description: "Metronome will be implemented with Web Audio API. You can request this feature in your next prompt! 🚀",
    });
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="glassmorphism p-8 rounded-2xl"
    >
      <h2 className="text-3xl font-bold mb-6 text-gradient">Digital Metronome</h2>
      <p className="text-gray-400 mb-8">
        Practice with precision using our digital metronome
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Tempo: {tempo} BPM
            </label>
            <Slider
              value={[tempo]}
              onValueChange={(value) => setTempo(value[0])}
              min={40}
              max={200}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Vilambit</span>
              <span>Madhya</span>
              <span>Drut</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center">
              <Volume2 className="h-4 w-4 mr-2" />
              Volume: {volume}%
            </label>
            <Slider
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <Button
            onClick={handlePlayPause}
            size="lg"
            className="w-full gradient-saffron"
          >
            {isPlaying ? (
              <>
                <Pause className="h-5 w-5 mr-2" />
                Stop Metronome
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Start Metronome
              </>
            )}
          </Button>
        </div>

        {/* Visual Beat Indicator */}
        <div className="flex items-center justify-center">
          <div className="relative w-64 h-64">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className={`absolute inset-0 rounded-full border-4 ${
                  i === 0 ? 'border-amber-500' : 'border-yellow-500/30'
                }`}
                animate={isPlaying ? {
                  scale: [1, 1.2, 1],
                  opacity: [1, 0, 1],
                } : {}}
                transition={{
                  duration: 60 / tempo,
                  repeat: Infinity,
                  delay: i * (60 / tempo / 4),
                }}
              />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold text-gradient mb-2">{tempo}</div>
                <div className="text-sm text-gray-400">BPM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MetronomeSection;