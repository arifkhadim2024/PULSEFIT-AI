'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  TrendingUp, 
  Plus, 
  Calendar, 
  Trophy, 
  Scale, 
  Dumbbell, 
  Sparkles,
  Camera,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function ProgressPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Measurement Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [weightKg, setWeightKg] = useState('');
  const [chestCm, setChestCm] = useState('');
  const [waistCm, setWaistCm] = useState('');
  const [armsCm, setArmsCm] = useState('');
  const [thighsCm, setThighsCm] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchAnalytics = () => {
    fetch('/api/progress/analytics')
      .then(res => res.json())
      .then(data => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleSaveMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch('/api/progress/measurements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weightKg,
          chestCm,
          waistCm,
          armsCm,
          thighsCm,
        }),
      });
      setModalOpen(false);
      fetchAnalytics();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const measurements = analytics?.measurements || [];
  const logs = analytics?.logs || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Biometric & Strength Vault</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Progress Analytics & Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track body weight trajectories, circumference measurements, and training volume.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Log Measurements</span>
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Workouts Logged</span>
          <span className="text-3xl font-black text-white font-mono block">
            {analytics?.summary?.totalWorkouts || 0}
          </span>
          <p className="text-[11px] text-emerald-400">Total sessions recorded</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Cumulative Tonnage</span>
          <span className="text-3xl font-black text-emerald-400 font-mono block">
            {analytics?.summary?.totalVolumeTons || 0} <span className="text-xs font-sans text-slate-300">Tons</span>
          </span>
          <p className="text-[11px] text-slate-400">Total load moved</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Sets</span>
          <span className="text-3xl font-black text-white font-mono block">
            {analytics?.summary?.totalSetsCompleted || 0}
          </span>
          <p className="text-[11px] text-slate-400">Target working sets</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Personal Records</span>
          <span className="text-3xl font-black text-amber-400 font-mono block">
            {analytics?.prs?.length || 0}
          </span>
          <Link href="/prs" className="text-[11px] text-amber-400 hover:underline">
            View Hall of Fame →
          </Link>
        </div>
      </div>

      {/* Weight History Timeline & Visual Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Body Weight & Circumference Log */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              <span>Body Measurement Timeline</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {measurements.length} Entries Recorded
            </span>
          </div>

          {measurements.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 text-xs">
              No measurements logged yet. Click &quot;Log Measurements&quot; above to start tracking weight & circumferences.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Weight (kg)</th>
                    <th className="pb-3">Chest (cm)</th>
                    <th className="pb-3">Waist (cm)</th>
                    <th className="pb-3">Arms (cm)</th>
                    <th className="pb-3">Thighs (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {measurements.map((m: any) => (
                    <tr key={m.id} className="text-slate-200 hover:bg-slate-850/50">
                      <td className="py-3 font-sans text-slate-400">
                        {new Date(m.recordedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 font-bold text-emerald-400">{m.weightKg || '--'}</td>
                      <td className="py-3">{m.chestCm || '--'}</td>
                      <td className="py-3">{m.waistCm || '--'}</td>
                      <td className="py-3">{m.armsCm || '--'}</td>
                      <td className="py-3">{m.thighsCm || '--'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Private Progress Photo Vault */}
        <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Encrypted Vault
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                Private
              </span>
            </div>
            <h4 className="text-lg font-bold text-white">Visual Physique Progress</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload front, side, and back comparison physique photos. Stored strictly in your private local vault.
            </p>
          </div>

          <div className="p-8 border-2 border-dashed border-slate-800 rounded-2xl text-center space-y-2">
            <Camera className="w-8 h-8 text-slate-500 mx-auto" />
            <span className="text-xs font-bold text-slate-300 block">Add Progress Photo</span>
            <p className="text-[10px] text-slate-500">Supports JPG, PNG (Private by default)</p>
          </div>

          <button
            onClick={() => alert('Photo vault upload simulation active. You can link image storage in .env')}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs transition-colors"
          >
            Upload Photo
          </button>
        </div>
      </div>

      {/* Measurement Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="font-bold text-base text-white">Log Biometric Measurements</h4>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMeasurement} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase">Body Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={weightKg}
                  onChange={e => setWeightKg(e.target.value)}
                  placeholder="e.g. 78.5"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Chest (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={chestCm}
                    onChange={e => setChestCm(e.target.value)}
                    placeholder="e.g. 104"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Waist (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={waistCm}
                    onChange={e => setWaistCm(e.target.value)}
                    placeholder="e.g. 82"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Arms (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={armsCm}
                    onChange={e => setArmsCm(e.target.value)}
                    placeholder="e.g. 38"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Thighs (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={thighsCm}
                    onChange={e => setThighsCm(e.target.value)}
                    placeholder="e.g. 61"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold text-slate-950 text-xs shadow-lg shadow-emerald-500/25 transition-all mt-2"
              >
                {saving ? 'Saving...' : 'Save Entry'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
