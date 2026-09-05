'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Dumbbell, 
  Sparkles, 
  Flame, 
  Activity, 
  Shield, 
  Trophy, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Layers, 
  Zap, 
  HeartHandshake, 
  Clock, 
  ChevronRight,
  Target,
  BarChart3,
  Bot
} from 'lucide-react';
import MuscleMap from '@/components/MuscleMap';

export default function HomePage() {
  const [selectedMuscle, setSelectedMuscle] = useState<string>('Chest');

  const features = [
    {
      icon: Dumbbell,
      title: '1,000+ Exercise Database',
      desc: 'Complete encyclopedia of gym and home exercises with anatomical primary and secondary muscle mappings.',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Sparkles,
      title: 'AI Workout Planner',
      desc: 'Intelligent multi-day splits generated in seconds based on your experience, schedule, equipment, and injuries.',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Play,
      title: 'Exercise Demonstrations',
      desc: 'Kinematic visual form videos, GIFs, and interactive tempo pacing metronomes for every single movement.',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      icon: Layers,
      title: 'Muscle Biomechanics',
      desc: 'Interactive 2D/3D anatomy maps showing targeted muscle recruitment and EMG activation heatmaps.',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Activity,
      title: 'Live Workout Player',
      desc: 'Seamless set-by-set tracker with automatic rest timers, audio chimes, RPE logging, and instant PR detection.',
      color: 'from-rose-500 to-pink-500',
    },
    {
      icon: BarChart3,
      title: 'Progress & 1RM Analytics',
      desc: 'Deep scientific analytics tracking cumulative tonnage, 1RM strength curves, and body measurements.',
      color: 'from-emerald-400 to-cyan-400',
    },
  ];

  const popularExercises = [
    { name: 'Barbell Bench Press', muscle: 'Chest', equipment: 'Barbell', difficulty: 'Intermediate', slug: 'barbell-bench-press' },
    { name: 'Barbell Back Squat', muscle: 'Quadriceps', equipment: 'Barbell', difficulty: 'Intermediate', slug: 'barbell-back-squat' },
    { name: 'Conventional Deadlift', muscle: 'Back', equipment: 'Barbell', difficulty: 'Advanced', slug: 'conventional-deadlift' },
    { name: 'Overhead Press (OHP)', muscle: 'Shoulders', equipment: 'Barbell', difficulty: 'Intermediate', slug: 'overhead-press' },
    { name: 'Barbell Hip Thrust', muscle: 'Glutes', equipment: 'Barbell', difficulty: 'Intermediate', slug: 'barbell-hip-thrust' },
    { name: 'Romanian Deadlift (RDL)', muscle: 'Hamstrings', equipment: 'Barbell', difficulty: 'Intermediate', slug: 'romanian-deadlift' },
  ];

  return (
    <div className="space-y-24 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        {/* Glow backdrop blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[250px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg shadow-emerald-500/10 animate-pulse-slow">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Biomechanics & AI Coaching</span>
          </div>

          {/* Headline */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
              Train Smarter. Move Better.{' '}
              <span className="gradient-text">Get Stronger.</span>
            </h1>
            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Your complete AI-powered fitness companion for workouts, exercise education, biomechanical form analysis, progress tracking, and better training.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-base transition-all shadow-xl shadow-emerald-500/25 hover:scale-105 flex items-center justify-center gap-2.5 group"
            >
              <Zap className="w-5 h-5 fill-current" />
              <span>Start Training Free</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/exercises"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-white font-bold text-base transition-all border border-slate-800 hover:border-slate-700 flex items-center justify-center gap-2"
            >
              <Dumbbell className="w-5 h-5 text-emerald-400" />
              <span>Explore 100+ Exercises</span>
            </Link>
          </div>

          {/* Micro Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8">
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60 backdrop-blur-md">
              <span className="block text-2xl md:text-3xl font-black text-emerald-400 font-mono">100+</span>
              <span className="text-xs text-slate-400 uppercase font-semibold">Seeded Exercises</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60 backdrop-blur-md">
              <span className="block text-2xl md:text-3xl font-black text-cyan-400 font-mono">14+</span>
              <span className="text-xs text-slate-400 uppercase font-semibold">Muscle Groups</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60 backdrop-blur-md">
              <span className="block text-2xl md:text-3xl font-black text-amber-400 font-mono">100%</span>
              <span className="text-xs text-slate-400 uppercase font-semibold">Form Guides</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60 backdrop-blur-md">
              <span className="block text-2xl md:text-3xl font-black text-purple-400 font-mono">24/7</span>
              <span className="text-xs text-slate-400 uppercase font-semibold">FitAI Assistant</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE MUSCLE EXPLORER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MuscleMap
          selectedMuscle={selectedMuscle}
          onSelectMuscle={m => setSelectedMuscle(m)}
          interactiveRedirect={true}
        />
      </section>

      {/* 3. CORE FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Built for Serious Results</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Everything You Need to Master Your Physique
          </h3>
          <p className="text-slate-400 text-sm sm:text-base">
            From absolute beginners learning the barbell bench press to advanced powerlifters optimizing 1RM strength curves.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="glass-card rounded-3xl p-7 space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} p-0.5 shadow-lg group-hover:scale-110 transition-transform`}>
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white">
                      <Icon className="w-6 h-6 text-emerald-400" />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {feat.title}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. POPULAR EXERCISE PREVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-white">Essential Compound Movements</h3>
            <p className="text-xs text-slate-400 mt-1">Explore step-by-step form cues, tempo guidelines, and mistakes.</p>
          </div>
          <Link
            href="/exercises"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 group"
          >
            <span>View All Exercises</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularExercises.map(ex => (
            <Link
              key={ex.slug}
              href={`/exercises/${ex.slug}`}
              className="p-5 rounded-2xl bg-slate-900/70 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold border border-emerald-500/20">
                  {ex.muscle}
                </span>
                <span className="text-[11px] font-mono text-slate-400">{ex.difficulty}</span>
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                {ex.name}
              </h4>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <span>Equipment: <strong className="text-slate-200">{ex.equipment}</strong></span>
                <span className="text-emerald-400 font-semibold group-hover:underline">View Guide →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. AI WORKOUT GENERATOR CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/30 p-8 sm:p-12 shadow-2xl">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-2xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant AI Workout Architect</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Get a Personalized Training Plan Engineered for Your Goals in 30 Seconds.
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Tell FitAI your schedule, available equipment, target muscles, and injuries. We’ll generate a complete weekly progression split with sets, reps, tempo, and warmups.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/workouts/ai-generator"
                className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch AI Workout Generator</span>
              </Link>
              <Link
                href="/workouts"
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-800 transition-all"
              >
                Browse Premade Splits (PPL, 5x5, Upper/Lower)
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
