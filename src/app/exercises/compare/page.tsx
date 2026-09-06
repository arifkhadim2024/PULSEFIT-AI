'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Scale, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  X, 
  Dumbbell, 
  Sparkles, 
  Layers, 
  Activity, 
  Film,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw
} from 'lucide-react';
import { getExerciseVideoUrl } from '@/lib/exercise-videos';

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
  const [showVideos, setShowVideos] = useState(true);

  // Video playback states
  const [isPlaying1, setIsPlaying1] = useState(true);
  const [isPlaying2, setIsPlaying2] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);

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

  const togglePlaySync = () => {
    const nextState = !(isPlaying1 && isPlaying2);
    setIsPlaying1(nextState);
    setIsPlaying2(nextState);

    if (video1Ref.current) {
      if (nextState) video1Ref.current.play().catch(() => {});
      else video1Ref.current.pause();
    }
    if (video2Ref.current) {
      if (nextState) video2Ref.current.play().catch(() => {});
      else video2Ref.current.pause();
    }
  };

  const restartBoth = () => {
    if (video1Ref.current) {
      video1Ref.current.currentTime = 0;
      video1Ref.current.play().catch(() => {});
    }
    if (video2Ref.current) {
      video2Ref.current.currentTime = 0;
      video2Ref.current.play().catch(() => {});
    }
    setIsPlaying1(true);
    setIsPlaying2(true);
  };

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
            <span>Side-by-Side Video Form & Biomechanics Comparison</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Compare real movement execution, muscle recruitment, and mechanics in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={togglePlaySync}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md hover:scale-105 transition-transform"
          >
            {isPlaying1 && isPlaying2 ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying1 && isPlaying2 ? 'Pause Both' : 'Play Both'}</span>
          </button>

          <button
            onClick={restartBoth}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Restart both videos"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
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
              <option key={ex.id || ex.slug} value={ex.slug}>{ex.name} ({ex.primaryMuscle})</option>
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
              <option key={ex.id || ex.slug} value={ex.slug}>{ex.name} ({ex.primaryMuscle})</option>
            ))}
          </select>
        </div>
      </div>

      {loading || !exercise1 || !exercise2 ? (
        <div className="h-96 rounded-3xl bg-slate-900/50 border border-slate-800 animate-pulse"></div>
      ) : (
        <div className="space-y-6">
          {/* Side-by-Side Video Players */}
          {showVideos && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Exercise 1 Video */}
              <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-emerald-500/30 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase">
                      Option A
                    </span>
                    <h3 className="text-base font-bold text-white line-clamp-1">{exercise1.name}</h3>
                  </div>
                  <span className="text-xs font-mono text-emerald-400">{exercise1.primaryMuscle}</span>
                </div>

                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-inner">
                  <video
                    ref={video1Ref}
                    src={getExerciseVideoUrl(exercise1.slug, exercise1.primaryMuscle, exercise1.movementPattern)}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-contain bg-black"
                  />
                </div>
              </div>

              {/* Exercise 2 Video */}
              <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-cyan-500/30 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold uppercase">
                      Option B
                    </span>
                    <h3 className="text-base font-bold text-white line-clamp-1">{exercise2.name}</h3>
                  </div>
                  <span className="text-xs font-mono text-cyan-400">{exercise2.primaryMuscle}</span>
                </div>

                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-inner">
                  <video
                    ref={video2Ref}
                    src={getExerciseVideoUrl(exercise2.slug, exercise2.primaryMuscle, exercise2.movementPattern)}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-contain bg-black"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Cards & Matrix Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-emerald-500/30 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold uppercase">
                  Option A Summary
                </span>
                <span className="text-xs font-mono text-slate-400">{exercise1.difficulty}</span>
              </div>
              <h3 className="text-2xl font-black text-white">{exercise1.name}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{exercise1.description}</p>
              <Link
                href={`/exercises/${exercise1.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:underline"
              >
                <span>Full Form Breakdown & Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-cyan-500/30 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-400 text-xs font-bold uppercase">
                  Option B Summary
                </span>
                <span className="text-xs font-mono text-slate-400">{exercise2.difficulty}</span>
              </div>
              <h3 className="text-2xl font-black text-white">{exercise2.name}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{exercise2.description}</p>
              <Link
                href={`/exercises/${exercise2.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:underline"
              >
                <span>Full Form Breakdown & Guide</span>
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
                <span className="font-bold text-slate-400">Primary Target Muscle</span>
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
