'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Dumbbell, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowLeft, 
  Search, 
  RotateCw,
  Film,
  Layers,
  CheckCircle2,
  AlertTriangle,
  X,
  Eye,
  ShieldCheck,
  Filter,
  Check,
  Copy
} from 'lucide-react';
import { getExerciseVideoUrl, isExerciseVideoVerified } from '@/lib/exercise-videos';

export default function AdminExercisesPage() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'verified' | 'needs_review'>('All');
  const [muscleFilter, setMuscleFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [previewExercise, setPreviewExercise] = useState<any | null>(null);
  const [duplicateList, setDuplicateList] = useState<any[]>([]);
  const [showDuplicatesOnly, setShowDuplicatesOnly] = useState(false);

  const fetchExercises = () => {
    setLoading(true);
    fetch('/api/admin/exercises')
      .then(res => res.json())
      .then(data => {
        const list = data.exercises || [];
        setExercises(list);
        
        // Compute potential duplicates by simplified name
        const nameMap: Record<string, any[]> = {};
        list.forEach((ex: any) => {
          const simplified = ex.name.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (!nameMap[simplified]) nameMap[simplified] = [];
          nameMap[simplified].push(ex);
        });
        const dups = Object.values(nameMap).filter(group => group.length > 1).flat();
        setDuplicateList(dups);
        
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await fetch(`/api/admin/exercises/${id}`, { method: 'DELETE' });
      setExercises(exercises.filter(e => e.id !== id));
    } catch (err) {
      alert('Failed to delete exercise');
    }
  };

  const handleToggleVerification = async (ex: any) => {
    const nextStatus = ex.verificationStatus === 'verified' ? 'needs_review' : 'verified';
    const nextVideoVerified = nextStatus === 'verified';

    try {
      const res = await fetch(`/api/admin/exercises/${ex.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...ex,
          verificationStatus: nextStatus,
          videoVerified: nextVideoVerified,
          metadataVerified: true,
        }),
      });

      if (res.ok) {
        setExercises(exercises.map(item => 
          item.id === ex.id 
            ? { ...item, verificationStatus: nextStatus, videoVerified: nextVideoVerified } 
            : item
        ));
      }
    } catch (err) {
      alert('Failed to update verification status');
    }
  };

  const totalCount = exercises.length;
  const verifiedCount = exercises.filter(e => e.verificationStatus === 'verified' || e.videoVerified).length;
  const reviewCount = totalCount - verifiedCount;

  const filtered = exercises.filter(e => {
    if (showDuplicatesOnly) {
      return duplicateList.some(d => d.id === e.id);
    }
    const matchesSearch = 
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.primaryMuscle.toLowerCase().includes(search.toLowerCase()) ||
      e.equipment.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'All' ? true : 
      statusFilter === 'verified' ? (e.verificationStatus === 'verified' || e.videoVerified) : 
      (e.verificationStatus !== 'verified' && !e.videoVerified);
    
    const matchesMuscle = 
      muscleFilter === 'All' ? true : e.primaryMuscle.toLowerCase() === muscleFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesMuscle;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-purple-400 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Admin Portal</span>
          </Link>
          <h1 className="text-3xl font-black text-white">Exercise Database & Verification Hub</h1>
          <p className="text-xs text-slate-400 mt-1">Audit, preview videos, verify form, and manage biomechanical exercise records.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDuplicatesOnly(!showDuplicatesOnly)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
              showDuplicatesOnly 
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' 
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
            }`}
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{showDuplicatesOnly ? 'Showing Duplicates' : `Detect Duplicates (${duplicateList.length})`}</span>
          </button>

          <Link
            href="/admin/exercises/new"
            className="px-5 py-2.5 rounded-2xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Exercise</span>
          </Link>
        </div>
      </div>

      {/* Verification Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Database Size</span>
            <span className="text-2xl font-black text-white">{totalCount} Exercises</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800 text-slate-300">
            <Dumbbell className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">1-to-1 Verified Videos</span>
            <span className="text-2xl font-black text-emerald-400">{verifiedCount} Verified</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-amber-500/30 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">Needs Video Review</span>
            <span className="text-2xl font-black text-amber-400">{reviewCount} Pending</span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by exercise name, muscle, or equipment..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'All'
                  ? 'bg-purple-500 text-slate-950'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter('verified')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'verified'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-950 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10'
              }`}
            >
              Verified ({verifiedCount})
            </button>
            <button
              onClick={() => setStatusFilter('needs_review')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'needs_review'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-950 text-amber-400 border border-amber-500/30 hover:bg-amber-500/10'
              }`}
            >
              Needs Review ({reviewCount})
            </button>
          </div>
        </div>
      </div>

      {/* Video Preview & Metadata Quality Control Modal */}
      {previewExercise && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className={`w-5 h-5 ${previewExercise.verificationStatus === 'verified' ? 'text-emerald-400' : 'text-amber-400'}`} />
                <h3 className="text-lg font-bold text-white">{previewExercise.name}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  previewExercise.verificationStatus === 'verified'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {previewExercise.verificationStatus === 'verified' ? 'Verified Match' : 'Pending Verification'}
                </span>
              </div>
              <button
                onClick={() => setPreviewExercise(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Demonstration Player */}
            <div className="p-6 space-y-5">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-inner">
                {previewExercise.videoUrl || getExerciseVideoUrl(previewExercise.slug) ? (
                  <video
                    src={previewExercise.videoUrl || getExerciseVideoUrl(previewExercise.slug)!}
                    autoPlay
                    loop
                    muted
                    controls
                    playsInline
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <div className="p-8 text-center space-y-2">
                    <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                    <p className="text-sm font-bold text-white">No Verified Video Assigned</p>
                    <p className="text-xs text-slate-400 max-w-sm">
                      This exercise is currently marked as <strong className="text-amber-400">Needs Review</strong>. No unrelated video will be shown to users.
                    </p>
                  </div>
                )}
              </div>

              {/* Quality Control Metadata Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Primary Muscle</span>
                  <strong className="text-emerald-400 font-bold">{previewExercise.primaryMuscle}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Body Part</span>
                  <strong className="text-cyan-400 font-bold">{previewExercise.bodyPart}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Equipment</span>
                  <strong className="text-white font-bold">{previewExercise.equipment}</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Pattern</span>
                  <strong className="text-purple-400 font-bold">{previewExercise.movementPattern}</strong>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Movement Instructions</span>
                <p className="leading-relaxed">{previewExercise.instructions || previewExercise.description}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    handleToggleVerification(previewExercise);
                    setPreviewExercise({
                      ...previewExercise,
                      verificationStatus: previewExercise.verificationStatus === 'verified' ? 'needs_review' : 'verified'
                    });
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    previewExercise.verificationStatus === 'verified'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-emerald-500 text-slate-950 font-black'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{previewExercise.verificationStatus === 'verified' ? 'Mark as Needs Review' : 'Approve & Mark Verified'}</span>
                </button>

                <Link
                  href={`/admin/exercises/${previewExercise.id}`}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Full Edit Form</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exercises Table */}
      {loading ? (
        <div className="p-20 text-center">
          <RotateCw className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
        </div>
      ) : (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-4">Status</th>
                  <th className="p-4">Exercise Name</th>
                  <th className="p-4">Primary Muscle</th>
                  <th className="p-4">Equipment</th>
                  <th className="p-4">Movement Pattern</th>
                  <th className="p-4">Video Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map(ex => {
                  const isVerified = ex.verificationStatus === 'verified' || ex.videoVerified;
                  const hasVideo = Boolean(ex.videoUrl || getExerciseVideoUrl(ex.slug));
                  return (
                    <tr key={ex.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          isVerified
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}>
                          {isVerified ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          <span>{isVerified ? 'Verified' : 'Review'}</span>
                        </span>
                      </td>

                      <td className="p-4 font-bold text-white">
                        <div className="flex items-center gap-2">
                          <span>{ex.name}</span>
                          {ex.aliases && (
                            <span className="text-[10px] font-normal text-slate-400">({ex.aliases})</span>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="text-emerald-400 font-semibold">{ex.primaryMuscle}</span>
                      </td>

                      <td className="p-4 text-slate-300">{ex.equipment}</td>

                      <td className="p-4 text-cyan-400 font-medium">{ex.movementPattern}</td>

                      <td className="p-4">
                        {hasVideo ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                            <Film className="w-3.5 h-3.5 text-emerald-400" />
                            <span>1:1 Verified Clip</span>
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px] italic">No Video (Pending)</span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Preview */}
                          <button
                            onClick={() => setPreviewExercise(ex)}
                            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                            title="Preview Exercise & Video"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick Toggle Status */}
                          <button
                            onClick={() => handleToggleVerification(ex)}
                            className={`p-2 rounded-xl border transition-colors ${
                              isVerified
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                            }`}
                            title={isVerified ? 'Mark as Needs Review' : 'Mark as Verified'}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Form */}
                          <Link
                            href={`/admin/exercises/${ex.id}`}
                            className="p-2 rounded-xl bg-purple-500/15 text-purple-400 hover:bg-purple-500/25 border border-purple-500/30 transition-colors"
                            title="Edit Exercise Details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Link>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(ex.id, ex.name)}
                            className="p-2 rounded-xl bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 border border-rose-500/30 transition-colors"
                            title="Delete Exercise"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
