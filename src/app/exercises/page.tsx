'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  Filter, 
  Dumbbell, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Zap, 
  ChevronRight,
  Flame,
  ArrowUpDown,
  RotateCcw,
  SlidersHorizontal,
  Scale
} from 'lucide-react';
import { MUSCLE_GROUPS, EQUIPMENT_LIST } from '@/lib/biomechanics';

export default function ExercisesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading exercise database...</div>}>
      <ExercisesContent />
    </Suspense>
  );
}

function ExercisesContent() {
  const searchParams = useSearchParams();
  const initialMuscle = searchParams.get('muscle') || 'All';

  const [exercises, setExercises] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState(initialMuscle);
  const [selectedEquipment, setSelectedEquipment] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedMovement, setSelectedMovement] = useState('All');

  // Compare selection drawer
  const [compareList, setCompareList] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (selectedMuscle !== 'All') params.set('muscle', selectedMuscle);
    if (selectedEquipment !== 'All') params.set('equipment', selectedEquipment);
    if (selectedDifficulty !== 'All') params.set('difficulty', selectedDifficulty);
    if (selectedMovement !== 'All') params.set('movement', selectedMovement);
    params.set('limit', '120');

    fetch(`/api/exercises?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setExercises(data.exercises || []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [search, selectedMuscle, selectedEquipment, selectedDifficulty, selectedMovement]);

  const toggleCompare = (exercise: any) => {
    if (compareList.some(e => e.id === exercise.id)) {
      setCompareList(compareList.filter(e => e.id !== exercise.id));
    } else {
      if (compareList.length >= 2) {
        setCompareList([compareList[1], exercise]);
      } else {
        setCompareList([...compareList, exercise]);
      }
    }
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedMuscle('All');
    setSelectedEquipment('All');
    setSelectedDifficulty('All');
    setSelectedMovement('All');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Encyclopedia of Biomechanics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Comprehensive Exercise Database
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse {total} verified exercises with precise setup cues, execution steps, tempo cadences, and alternatives.
          </p>
        </div>

        <Link
          href="/muscles"
          className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 flex items-center gap-2 transition-all"
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Interactive Muscle Map</span>
        </Link>
      </div>

      {/* Filter Bar & Search */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search exercises by name, keyword, or biomechanical tag (e.g. 'Bench', 'Squat', 'Lats')..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Muscle Category Chips */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Target Muscle Group
          </span>
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedMuscle('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedMuscle === 'All'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              All Muscles
            </button>
            {MUSCLE_GROUPS.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMuscle(m.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedMuscle === m.id
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {m.id}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Equipment
            </label>
            <select
              value={selectedEquipment}
              onChange={e => setSelectedEquipment(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Equipment</option>
              {EQUIPMENT_LIST.map(eq => (
                <option key={eq} value={eq}>{eq}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Movement Pattern
            </label>
            <select
              value={selectedMovement}
              onChange={e => setSelectedMovement(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Patterns</option>
              <option value="Horizontal Push">Horizontal Push</option>
              <option value="Horizontal Pull">Horizontal Pull</option>
              <option value="Vertical Push">Vertical Push</option>
              <option value="Vertical Pull">Vertical Pull</option>
              <option value="Squat">Squat</option>
              <option value="Hinge">Hinge</option>
              <option value="Lunge">Lunge</option>
              <option value="Carry">Carry</option>
              <option value="Isolation">Isolation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Floating Compare Drawer */}
      {compareList.length > 0 && (
        <div className="fixed bottom-24 sm:bottom-8 left-1/2 -translate-x-1/2 z-40 bg-slate-950/95 border border-emerald-500/40 rounded-3xl px-6 py-4 shadow-2xl backdrop-blur-xl flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-white">Compare ({compareList.length}/2):</span>
            <div className="flex items-center gap-1.5">
              {compareList.map(e => (
                <span key={e.id} className="px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-300 font-medium">
                  {e.name}
                </span>
              ))}
            </div>
          </div>

          {compareList.length === 2 ? (
            <Link
              href={`/exercises/compare?slug1=${compareList[0].slug}&slug2=${compareList[1].slug}`}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-md shadow-emerald-500/20"
            >
              Compare Now →
            </Link>
          ) : (
            <span className="text-slate-400 italic">Select 1 more exercise</span>
          )}

          <button
            onClick={() => setCompareList([])}
            className="text-slate-400 hover:text-white"
          >
            Clear
          </button>
        </div>
      )}

      {/* Exercises Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-56 rounded-3xl bg-slate-900/40 border border-slate-800 animate-pulse"></div>
          ))}
        </div>
      ) : exercises.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <Dumbbell className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No exercises matched your filters</h3>
          <p className="text-xs text-slate-400">Try loosening your search terms or resetting filters.</p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map(ex => {
            const isComparing = compareList.some(e => e.id === ex.id);
            return (
              <div
                key={ex.id}
                className="glass-card rounded-3xl p-6 space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Tags */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                      {ex.primaryMuscle}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{ex.difficulty}</span>
                  </div>

                  {/* Title & Description */}
                  <Link href={`/exercises/${ex.slug}`}>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {ex.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {ex.description}
                  </p>

                  {/* Equipment & Pattern */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
                    <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300">
                      🔧 {ex.equipment}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-cyan-300">
                      🔄 {ex.movementPattern}
                    </span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => toggleCompare(ex)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isComparing
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white'
                    }`}
                  >
                    {isComparing ? '✓ In Compare' : '+ Compare'}
                  </button>

                  <Link
                    href={`/exercises/${ex.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Form Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
