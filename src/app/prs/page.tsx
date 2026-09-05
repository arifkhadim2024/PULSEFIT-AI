'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  Sparkles, 
  ArrowLeft, 
  Flame, 
  Calendar, 
  TrendingUp, 
  Dumbbell,
  Medal,
  Award
} from 'lucide-react';

export default function PersonalRecordsPage() {
  const [prs, setPrs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/progress/analytics')
      .then(res => res.json())
      .then(data => {
        setPrs(data.prs || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Group PRs by exercise
  const prsByExercise = prs.reduce((acc: Record<string, any[]>, pr: any) => {
    acc[pr.exerciseName] = acc[pr.exerciseName] || [];
    acc[pr.exerciseName].push(pr);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Personal Records Hall of Fame
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Automated 1RM milestones, heaviest lifts, and historical strength breakthroughs.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 rounded-3xl bg-slate-900/50 border border-slate-800 animate-pulse"></div>
          ))}
        </div>
      ) : prs.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <Trophy className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No PRs Logged Yet</h3>
          <p className="text-xs text-slate-400">Complete your first live workout session to unlock automatic PR tracking!</p>
          <Link
            href="/workouts"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
          >
            Explore Workouts
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Big Compound PR Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(prsByExercise).slice(0, 4).map(([name, records]: any) => {
              const topWeight = records.find((r: any) => r.recordType === 'HEAVIEST_WEIGHT') || records[0];
              return (
                <div
                  key={name}
                  className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/30 space-y-3 shadow-xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                      <Medal className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(topWeight.achievedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-sm truncate">{name}</h4>
                    <span className="text-2xl font-black text-amber-400 font-mono block mt-1">
                      {topWeight.value} kg
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      for {topWeight.repsAchieved} reps
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Complete PR History List */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span>All Historical Personal Records</span>
            </h3>

            <div className="divide-y divide-slate-800/80 text-xs">
              {prs.map(pr => (
                <div
                  key={pr.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-1">
                    <strong className="text-white text-sm block">{pr.exerciseName}</strong>
                    <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                      <span className="text-emerald-400 font-semibold">{pr.recordType?.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>{new Date(pr.achievedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-base font-black text-amber-400 font-mono">
                      {pr.value} kg
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px]">
                      {pr.repsAchieved} reps
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
