'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Flame, 
  Clock, 
  Activity, 
  Dumbbell, 
  Play, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2,
  Share2
} from 'lucide-react';

export default function WorkoutDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [workout, setWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    fetch(`/api/workouts/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.workout) setWorkout(data.workout);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 animate-pulse">
        <div className="h-8 w-40 bg-slate-800 rounded-xl"></div>
        <div className="h-64 bg-slate-900 rounded-3xl border border-slate-800"></div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Workout Not Found</h2>
        <p className="text-xs text-slate-400">This workout program does not exist.</p>
        <Link href="/workouts" className="inline-flex items-center gap-2 text-emerald-400 font-bold text-xs">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Workouts</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <Link
        href="/workouts"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Workouts</span>
      </Link>

      {/* Hero Workout Overview Card */}
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            {workout.category?.replace(/_/g, ' ')}
          </span>
          <span className="text-xs font-mono text-slate-400">{workout.difficulty}</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {workout.name}
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
            {workout.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300 pt-2 border-t border-slate-800">
          <span className="flex items-center gap-2 font-medium">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Duration: <strong className="text-white">{workout.durationMinutes} mins</strong></span>
          </span>
          <span className="flex items-center gap-2 font-medium">
            <Dumbbell className="w-4 h-4 text-cyan-400" />
            <span>Volume: <strong className="text-white">{workout.exercises?.length || 0} exercises</strong></span>
          </span>
        </div>

        <div className="pt-2">
          <Link
            href={`/workout/session?id=${workout.id}`}
            className="inline-flex items-center justify-center gap-2 py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 hover:scale-105 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Live Workout Session</span>
          </Link>
        </div>
      </div>

      {/* Exercise Schedule List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Exercise Lineup & Targets</h3>
        <div className="space-y-3">
          {workout.exercises?.map((we: any, idx: number) => {
            const ex = we.exercise;
            return (
              <div
                key={we.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center text-xs">
                    {idx + 1}
                  </span>
                  <div>
                    <Link href={`/exercises/${ex.slug}`} className="font-bold text-white text-sm hover:text-emerald-400 transition-colors">
                      {ex.name}
                    </Link>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="text-emerald-400 font-semibold">{ex.primaryMuscle}</span>
                      <span>•</span>
                      <span>{ex.equipment}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-slate-200 pl-10 sm:pl-0">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
                    {we.targetSets} Sets × {we.targetReps}
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400">
                    {we.targetRestSec}s Rest
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400">
                    {we.tempo || '3-0-1-0'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
