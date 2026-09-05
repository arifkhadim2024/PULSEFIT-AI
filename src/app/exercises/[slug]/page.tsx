'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Dumbbell, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Layers, 
  Clock, 
  RotateCcw, 
  Scale, 
  Activity,
  Flame,
  Info
} from 'lucide-react';
import ExerciseMediaDisplay from '@/components/ExerciseMediaDisplay';
import TempoTimer from '@/components/TempoTimer';

export default function ExerciseDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [exercise, setExercise] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    fetch(`/api/exercises/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.exercise) {
          setExercise(data.exercise);
          setRelated(data.related || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
        <div className="h-8 w-48 bg-slate-800 rounded-xl"></div>
        <div className="h-96 bg-slate-900 rounded-3xl border border-slate-800"></div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Exercise Not Found</h2>
        <p className="text-sm text-slate-400">The requested exercise guide does not exist.</p>
        <Link href="/exercises" className="inline-flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Exercise Library</span>
        </Link>
      </div>
    );
  }

  // Parse JSON arrays safely
  let setupSteps: string[] = [];
  try {
    setupSteps = JSON.parse(exercise.setupSteps || '[]');
  } catch (e) {
    setupSteps = [exercise.setupSteps || 'Position body properly before initiating load.'];
  }

  let executionSteps: string[] = [];
  try {
    executionSteps = JSON.parse(exercise.executionSteps || '[]');
  } catch (e) {
    executionSteps = [exercise.executionSteps || 'Perform smooth, controlled reps.'];
  }

  let commonMistakes: { mistake: string; fix: string }[] = [];
  try {
    commonMistakes = JSON.parse(exercise.commonMistakes || '[]');
  } catch (e) {
    commonMistakes = [];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Breadcrumb & Compare Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/exercises"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Exercise Database</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/exercises/compare?slug1=${exercise.slug}&slug2=${exercise.beginnerAlternative ? exercise.beginnerAlternative.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'barbell-bench-press'}`}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>Compare with Alternatives</span>
          </Link>
        </div>
      </div>

      {/* Header Info */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            {exercise.primaryMuscle}
          </span>
          <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            {exercise.movementPattern}
          </span>
          <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-wider">
            {exercise.difficulty}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {exercise.name}
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          {exercise.description}
        </p>
      </div>

      {/* Main Grid: Media Visualizer & Quick Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Media Display */}
        <div className="lg:col-span-7 space-y-6">
          <ExerciseMediaDisplay
            exerciseName={exercise.name}
            primaryMuscle={exercise.primaryMuscle}
            mediaList={exercise.media || []}
            movementPattern={exercise.movementPattern}
            tempo={exercise.tempo}
          />

          {/* Interactive Tempo Metronome */}
          <TempoTimer tempoString={exercise.tempo || '3-1-1-0'} />
        </div>

        {/* Right Column: Key Anatomical Specs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Anatomical Targeting</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Primary Target:</span>
                <strong className="text-emerald-400 font-bold">{exercise.primaryMuscle}</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Secondary Synergists:</span>
                <strong className="text-slate-200">{exercise.secondaryMuscles || 'N/A'}</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Equipment Required:</span>
                <strong className="text-slate-200">{exercise.equipment}</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Target Hypertrophy Reps:</span>
                <strong className="text-white font-mono">{exercise.recommendedReps} reps</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Working Sets:</span>
                <strong className="text-white font-mono">{exercise.recommendedSets} sets</strong>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Inter-set Rest Period:</span>
                <strong className="text-white font-mono">{exercise.recommendedRestSec} seconds</strong>
              </div>
            </div>
          </div>

          {/* Caloric Burn & Tags */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Flame className="w-4 h-4" />
              <span>Energy Expenditure</span>
            </div>
            <p className="text-sm text-slate-300">
              Approx. <strong className="text-white font-mono">{exercise.caloriesBurnPerHour || 350} kcal / hour</strong> active training output.
            </p>
          </div>
        </div>
      </div>

      {/* Form Analysis: Step-by-Step Execution Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Setup Steps */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-black text-xs">
              1
            </span>
            <span>Biomechanical Setup & Posture</span>
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
            {setupSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Execution Steps */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-black text-xs">
              2
            </span>
            <span>Kinematic Execution & Form Cues</span>
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
            {executionSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Breathing & Intra-abdominal Pressure */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-400" />
          <span>Breathing & Valsalva Protocol</span>
        </h3>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
          {exercise.breathingInstructions}
        </p>
      </div>

      {/* Common Mistakes & Form Corrections Table */}
      {commonMistakes.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Common Technique Mistakes & Corrections</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Avoid these common biomechanical pitfalls to optimize muscle activation and protect joint structures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {commonMistakes.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2.5"
              >
                <div className="flex items-start gap-2 text-rose-400 text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5"></span>
                  <span>Mistake: {item.mistake}</span>
                </div>
                <div className="flex items-start gap-2 text-emerald-400 text-xs font-semibold pl-3 border-l-2 border-emerald-500/40">
                  <span>Correction: {item.fix}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exercise Substitutions / Alternatives */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-cyan-400" />
            <span>Biomechanical Alternatives & Regressions</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Swap this exercise depending on equipment access, joint fatigue, or experience level.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              Beginner Regression
            </span>
            <h4 className="font-bold text-white text-sm">
              {exercise.beginnerAlternative || 'Standard Dumbbell Variation'}
            </h4>
            <p className="text-slate-400 text-[11px]">Lower balance and stabilization demands.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
              Intermediate Alternative
            </span>
            <h4 className="font-bold text-white text-sm">
              {exercise.intermediateAlternative || 'Barbell Free Weight Equivalent'}
            </h4>
            <p className="text-slate-400 text-[11px]">Balanced loading and hypertrophy stimulus.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
              Advanced Progression
            </span>
            <h4 className="font-bold text-white text-sm">
              {exercise.advancedAlternative || 'Paused / Loaded Deficit Protocol'}
            </h4>
            <p className="text-slate-400 text-[11px]">Maximum mechanical tension & overload.</p>
          </div>
        </div>
      </div>

      {/* Safety & Medical Notice */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200 block mb-0.5">Safety Cue:</strong>
          {exercise.safetyTips} Discontinue set immediately if you experience sharp pinching joint discomfort or acute strain.
        </div>
      </div>
    </div>
  );
}
