'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Layers, Sparkles, ArrowRight, Dumbbell } from 'lucide-react';
import MuscleMap, { MUSCLE_DETAILS } from '@/components/MuscleMap';
import { MUSCLE_GROUPS } from '@/lib/biomechanics';

export default function MusclesPage() {
  const [selectedMuscle, setSelectedMuscle] = useState('Chest');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5" />
          <span>Interactive Anatomy Hub</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Human Muscle Explorer & Anatomy
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Select any muscle region on the anatomical model to understand primary actions, fiber biomechanics, and targeted exercise selections.
        </p>
      </div>

      {/* Interactive Muscle Map */}
      <MuscleMap
        selectedMuscle={selectedMuscle}
        onSelectMuscle={m => setSelectedMuscle(m)}
        interactiveRedirect={true}
      />

      {/* Muscle Directory Grid */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white">All Muscle Regions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(MUSCLE_DETAILS).map(([key, info]) => (
            <Link
              key={key}
              href={`/exercises?muscle=${encodeURIComponent(key)}`}
              className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 uppercase">
                  {info.region} chain
                </span>
                <span className="text-emerald-400 text-xs font-bold group-hover:translate-x-1 transition-transform">
                  View Exercises →
                </span>
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                {info.name}
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {info.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
