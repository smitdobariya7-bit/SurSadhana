import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';

const TanpuraPracticeSection = ({ onPracticeTick, totalPracticeSeconds = 0 }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [scale, setScale] = useState('C');
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const practiceTimerRef = useRef(null);
  const [tempo, setTempo] = useState(60);
  const [volume, setVolume] = useState(70);
  const { toast } = useToast();

  const scales = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  // explicit filename mapping: scale names to actual filenames
  const explicitFiles = {
    'C': 'C.mp3',
    'C#': 'C1.mp3',
    'D': 'D.mp3',
    'D#': 'D1.mp3',
    'E': 'E.mp3',
    'F': 'F.mp3',
    'F#': 'F1.mp3',
    'G': 'G.mp3',
    'G#': 'G1.mp3',
    'A': 'A.mp3',
    'A#': 'A1.mp3',
    'B': 'B.mp3',
  };


const handlePlayPause = () => {
  if (!isPlaying) {
    // If audio exists for current scale, resume it instead of creating new
    if (audioRef.current && audioRef.current.src && audioRef.current.src.includes(`/${explicitFiles[scale]}`)) {
      audioRef.current.play().then(() => {
        if (practiceTimerRef.current) clearInterval(practiceTimerRef.current);
        practiceTimerRef.current = setInterval(() => onPracticeTick?.(1), 1000);
      }).catch(() => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
    } else {
      setIsPlaying(true);
      createAndPlay(scale);
    }
  } else {
    if (audioRef.current) audioRef.current.pause();
    if (practiceTimerRef.current) {
      clearInterval(practiceTimerRef.current);
      practiceTimerRef.current = null;
    }
    setIsPlaying(false);
  }
};

const handleScaleChange = (newScale) => {
  setScale(newScale);
  
  if (audioRef.current) {
    audioRef.current.pause();
    if (practiceTimerRef.current) {
      clearInterval(practiceTimerRef.current);
      practiceTimerRef.current = null;
    }
  }
  
  setIsPlaying(true);
  createAndPlay(newScale);
};

// sync audio properties when controls change
useEffect(() => {
  if (audioRef.current) {
    audioRef.current.volume = volume / 100;
    audioRef.current.playbackRate = tempo / 60;
  }
}, [volume, tempo]);

// cleanup on unmount
useEffect(() => {
  return () => {
    if (practiceTimerRef.current) {
      clearInterval(practiceTimerRef.current);
      practiceTimerRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };
}, []);

// helpers: create, play, stop with logging and error handling
const createAndPlay = (whichScale) => {
  // try to unlock/resume AudioContext on first user gesture
  try {
    if (!audioContextRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) {
        audioContextRef.current = new Ctx();
        audioContextRef.current.resume().catch(() => {});
      }
    }
  } catch (e) {}

  const fileName = explicitFiles[whichScale];
  if (!fileName) {
    console.error('Tanpura: no mapping found for scale', whichScale);
    toast({ title: 'Scale not found', description: `No tanpura file found for ${whichScale}` });
    setIsPlaying(false);
    return;
  }

  const url = `/tanpura/${fileName}`;

  if (audioRef.current) {
    audioRef.current.pause();
  }

  const audio = new Audio(url);
  audio.loop = true;
  audio.volume = volume / 100;
  audio.playbackRate = tempo / 60;

  const onError = (e) => {
    console.error('Tanpura audio error for', url, e);
    toast({ title: 'Audio load error', description: `Failed to load ${whichScale}` });
    setIsPlaying(false);
  };

  audio.addEventListener('error', onError);
  audioRef.current = audio;

  const playPromise = audio.play();
  if (playPromise && typeof playPromise.then === 'function') {
    playPromise.then(() => {
      if (practiceTimerRef.current) {
        clearInterval(practiceTimerRef.current);
      }
      practiceTimerRef.current = setInterval(() => {
        onPracticeTick?.(1);
      }, 1000);
    }).catch((err) => {
      console.warn('Tanpura play() rejected', err);
      setIsPlaying(false);
      toast({ title: 'Playback blocked', description: 'User interaction may be required to start audio.' });
    });
  } else {
    if (practiceTimerRef.current) {
      clearInterval(practiceTimerRef.current);
    }
    practiceTimerRef.current = setInterval(() => {
      onPracticeTick?.(1);
    }, 1000);
  }
};

const stopAudio = () => {
  if (practiceTimerRef.current) {
    clearInterval(practiceTimerRef.current);
    practiceTimerRef.current = null;
  }
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current = null;
  }
  setIsPlaying(false);
};

// Spacebar toggles play/pause
useEffect(() => {
  const onKey = (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      handlePlayPause();
    }
  };
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
}, [isPlaying, scale]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="glassmorphism p-8 rounded-2xl mb-12"
    >
      <div className="flex items-center justify-center mb-6">
        <Music2 className="h-10 w-10 text-amber-500 mr-3" />
        <span className="text-2xl font-bold text-gradient">Sur Sadhana</span>
      </div>
      <h2 className="text-3xl font-bold mb-6 text-gradient">Tanpura Practice Tool</h2>
      <p className="text-gray-400 mb-8">
        Practice with a virtual tanpura drone to develop perfect pitch and intonation
      </p>
      <p className="text-sm text-amber-400 mb-8">
        Total tanpura practice: {Math.floor(totalPracticeSeconds / 60)}m {totalPracticeSeconds % 60}s
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Scale Selection
            </label>
            <div className="grid grid-cols-6 gap-2">
              {scales.map(s => (
                <button
                  key={s}
                  type="button"
                  // onClick={() => setScale(s)}
                  onClick={() => handleScaleChange(s)}
                  className={`p-2 rounded-lg transition-all ${
                    scale === s
                      ? 'gradient-saffron text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                  aria-pressed={scale === s}
                  aria-label={`Select scale ${s}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Tempo: {tempo} BPM
            </label>
            <Slider
              value={[tempo]}
              onValueChange={(value) => setTempo(value[0])}
              min={40}
              max={120}
              step={1}
              className="w-full"
            />
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
        </div>

        {/* Visualization */}
        <div className="flex items-center justify-center">
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 animate-pulse"></div>
            <div className="absolute inset-4 rounded-full bg-gradient-to-r from-amber-500/30 to-yellow-500/30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute inset-8 rounded-full bg-gradient-to-r from-amber-500/40 to-yellow-500/40 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                onClick={handlePlayPause}
                
                type="button"
                size="lg"
                className="w-20 h-20 rounded-full gradient-saffron"
                aria-label={isPlaying ? 'Pause tanpura' : 'Play tanpura'}
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8 ml-1" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TanpuraPracticeSection;
