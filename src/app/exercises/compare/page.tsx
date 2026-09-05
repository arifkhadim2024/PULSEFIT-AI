'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Scale, ArrowLeft, ArrowRight, Check, X, Dumbbell, Sparkles, Layers, Activity } from 'lucide-react';

export default function ExerciseComparePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading comparison...</div>}>
      <ExerciseCompareContent />
    </Suspense>
  );
}

function ExerciseCompareContent() {
  const searchParams = useSearchParams();
  const slug1 = searchParams.get('slug1') || 'barbell-bench-press';
  const slug2 = searchParams.get('slug2') || 'dumbbell-bench-press';

  const [exercise1, setExercise1] = useState<any>(null);
  const [exercise2, setExercise2] = useState<any>(null);
  const [allExercises, setAllExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/exercises?limit=120')
      .then(res => res.json())
      .then(data => setAllExercises(data.exercises || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!slug1 || !slug2) return;
    setLoading(true);

    fetch(`/api/exercises/compare?slug1=${slug1}&slug2=${slug2}`)
      .then(res => res.json())
      .then(data => {
        setExercise1(data.exercise1);
        setExercise2(data.exercise2);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug1, slug2]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/exercises"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Exercises</span>
          </Link>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Scale className="w-7 h-7 text-emerald-400" />
            <span>Side-by-Side Biomechanical Comparison</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Compare muscle recruitment, range of motion, and stability trade-offs.
          </p>
        </div>
      </div>

      {/* Comparison Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
            Exercise A
          </label>
          <select
            value={slug1}
            onChange={e => {
              window.location.href = `/exercises/compare?slug1=${e.target.value}&slug2=${slug2}`;
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
          >
            {allExercises.map(ex => (
              <option key={ex.id} value={ex.slug}>{ex.name} ({ex.primaryMuscle})</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
            Exercise B
          </label>
          <select
            value={slug2}
            onChange={e => {
              window.location.href = `/exercises/compare?slug1=${slug1}&slug2=${e.target.value}`;
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
          >
            {allExercises.map(ex => (
              <option key={ex.id} value={ex.slug}>{ex.name} ({ex.primaryMuscle})</option>
            ))}
          </select>
        </div>
      </div>

      {loading || !exercise1 || !exercise2 ? (
        <div className="h-96 rounded-3xl bg-slate-900/50 border border-slate-800 animate-pulse"></div>
      ) : (
        /* Comparison Table Cards */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-emerald-500/30 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold uppercase">
                  Option A
                </span>
                <span className="text-xs font-mono text-slate-400">{exercise1.difficulty}</span>
              </div>
              <h3 className="text-2xl font-black text-white">{exercise1.name}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{exercise1.description}</p>
              <Link
                href={`/exercises/${exercise1.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:underline"
              >
                <span>Full Form Breakdown</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-cyan-500/30 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-400 text-xs font-bold uppercase">
                  Option B
                </span>
                <span className="text-xs font-mono text-slate-400">{exercise2.difficulty}</span>
              </div>
              <h3 className="text-2xl font-black text-white">{exercise2.name}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{exercise2.description}</p>
              <Link
                href={`/exercises/${exercise2.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:underline"
              >
                <span>Full Form Breakdown</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Detailed Matrix Table */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 bg-slate-950/60">
              <h4 className="font-bold text-sm text-white uppercase tracking-wider">
                Biomechanical Metric Comparison
              </h4>
            </div>

            <div className="divide-y divide-slate-800 text-xs sm:text-sm">
              <div className="grid grid-cols-3 p-4 items-center">
                <span className="font-bold text-slate-400">Primary Muscle</span>
                <strong className="text-emerald-400">{exercise1.primaryMuscle}</strong>
                <strong className="text-cyan-400">{exercise2.primaryMuscle}</strong>
              </div>

              <div className="grid grid-cols-3 p-4 items-center bg-slate-950/30">
                <span className="font-bold text-slate-400">Secondary Synergists</span>
                <span className="text-slate-200">{exercise1.secondaryMuscles}</span>
                <span className="text-slate-200">{exercise2.secondaryMuscles}</span>
              </div>

              <div className="grid grid-cols-3 p-4 items-center">
                <span className="font-bold text-slate-400">Equipment Type</span>
                <span className="text-white font-medium">{exercise1.equipment}</span>
                <span className="text-white font-medium">{exercise2.equipment}</span>
              </div>

              <div className="grid grid-cols-3 p-4 items-center bg-slate-950/30">
                <span className="font-bold text-slate-400">Movement Pattern</span>
                <span className="text-slate-200">{exercise1.movementPattern}</span>
                <span className="text-slate-200">{exercise2.movementPattern}</span>
              </div>

              <div className="grid grid-cols-3 p-4 items-center">
                <span className="font-bold text-slate-400">Recommended Tempo</span>
                <span className="text-emerald-400 font-mono font-bold">{exercise1.tempo}</span>
                <span className="text-cyan-400 font-mono font-bold">{exercise2.tempo}</span>
              </div>

              <div className="grid grid-cols-3 p-4 items-center bg-slate-950/30">
                <span className="font-bold text-slate-400">Target Rep Scheme</span>
                <span className="text-white font-mono">{exercise1.recommendedReps} reps</span>
                <span className="text-white font-mono">{exercise2.recommendedReps} reps</span>
              </div>

              <div className="grid grid-cols-3 p-4 items-center">
                <span className="font-bold text-slate-400">Rest Interval</span>
                <span className="text-white font-mono">{exercise1.recommendedRestSec}s</span>
                <span className="text-white font-mono">{exercise2.recommendedRestSec}s</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
