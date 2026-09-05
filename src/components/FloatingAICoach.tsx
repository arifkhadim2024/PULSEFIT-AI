'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MessageSquare, X, Send, Bot, User, ArrowRight, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  recommendedExercises?: string[];
  isMedicalWarning?: boolean;
}

export default function FloatingAICoach() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "👋 Hi! I'm **FitAI**, your biomechanics and training assistant. Ask me anything about exercise technique, muscle targeting, progressive overload, or workout modifications!",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: textToSend }),
      });
      const data = await res.json();

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer || "I'm ready to assist with your next fitness question!",
        recommendedExercises: data.recommendedExercises || [],
        isMedicalWarning: data.isMedicalWarning || false,
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "Sorry, I had trouble processing that request. Please try again!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'What replaces Barbell Squats?',
    'Best exercises for upper chest?',
    'How much rest between bench sets?',
    'Explain progressive overload',
  ];

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-20 md:bottom-8 right-5 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/30 hover:scale-105 transition-all group"
          >
            <div className="p-1 rounded-full bg-slate-950/20 text-slate-950">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </div>
            <span>Ask FitAI Coach</span>
          </button>
        )}
      </div>

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 w-[92vw] sm:w-[420px] h-[560px] max-h-[85vh] bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5 shadow-md shadow-emerald-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400">
                  <Bot className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <span>FitAI Assistant</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </h4>
                <p className="text-[11px] text-slate-400">Biomechanics & Workout Intelligence</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 ${
                    msg.role === 'user'
                      ? 'bg-emerald-500 text-slate-950 font-semibold'
                      : msg.isMedicalWarning
                      ? 'bg-amber-500/10 border border-amber-500/30 text-amber-200'
                      : 'bg-slate-900 border border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="whitespace-pre-line leading-relaxed">{msg.content}</div>

                  {/* Recommended Exercise Links */}
                  {msg.recommendedExercises && msg.recommendedExercises.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1.5">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                        Related Exercises:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.recommendedExercises.map(slug => (
                          <Link
                            key={slug}
                            href={`/exercises/${slug}`}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-emerald-300 font-medium text-[11px] border border-slate-700 transition-colors"
                          >
                            <span>{slug.replace(/-/g, ' ')}</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-emerald-400 flex items-center justify-center text-slate-950 font-bold shrink-0 mt-0.5 text-[10px]">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>FitAI is analyzing biomechanics...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-2 border-t border-slate-900 bg-slate-950/60 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
            {quickPrompts.map(prompt => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-emerald-400 shrink-0 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about form, routines, or muscles..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold transition-all shadow-md shadow-emerald-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
