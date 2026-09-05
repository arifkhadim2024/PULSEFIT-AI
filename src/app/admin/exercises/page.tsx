'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Dumbbell, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowLeft, 
  Search, 
  RotateCw,
  Video,
  Layers,
  CheckCircle2
} from 'lucide-react';

export default function AdminExercisesPage() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchExercises = () => {
    fetch('/api/admin/exercises')
      .then(res => res.json())
      .then(data => {
        setExercises(data.exercises || []);
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

  const filtered = exercises.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.primaryMuscle.toLowerCase().includes(search.toLowerCase())
  );

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
          <h1 className="text-3xl font-black text-white">Exercise Database Manager</h1>
          <p className="text-xs text-slate-400 mt-1">Manage {exercises.length} biomechanical exercises & media.</p>
        </div>

        <Link
          href="/admin/exercises/new"
          className="px-5 py-3 rounded-2xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Exercise</span>
        </Link>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search exercises by name or muscle group..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Table */}
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
                  <th className="p-4">Exercise Name</th>
                  <th className="p-4">Primary Muscle</th>
                  <th className="p-4">Equipment</th>
                  <th className="p-4">Difficulty</th>
                  <th className="p-4">Media</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map(ex => (
                  <tr key={ex.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="p-4">
                      <strong className="text-white block font-bold text-sm">{ex.name}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">{ex.slug}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                        {ex.primaryMuscle}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">{ex.equipment}</td>
                    <td className="p-4 text-slate-300 font-mono">{ex.difficulty}</td>
                    <td className="p-4">
                      {ex.media?.length > 0 ? (
                        <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 text-[10px] font-bold flex items-center gap-1 w-fit">
                          <Video className="w-3 h-3" />
                          <span>{ex.media[0].type}</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">No Media</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/admin/exercises/${ex.id}`}
                        className="inline-flex p-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200"
                        title="Edit Exercise"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(ex.id, ex.name)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                        title="Delete Exercise"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
