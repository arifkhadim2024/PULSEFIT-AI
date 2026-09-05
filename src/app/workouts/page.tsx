'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Flame, 
  Sparkles, 
  Plus, 
  Play, 
  Clock, 
  Activity, 
  Dumbbell, 
  ArrowRight,
  Filter,
  CheckCircle2
} from 'lucide-react';

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = category === 'All' ? '/api/workouts' : `/api/workouts?category=${category}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setWorkouts(data.workouts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  const categories = [
    { id: 'All', label: 'All Programs' },
    { id: 'push_pull_legs', label: 'Push Pull Legs (PPL)' },
    { id: 'strength_5x5', label: '5x5 Strength' },
    { id: 'upper_lower', label: 'Upper / Lower' },
    { id: 'beginner', label: 'Beginner Full Body' },
    { id: 'home_minimal', label: 'Home Minimal' },
    { id: 'custom', label: 'My Custom Routines' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Flame className="w-3.5 h-3.5" />
            <span>Training Programs & Splits</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Workout Program Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Proven hypertrophy splits, powerlifting routines, and customizable training protocols.
          </p>
        </div>

        {/* Create Custom Workout CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/workouts/ai-generator"
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Generator</span>
          </Link>

          <Link
            href="/workouts/create"
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-xs flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Build Custom Routine</span>
          </Link>
        </div>
      </div>

      {/* AI Generator Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Automated Periodization
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Need a routine tailored to your exact equipment & schedule?
          </h3>
          <p className="text-xs text-slate-300">
            Our AI analyzes your experience, goal, workout duration, and injury exclusions to build a custom split in seconds.
          </p>
        </div>
        <Link
          href="/workouts/ai-generator"
          className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/25 shrink-0"
        >
          Launch AI Generator →
        </Link>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              category === c.id
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Workouts Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 rounded-3xl bg-slate-900/40 border border-slate-800 animate-pulse"></div>
          ))}
        </div>
      ) : workouts.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3">
          <p className="text-slate-400 text-sm">No workouts found in this category.</p>
          <Link href="/workouts/create" className="text-xs font-bold text-emerald-400 hover:underline">
            Create your own custom workout →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map(w => (
            <div
              key={w.id}
              className="glass-card rounded-3xl p-6 space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                    {w.category?.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{w.difficulty}</span>
                </div>

                <h3 className="text-xl font-bold text-white">{w.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {w.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-300 pt-2 border-t border-slate-800/80 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    {w.durationMinutes} mins
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Dumbbell className="w-3.5 h-3.5 text-cyan-400" />
                    {w.exercises?.length || 3} exercises
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <Link
                  href={`/workout/session?id=${w.id}`}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Live Workout</span>
                </Link>

                <Link
                  href={`/workouts/${w.id}`}
                  className="py-3 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
