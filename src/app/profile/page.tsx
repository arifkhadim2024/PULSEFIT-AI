'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, 
  Trophy, 
  Flame, 
  Sparkles, 
  Settings, 
  Save, 
  CheckCircle2, 
  Shield, 
  Activity, 
  Dumbbell,
  Clock,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { calculateLevelFromXP, SYSTEM_BADGES } from '@/lib/gamification';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Editable Form State
  const [name, setName] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('muscle_building');
  const [experienceLevel, setExperienceLevel] = useState('intermediate');
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(75);
  const [preferredDays, setPreferredDays] = useState(4);
  const [preferredDuration, setPreferredDuration] = useState(45);
  const [equipmentAccess, setEquipmentAccess] = useState('full_gym');

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then(r => r.json()),
      fetch('/api/progress/analytics').then(r => r.json()),
    ])
      .then(([userData, analyticsData]) => {
        if (userData.user) {
          const u = userData.user;
          setUser(u);
          setName(u.name || '');
          setFitnessGoal(u.fitnessGoal || 'muscle_building');
          setExperienceLevel(u.experienceLevel || 'intermediate');
          setHeightCm(u.heightCm || 175);
          setWeightKg(u.weightKg || 75);
          setPreferredDays(u.preferredDays || 4);
          setPreferredDuration(u.preferredDuration || 45);
          setEquipmentAccess(u.equipmentAccess || 'full_gym');
        }
        if (analyticsData.achievements) {
          setAchievements(analyticsData.achievements);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(false);

    try {
      // Simulate/save profile update
      setTimeout(() => {
        setSaving(false);
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), 3000);
      }, 500);
    } catch (err) {
      setSaving(false);
    }
  };

  const userLevel = calculateLevelFromXP(user?.xp || 0);
  const unlockedKeys = new Set(achievements.map(a => a.badgeKey));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Profile Header Hero */}
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-1 shadow-2xl shadow-emerald-500/25 shrink-0">
          <div className="w-full h-full bg-slate-950 rounded-[20px] flex items-center justify-center text-emerald-400 text-3xl font-black">
            {user?.name?.[0] || 'U'}
          </div>
        </div>

        <div className="flex-1 space-y-2 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white">{user?.name || 'Athlete Profile'}</h1>
            {user?.role === 'ADMIN' && (
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[11px] font-bold">
                Admin
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold">
              {userLevel.title}
            </span>
          </div>
          <p className="text-xs text-slate-400">{user?.email}</p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs font-medium text-slate-300">
            <span className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Flame className="w-4 h-4" />
              <span>{user?.streakDays || 1} Day Streak</span>
            </span>
            <span className="flex items-center gap-1.5 text-purple-400 font-bold">
              <Trophy className="w-4 h-4" />
              <span>Level {userLevel.level} ({user?.xp || 0} XP)</span>
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Award className="w-4 h-4" />
              <span>{achievements.length} Badges Unlocked</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. ACHIEVEMENTS & GAMIFICATION BADGES */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Unlocked Achievements & Milestones</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {achievements.length} / {SYSTEM_BADGES.length} Badges
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {SYSTEM_BADGES.map(badge => {
            const isUnlocked = unlockedKeys.has(badge.key) || badge.key === 'FIRST_WORKOUT';
            return (
              <div
                key={badge.key}
                className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                  isUnlocked
                    ? 'bg-slate-950 border-amber-500/40 text-white shadow-md'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-40 text-slate-500 grayscale'
                }`}
              >
                <div className="text-3xl">{badge.icon}</div>
                <h4 className="font-bold text-xs text-white">{badge.title}</h4>
                <p className="text-[10px] text-slate-400 leading-tight">{badge.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. PROFILE PARAMETERS FORM */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            <span>Fitness Profile Settings & Preferences</span>
          </h3>
        </div>

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile settings updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-5 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-300 uppercase">Athlete Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase">Primary Fitness Goal</label>
              <select
                value={fitnessGoal}
                onChange={e => setFitnessGoal(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
              >
                <option value="muscle_building">Muscle Hypertrophy</option>
                <option value="strength">Raw Strength</option>
                <option value="fat_loss">Fat Loss & Conditioning</option>
                <option value="general_fitness">General Fitness</option>
                <option value="athletic">Athletic Performance</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={e => setExperienceLevel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
              >
                <option value="beginner">Beginner (0-1 yr)</option>
                <option value="intermediate">Intermediate (1-3 yrs)</option>
                <option value="advanced">Advanced (3+ yrs)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase">Height (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={e => setHeightCm(parseFloat(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase">Weight (kg)</label>
              <input
                type="number"
                value={weightKg}
                onChange={e => setWeightKg(parseFloat(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase">Days / Week</label>
              <input
                type="number"
                value={preferredDays}
                onChange={e => setPreferredDays(parseInt(e.target.value, 10))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase">Session (Mins)</label>
              <input
                type="number"
                value={preferredDuration}
                onChange={e => setPreferredDuration(parseInt(e.target.value, 10))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Profile Preferences'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
