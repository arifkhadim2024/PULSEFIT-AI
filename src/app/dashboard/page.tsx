'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Flame, 
  Trophy, 
  Activity, 
  Dumbbell, 
  Sparkles, 
  Play, 
  ArrowRight, 
  Plus, 
  TrendingUp, 
  Clock, 
  Calendar,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { calculateLevelFromXP } from '@/lib/gamification';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then(r => r.json()),
      fetch('/api/progress/analytics').then(r => r.json()),
      fetch('/api/workouts').then(r => r.json()),
    ])
      .then(([userData, analyticsData, workoutData]) => {
        if (userData.user) setUser(userData.user);
        if (analyticsData.summary) setAnalytics(analyticsData);
        if (workoutData.workouts) setWorkouts(workoutData.workouts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Time of day greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const userLevel = calculateLevelFromXP(user?.xp || 0);

  const featuredWorkout = workouts[0] || {
    id: 'push-day-hypertrophy',
    name: 'Push Day (Chest, Shoulders & Triceps)',
    category: 'push_pull_legs',
    durationMinutes: 45,
    difficulty: 'Intermediate',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Greeting & User Stat Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">
              {greeting}, {user?.name || 'Athlete'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-xs text-slate-400 font-medium">Ready to crush training?</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            User Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Goal: <strong className="text-slate-200 capitalize">{user?.fitnessGoal?.replace('_', ' ') || 'Muscle Hypertrophy'}</strong> • Rank: <strong className="text-emerald-400">{userLevel.title}</strong>
          </p>
        </div>

        {/* Quick Launcher Action */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/workouts/ai-generator"
            className="px-4 py-3 rounded-2xl bg-slate-850 hover:bg-slate-800 text-cyan-300 font-bold text-xs border border-cyan-500/30 flex items-center gap-2 transition-all shadow-md"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI Routine Builder</span>
          </Link>

          <Link
            href={`/workout/session?id=${featuredWorkout.id}`}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/25 hover:scale-105 flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Quick Start Workout</span>
          </Link>
        </div>
      </div>

      {/* 2. Gamification & KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Workout Streak</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-white font-mono block">
            {user?.streakDays || 1} <span className="text-sm font-sans font-semibold text-amber-400">Days</span>
          </span>
          <p className="text-[11px] text-slate-400">Keep it burning! 7-day milestone ahead.</p>
        </div>

        {/* Level & XP */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trainee Level</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-white font-mono block">
            Level {userLevel.level}
          </span>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${userLevel.progressPercent}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-400 flex justify-between font-mono">
            <span>{userLevel.currentLevelXp} XP</span>
            <span>{userLevel.nextLevelXp} XP</span>
          </p>
        </div>

        {/* Total Volume */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Tonnage</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-emerald-400 font-mono block">
            {analytics?.summary?.totalVolumeTons || 4.2} <span className="text-sm font-sans font-semibold text-slate-300">Tons</span>
          </span>
          <p className="text-[11px] text-slate-400">
            {analytics?.summary?.totalSetsCompleted || 10} working sets completed
          </p>
        </div>

        {/* PR Count */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Personal Records</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-cyan-400 font-mono block">
            {analytics?.prs?.length || 4} <span className="text-sm font-sans font-semibold text-slate-300">PRs</span>
          </span>
          <Link href="/prs" className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1">
            <span>View PR Wall of Fame</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* 3. Today's Recommended Routine & Muscle Map Launcher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Workout Focus */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Today&apos;s Workout
            </span>
            <span className="text-xs text-slate-400 font-mono">Scheduled Split</span>
          </div>

          <div>
            <h3 className="text-2xl font-black text-white">{featuredWorkout.name}</h3>
            <p className="text-xs text-slate-400 mt-1">
              {featuredWorkout.description || 'Compound hypertrophy routine engineered for mechanical tension and muscle damage.'}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              {featuredWorkout.durationMinutes} Minutes
            </span>
            <span className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" />
              {featuredWorkout.difficulty}
            </span>
            <span className="flex items-center gap-1.5">
              <Dumbbell className="w-4 h-4 text-amber-400" />
              {featuredWorkout.exercises?.length || 4} Exercises
            </span>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <Link
              href={`/workout/session?id=${featuredWorkout.id}`}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Live Workout Player</span>
            </Link>

            <Link
              href={`/workouts/${featuredWorkout.id}`}
              className="py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-sm transition-colors border border-slate-700"
            >
              Details
            </Link>
          </div>
        </div>

        {/* Recovery & Readiness Radar */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Recovery & Readiness
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                Optimal
              </span>
            </div>
            <h4 className="text-lg font-bold text-white">Systemic Recovery: 92%</h4>
            <p className="text-xs text-slate-400 mt-1">
              Muscle protein synthesis active. Ready for high-intensity compound pressing and squatting.
            </p>
          </div>

          <div className="space-y-2.5">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-300">Chest & Shoulders</span>
                <span className="text-emerald-400 font-mono">100% (Recovered)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-full rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-300">Legs & Posterior Chain</span>
                <span className="text-emerald-400 font-mono">95% (Recovered)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[95%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-300">Back & Lats</span>
                <span className="text-amber-400 font-mono">80% (Recovering)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[80%] rounded-full"></div>
              </div>
            </div>
          </div>

          <Link
            href="/nutrition"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center justify-between pt-2 border-t border-slate-800"
          >
            <span>View Nutrition & Macro Fueling Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4. Recent PRs & Recent Workout Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent PR Wall */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-base text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Recent Personal Records</span>
            </h4>
            <Link href="/prs" className="text-xs text-emerald-400 hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-2.5">
            {(analytics?.prs?.slice(0, 4) || []).map((pr: any) => (
              <div
                key={pr.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-850 border border-slate-800"
              >
                <div>
                  <h5 className="font-bold text-white text-xs">{pr.exerciseName}</h5>
                  <span className="text-[10px] text-slate-400">{pr.recordType?.replace('_', ' ')}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-black text-amber-400 block">
                    {pr.value} kg
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {pr.repsAchieved} reps
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workout History */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-base text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Recent Workout Logs</span>
            </h4>
            <Link href="/progress" className="text-xs text-emerald-400 hover:underline">
              Analytics
            </Link>
          </div>

          <div className="space-y-2.5">
            {(analytics?.logs?.slice(0, 4) || []).map((log: any) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-850 border border-slate-800"
              >
                <div>
                  <h5 className="font-bold text-white text-xs">{log.workoutName}</h5>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.completedAt).toLocaleDateString()} • {log.durationMinutes} mins
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-black text-emerald-400 block">
                    {log.totalVolumeKg} kg
                  </span>
                  <span className="text-[10px] text-purple-400 font-bold">
                    +{log.xpEarned} XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
