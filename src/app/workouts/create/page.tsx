'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Dumbbell, 
  Clock, 
  Search, 
  Save, 
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

export default function CreateWorkoutPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('custom');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [durationMinutes, setDurationMinutes] = useState(45);

  const [allExercises, setAllExercises] = useState<any[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<any[]>([]);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/exercises?limit=120')
      .then(res => res.json())
      .then(data => setAllExercises(data.exercises || []))
      .catch(() => {});
  }, []);

  const addExercise = (ex: any) => {
    setSelectedExercises([
      ...selectedExercises,
      {
        exerciseId: ex.id,
        name: ex.name,
        primaryMuscle: ex.primaryMuscle,
        targetSets: 3,
        targetReps: '8-12',
        targetRestSec: 90,
        tempo: '3-0-1-0',
        notes: '',
      },
    ]);
  };

  const removeExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const updateExerciseField = (index: number, field: string, val: any) => {
    const updated = [...selectedExercises];
    updated[index] = { ...updated[index], [field]: val };
    setSelectedExercises(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || selectedExercises.length === 0) return;

    setSaving(true);
    try {
      const res = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          category,
          difficulty,
          durationMinutes,
          exercises: selectedExercises,
        }),
      });

      const data = await res.json();
      if (data.workout) {
        router.push('/workouts');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const filteredExercises = allExercises.filter(ex =>
    ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
    ex.primaryMuscle.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Link
          href="/workouts"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Workouts</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Custom Workout Builder
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Design and tailor your custom volume, rep targets, and rest intervals.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Workout Meta Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white uppercase tracking-wider text-emerald-400 text-xs">
            1. General Routine Specs
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Routine Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Quad Hypertrophy & Calves Crusher"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Goal, warm-up notes, or cadence notes..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="custom">Custom Routine</option>
                <option value="push_pull_legs">Push / Pull / Legs</option>
                <option value="upper_lower">Upper / Lower</option>
                <option value="strength_5x5">Strength & Power</option>
                <option value="home_minimal">Home Minimal</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Difficulty</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Est. Duration</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={e => setDurationMinutes(parseInt(e.target.value, 10))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Selected Exercises Table */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white uppercase tracking-wider text-emerald-400 text-xs">
              2. Exercise Order & Sets ({selectedExercises.length} Selected)
            </h3>
          </div>

          {selectedExercises.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 text-xs">
              No exercises added yet. Use the exercise search below to add movements to your custom workout.
            </div>
          ) : (
            <div className="space-y-3">
              {selectedExercises.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                        {idx + 1}
                      </span>
                      <strong className="text-white text-sm font-bold">{ex.name}</strong>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                        {ex.primaryMuscle}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeExercise(idx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Target Sets</label>
                      <input
                        type="number"
                        value={ex.targetSets}
                        onChange={e => updateExerciseField(idx, 'targetSets', parseInt(e.target.value, 10))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Target Reps</label>
                      <input
                        type="text"
                        value={ex.targetReps}
                        onChange={e => updateExerciseField(idx, 'targetReps', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Rest Sec</label>
                      <input
                        type="number"
                        value={ex.targetRestSec}
                        onChange={e => updateExerciseField(idx, 'targetRestSec', parseInt(e.target.value, 10))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Tempo Cadence</label>
                      <input
                        type="text"
                        value={ex.tempo}
                        onChange={e => updateExerciseField(idx, 'tempo', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Search & Add Exercises Drawer */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Add Exercises to Workout
            </h4>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={exerciseSearch}
                onChange={e => setExerciseSearch(e.target.value)}
                placeholder="Search exercise library by name or muscle..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {filteredExercises.slice(0, 15).map(ex => (
                <div
                  key={ex.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800 text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{ex.name}</span>
                    <span className="text-[10px] text-emerald-400">{ex.primaryMuscle} • {ex.equipment}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => addExercise(ex)}
                    className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-bold text-[11px] transition-all"
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/workouts"
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || selectedExercises.length === 0}
            className="px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Custom Workout'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
