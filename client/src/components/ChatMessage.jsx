import React from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : ''} mb-6 group`}
    >
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
        isUser
          ? 'bg-gradient-to-br from-amber-400 to-orange-600 ring-2 ring-amber-500/30'
          : 'bg-gradient-to-br from-indigo-500 to-purple-600 ring-2 ring-indigo-500/30'
      }`}>
        {isUser ? (
          <User className="h-5 w-5 text-white" />
        ) : (
          <Sparkles className="h-5 w-5 text-white" />
        )}
      </div>

      {/* Message Bubble */}
      <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className="relative">
          <div className={`rounded-2xl px-6 py-4 shadow-md backdrop-blur-sm ${
            isUser
              ? 'bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 text-amber-50 rounded-tr-none'
              : 'bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 text-indigo-50 rounded-tl-none'
          }`}>
            <p className="whitespace-pre-wrap leading-7 text-[15px] font-medium tracking-wide">
              {message.content}
            </p>
          </div>
          
          {/* Copy Button for AI messages */}
          {!isUser && (
            <div className="absolute -right-12 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-[11px] text-gray-500 mt-2 font-medium px-2">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
};

export default ChatMessage;