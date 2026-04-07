import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import { getApiBaseUrl } from '@/lib/apiBaseUrl';

const AI_BASE_URL = getApiBaseUrl();

const AITrainerPage = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]); // { role, content, createdAt, meta? }
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const quickPrompts = useMemo(
    () => [
      'Raag Yaman beginner practice plan',
      'Voice warmup for 15 minutes',
      'How to improve sur accuracy daily',
      'Basic alaap structure for evening practice'
    ],
    []
  );

  const handleSend = async () => {
    const question = input.trim();
    if (!question) return;

    const userMsg = { role: 'user', content: question, createdAt: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${AI_BASE_URL}/api/ai/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || 'Request failed');
      }

      const data = await res.json();
      const assistantContent = data.answer || data.reply || 'No answer returned.';
      const assistantMeta = {
        related_raag: data.related_raag || '',
        practice_tip: data.practice_tip || '',
        difficulty_level: data.difficulty_level || ''
      };

      const assistantMsg = {
        role: 'assistant',
        content: assistantContent,
        createdAt: Date.now(),
        meta: assistantMeta
      };

      setMessages((m) => [...m, assistantMsg]);
    } catch (error) {
      console.error('AI query failed', error);
      toast({ title: 'AI request failed', description: error.message || 'Unknown error', variant: 'destructive' });
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: 'Error: could not get response from AI.', createdAt: Date.now() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Guru - SurSadhana</title>
      </Helmet>

      <div className="min-h-screen py-10 px-4 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.12),_transparent_45%),linear-gradient(to_bottom,_#08090d,_#06070a)]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <p className="uppercase tracking-[0.18em] text-[11px] text-amber-300/90 mb-2">SurSadhana Assistant</p>
            <h1 className="text-4xl font-bold text-white">AI Guru</h1>
            <p className="text-gray-300 mt-2 text-base">
              Clear, practical guidance for raags, riyaz routines, and vocal growth.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0d0f14]/90 shadow-[0_24px_80px_rgba(0,0,0,0.45)] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[78vh]">
              <div className="lg:col-span-9 p-6 md:p-7 flex flex-col border-r border-white/10 h-[78vh]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white font-semibold text-lg">Conversation</h2>
                  <span className="text-xs text-gray-400">Auto-scroll disabled</span>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 pb-2">
                  {messages.length === 0 && (
                    <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-7 text-center text-gray-300">
                      Start the conversation - ask anything about raag practice, swar control, voice stability, or theory.
                    </div>
                  )}

                  {messages.map((m, i) => (
                    <div key={`${m.createdAt || i}-${i}`} className={`mb-4 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`${
                          m.role === 'user'
                            ? 'bg-amber-400 text-black'
                            : 'bg-[#121826] text-gray-100 border border-white/10'
                        } max-w-[92%] p-4 rounded-xl`}
                      >
                        <div className="text-[11px] uppercase tracking-wide mb-2 opacity-70">
                          {m.role === 'user' ? 'You' : 'AI Guru'}
                        </div>
                        <div className="whitespace-pre-wrap leading-7 text-[15px]">{m.content}</div>

                        {m.meta && (
                          <div className="mt-3 text-sm text-gray-300 bg-black/20 rounded-lg p-3">
                            {m.meta.related_raag && <div><strong>Raag:</strong> {m.meta.related_raag}</div>}
                            {m.meta.practice_tip && <div><strong>Practice Tip:</strong> {m.meta.practice_tip}</div>}
                            {m.meta.difficulty_level && <div><strong>Difficulty:</strong> {m.meta.difficulty_level}</div>}
                          </div>
                        )}

                        <div className="mt-2 text-[11px] opacity-60">
                          {new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 border-t border-white/10 pt-4 sticky bottom-0 bg-[#0d0f14]/95 backdrop-blur-sm">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={3}
                    placeholder="Type your question... (Shift+Enter for newline)"
                    className="w-full p-4 bg-[#0a0d14] border border-white/15 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  />

                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-400">
                      Tip: Ask for step-by-step riyaz plans and measurable daily targets.
                    </div>
                    <div className="flex items-center gap-2">
                      {loading && <div className="text-sm text-gray-300">Thinking...</div>}
                      <Button className="gradient-saffron px-6" onClick={handleSend} disabled={loading || !input.trim()}>
                        {loading ? 'Sending...' : 'Send'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="lg:col-span-2 p-6 md:p-7 bg-[#0a0c12]">
                <h3 className="text-lg font-semibold text-white mb-2">Quick Prompts</h3>
                <p className="text-sm text-gray-400 mb-4">Tap to fill the input quickly.</p>

                <div className="space-y-2 mb-7">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => setInput(prompt)}
                      className="w-full text-left text-sm rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] px-3 py-2 text-gray-200 transition"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                <h4 className="text-base font-semibold text-white mb-2">Recent Messages</h4>
                <ul className="space-y-3 max-h-[36vh] overflow-auto pr-1">
                  {messages.slice().reverse().map((m, i) => (
                    <li key={`side-${m.createdAt || i}-${i}`} className="text-sm text-gray-300 border-b border-white/5 pb-2">
                      <strong className="block text-xs text-gray-400 mb-1">{m.role === 'user' ? 'You' : 'AI Guru'}</strong>
                      <div className="max-h-10 overflow-hidden">{m.content}</div>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-lg border border-amber-400/20 bg-amber-400/5 p-3 text-sm text-amber-100">
                  Better answers come from specific prompts: level, goal, and available practice time.
                </div>
              </aside>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AITrainerPage;
