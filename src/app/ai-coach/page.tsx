'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ArrowRight, 
  ShieldAlert, 
  RotateCw, 
  Dumbbell, 
  Flame, 
  Clock, 
  Layers 
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  recommendedExercises?: string[];
  isMedicalWarning?: boolean;
}

export default function AICoachPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `👋 Hello! I am **FitAI**, your biomechanics and training coach.\n\nI can help you with:\n- **Exercise Technique & Form Cues**\n- **Biomechanical Substitutions & Injury Modifications**\n- **Scientific Progressive Overload Protocols**\n- **Optimal Rest Periods & Set/Rep Schemes**\n\nHow can I help you optimize your training today?`,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        content: data.answer || "I'm ready for your next training question!",
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
          content: 'Sorry, I ran into an issue analyzing that question. Please try again!',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    { title: 'Best Upper Chest Builders', prompt: 'What are the best exercises for upper chest and why?' },
    { title: 'Squat Substitutes', prompt: 'What can replace Barbell Back Squats if I have lower back fatigue?' },
    { title: 'Rest Interval Science', prompt: 'How much rest should I take between heavy compound bench sets?' },
    { title: 'Explain Progressive Overload', prompt: 'Explain progressive overload and how to apply double progression.' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400">
              <Bot className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>FitAI Biomechanics Coach</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </h1>
            <p className="text-xs text-slate-400">Evidence-based training answers grounded in exercise science.</p>
          </div>
        </div>

        <Link
          href="/workouts/ai-generator"
          className="px-4 py-2.5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Routine Generator</span>
        </Link>
      </div>

      {/* Main Chat Window */}
      <div className="h-[600px] bg-slate-900 border border-slate-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-2xl p-4 sm:p-5 ${
                  msg.role === 'user'
                    ? 'bg-emerald-500 text-slate-950 font-semibold'
                    : msg.isMedicalWarning
                    ? 'bg-amber-950/40 border border-amber-500/40 text-amber-200'
                    : 'bg-slate-950 border border-slate-800 text-slate-200'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed">{msg.content}</div>

                {/* Recommended Exercise Links */}
                {msg.recommendedExercises && msg.recommendedExercises.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                      Recommended Exercise Guides:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {msg.recommendedExercises.map(slug => (
                        <Link
                          key={slug}
                          href={`/exercises/${slug}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-white font-medium text-xs border border-slate-700 transition-colors"
                        >
                          <Dumbbell className="w-3.5 h-3.5" />
                          <span>{slug.replace(/-/g, ' ')}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-400 flex items-center justify-center text-slate-950 font-bold shrink-0 mt-0.5 text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2.5 text-slate-400 text-xs py-3 pl-2">
              <RotateCw className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>FitAI is analyzing biomechanics and volume parameters...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Sample Prompts */}
        <div className="px-6 py-2.5 bg-slate-950 border-t border-slate-800 overflow-x-auto flex gap-2 scrollbar-none">
          {sampleQuestions.map(item => (
            <button
              key={item.title}
              onClick={() => handleSend(item.prompt)}
              className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-emerald-400 shrink-0 transition-colors"
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask FitAI about exercise mechanics, sets/reps, tempo, or workouts..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Medical Safety Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span>
          <strong>Safety Policy:</strong> FitAI is an educational resistance training tool. It does not provide medical diagnoses or treatment for orthopedic injuries. If you experience sharp joint pain or dizziness, cease training immediately and consult a medical doctor.
        </span>
      </div>
    </div>
  );
}
