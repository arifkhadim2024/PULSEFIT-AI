'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Dumbbell, 
  Users, 
  Activity, 
  Trophy, 
  Plus, 
  ArrowRight, 
  Sparkles, 
  TrendingUp,
  RotateCw
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <RotateCw className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
      </div>
    );
  }

  const stats = data?.stats || {
    totalUsers: 2,
    totalExercises: 117,
    totalWorkoutsLogged: 1,
    totalPRs: 4,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-purple-500/30 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>Platform Administration</span>
          </div>
          <h1 className="text-3xl font-black text-white">System Admin Portal</h1>
          <p className="text-xs text-slate-400">Manage exercise database, upload videos/GIFs, and oversee users.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/exercises/new"
            className="px-5 py-3 rounded-2xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Exercise</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Exercises in DB</span>
            <Dumbbell className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-3xl font-black text-white font-mono block">
            {stats.totalExercises}
          </span>
          <Link href="/admin/exercises" className="text-[11px] text-emerald-400 hover:underline">
            Manage Database →
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Registered Users</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-3xl font-black text-white font-mono block">
            {stats.totalUsers}
          </span>
          <Link href="/admin/users" className="text-[11px] text-cyan-400 hover:underline">
            Manage Roles →
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Workouts Logged</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-3xl font-black text-white font-mono block">
            {stats.totalWorkoutsLogged}
          </span>
          <p className="text-[11px] text-slate-400">Total sessions recorded</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">PRs Set</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-3xl font-black text-white font-mono block">
            {stats.totalPRs}
          </span>
          <p className="text-[11px] text-slate-400">Milestone records</p>
        </div>
      </div>

      {/* Admin Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/exercises"
          className="p-6 rounded-3xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/40 transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Dumbbell className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
            Exercise Database Manager
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Create new exercises, edit biomechanics descriptions, and configure video/GIF demonstration media.
          </p>
        </Link>

        <Link
          href="/admin/users"
          className="p-6 rounded-3xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/40 transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
            User Accounts & Roles
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Inspect user activity, training goals, experience levels, and toggle administrative privileges.
          </p>
        </Link>
      </div>
    </div>
  );
}
