import React, { createContext, useContext, useState, useRef } from 'react';

const AudioContext = createContext();

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const newRecording = {
          id: Date.now().toString(),
          url: audioUrl,
          blob: audioBlob,
          timestamp: new Date().toISOString(),
          duration: 0 // Will be calculated on playback
        };
        
        setRecordings(prev => [newRecording, ...prev]);
        
        // Store metadata in localStorage
        const metadata = recordings.map(r => ({
          id: r.id,
          timestamp: r.timestamp,
          duration: r.duration
        }));
        localStorage.setItem('sursadhana_recordings', JSON.stringify(metadata));
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const deleteRecording = (id) => {
    setRecordings(prev => prev.filter(r => r.id !== id));
    const metadata = recordings.filter(r => r.id !== id).map(r => ({
      id: r.id,
      timestamp: r.timestamp,
      duration: r.duration
    }));
    localStorage.setItem('sursadhana_recordings', JSON.stringify(metadata));
  };

  const value = {
    isRecording,
    recordings,
    startRecording,
    stopRecording,
    deleteRecording
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};