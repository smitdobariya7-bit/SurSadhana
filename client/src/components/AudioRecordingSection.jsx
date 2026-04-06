import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, Trash2, Upload, Sparkles } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const AI_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : 'http://localhost:5000';

const AudioRecordingSection = () => {
  const { isRecording, recordings, startRecording, stopRecording, deleteRecording } = useAudio();
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedRecordingId, setSelectedRecordingId] = useState('');
  const [question, setQuestion] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const selectedRecording = useMemo(
    () => recordings.find((r) => r.id === selectedRecordingId) || null,
    [recordings, selectedRecordingId]
  );

  const normalizeList = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string' && value.trim()) {
      return value
        .split('\n')
        .map((item) => item.replace(/^[-*]\s*/, '').trim())
        .filter(Boolean);
    }
    return [];
  };

  const toBase64 = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result || '').toString());
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  const analyzeSelectedAudio = async () => {
    let audioBlob = null;
    let filename = '';
    let mimeType = '';

    if (selectedRecording) {
      audioBlob = selectedRecording.blob || null;
      filename = `recording-${selectedRecording.id}.webm`;
      mimeType = audioBlob?.type || 'audio/webm';
    } else if (uploadedFile) {
      audioBlob = uploadedFile;
      filename = uploadedFile.name || `upload-${Date.now()}.webm`;
      mimeType = uploadedFile.type || 'audio/webm';
    }

    if (!audioBlob) {
      toast({
        title: 'No audio selected',
        description: 'Upload an audio file or choose a recording first.',
        variant: 'destructive'
      });
      return;
    }

    try {
      setAnalyzing(true);
      const audioBase64 = await toBase64(audioBlob);
      const res = await fetch(`${AI_BASE_URL}/api/ai/audio/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64,
          mimeType,
          filename,
          question: question.trim(),
          context: 'Practice page upload'
        })
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }
      if (!res.ok) {
        const shortMessage = typeof data?.error === 'string'
          ? data.error
          : 'Failed to analyze audio';
        throw new Error(shortMessage);
      }

      setAnalysis({
        ...data,
        strengths: normalizeList(data?.strengths),
        improvements: normalizeList(data?.improvements),
        practice_plan: normalizeList(data?.practice_plan)
      });
      toast({
        title: 'Analysis complete',
        description: 'AI Guru analyzed your audio and prepared feedback.'
      });
    } catch (error) {
      console.error('Audio analysis failed:', error);
      const networkError = error?.message === 'Failed to fetch';
      toast({
        title: 'Analysis failed',
        description: networkError
          ? 'Backend se connection nahi ho paaya. Server chal raha hai ya nahi check karo.'
          : (error.message || 'Could not analyze this audio.'),
        variant: 'destructive'
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStartRecording = async () => {
    try {
      await startRecording();
      toast({
        title: 'Recording started',
        description: 'Your practice session is being recorded.',
      });
    } catch (error) {
      toast({
        title: 'Recording failed',
        description: 'Could not access microphone. Please check permissions.',
        variant: 'destructive',
      });
    }
  };

  const handleStopRecording = () => {
    stopRecording();
    toast({
      title: 'Recording saved',
      description: 'Your latest recording is auto-selected for AI analysis.',
    });
  };

  useEffect(() => {
    if (recordings.length > 0 && !uploadedFile) {
      setSelectedRecordingId(recordings[0].id);
    }
  }, [recordings, uploadedFile]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="glassmorphism p-8 rounded-2xl mt-12"
    >
      <h2 className="text-2xl font-bold text-white mb-2">Practice Recording + AI Review</h2>
      <p className="text-gray-400 mb-6">Record or upload your audio, then ask AI Guru for detailed feedback.</p>

      <div className="flex items-center gap-4 mb-8">
        {!isRecording ? (
          <Button
            onClick={handleStartRecording}
            size="lg"
            className="gradient-saffron"
          >
            <Mic className="h-5 w-5 mr-2" />
            Start Recording
          </Button>
        ) : (
          <Button
            onClick={handleStopRecording}
            size="lg"
            variant="destructive"
          >
            <Square className="h-5 w-5 mr-2" />
            Stop Recording
          </Button>
        )}

        {isRecording && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-gray-400">Recording...</span>
          </div>
        )}
      </div>

      <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/10">
        <label className="block text-sm text-gray-300 mb-3">Upload Audio File</label>
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/15 transition">
            <Upload className="h-4 w-4" />
            Choose Audio
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setUploadedFile(file);
                if (file) {
                  setSelectedRecordingId('');
                }
              }}
            />
          </label>
          <span className="text-sm text-gray-400">
            {uploadedFile ? uploadedFile.name : 'No file selected'}
          </span>
        </div>
      </div>

      {/* Recordings List */}
      {recordings.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Your Recordings (Select One)</h3>
          <div className="space-y-3">
            {recordings.map((recording) => (
              <div
                key={recording.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  selectedRecordingId === recording.id ? 'bg-amber-400/10 border-amber-400/40' : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <audio controls src={recording.url} className="max-w-sm">
                    Your browser does not support the audio element.
                  </audio>
                  <span className="text-sm text-gray-400">
                    {new Date(recording.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-white/20 text-white"
                    onClick={() => {
                      setSelectedRecordingId(recording.id);
                      setUploadedFile(null);
                    }}
                  >
                    {selectedRecordingId === recording.id ? 'Selected' : 'Select'}
                  </Button>
                  <button
                    onClick={() => deleteRecording(recording.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
        <p className="text-xs text-amber-300 mb-2">
          Current source: {selectedRecording ? 'Latest recorded audio' : uploadedFile ? 'Uploaded file' : 'None'}
        </p>
        <label className="block text-sm text-gray-300 mb-2">Ask AI Guru about this audio (optional)</label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          placeholder="Example: Mere sur aur rhythm me kya improve karna chahiye?"
          className="w-full p-3 rounded-lg bg-[#0b0d14] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        />
        <div className="mt-4">
          <Button onClick={analyzeSelectedAudio} disabled={analyzing} className="gradient-saffron">
            <Sparkles className="h-4 w-4 mr-2" />
            {analyzing ? 'Analyzing...' : 'Analyze with AI Guru'}
          </Button>
        </div>
      </div>

      {analysis && (
        <div className="mt-8 p-5 rounded-xl bg-[#0c111b] border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">AI Guru Feedback</h3>

          <div className="space-y-4 text-gray-200">
            <div>
              <h4 className="text-sm uppercase tracking-wide text-amber-300 mb-1">Detected Content</h4>
              <p className="text-sm">{analysis.detected_content || 'N/A'}</p>
            </div>

            <div>
              <h4 className="text-sm uppercase tracking-wide text-amber-300 mb-1">Summary</h4>
              <p className="text-sm whitespace-pre-wrap">{analysis.summary || 'N/A'}</p>
            </div>

            <div>
              <h4 className="text-sm uppercase tracking-wide text-amber-300 mb-1">Strengths</h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {(analysis.strengths || []).map((item, idx) => <li key={`s-${idx}`}>{item}</li>)}
              </ul>
            </div>

            <div>
              <h4 className="text-sm uppercase tracking-wide text-amber-300 mb-1">Improvements</h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {(analysis.improvements || []).map((item, idx) => <li key={`i-${idx}`}>{item}</li>)}
              </ul>
            </div>

            <div>
              <h4 className="text-sm uppercase tracking-wide text-amber-300 mb-1">Practice Plan</h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {(analysis.practice_plan || []).map((item, idx) => <li key={`p-${idx}`}>{item}</li>)}
              </ul>
            </div>

            {analysis.answer_to_question && (
              <div>
                <h4 className="text-sm uppercase tracking-wide text-amber-300 mb-1">Answer to Your Question</h4>
                <p className="text-sm whitespace-pre-wrap">{analysis.answer_to_question}</p>
              </div>
            )}

            <details className="mt-2">
              <summary className="cursor-pointer text-sm text-gray-400">Show transcript</summary>
              <p className="mt-2 text-sm whitespace-pre-wrap text-gray-300">{analysis.transcript || 'No transcript available.'}</p>
            </details>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AudioRecordingSection;
