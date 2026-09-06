'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
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
  Box, 
  Film,
  Play,
  Pause,
  RotateCcw, 
  Scale,
  X,
  Eye,
  SlidersHorizontal,
  Flame,
  Volume2,
  VolumeX
} from 'lucide-react';
import { MUSCLE_GROUPS, EQUIPMENT_LIST } from '@/lib/biomechanics';
import Exercise3DViewer from '@/components/Exercise3DViewer';
import { getExerciseVideoUrl } from '@/lib/exercise-videos';

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

  // 3D & Video Quick Preview Modal States
  const [active3DExercise, setActive3DExercise] = useState<any | null>(null);
  const [activeVideoExercise, setActiveVideoExercise] = useState<any | null>(null);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

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
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Box className="w-3.5 h-3.5" />
              <span>3D Biomechanics</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Film className="w-3.5 h-3.5" />
              <span>Kaggle Video Demos</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Exercise Database & Video Demonstrations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse {total} verified exercises with real Kaggle video demonstrations, interactive 3D anatomy, and kinematic form cues.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/muscles"
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 flex items-center gap-2 transition-all shadow-md"
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>3D Muscle Explorer</span>
          </Link>
        </div>
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
            placeholder="Search exercises by name, keyword, or biomechanical tag (e.g. 'Bench', 'Squat', 'Deadlift')..."
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

      {/* 3D Quick Preview Interactive Modal */}
      {active3DExercise && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Box className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">{active3DExercise.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase">
                  3D Biomechanics
                </span>
              </div>
              <button
                onClick={() => setActive3DExercise(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <Exercise3DViewer
                exerciseName={active3DExercise.name}
                primaryMuscle={active3DExercise.primaryMuscle}
                secondaryMuscles={active3DExercise.secondaryMuscles}
                movementPattern={active3DExercise.movementPattern}
                equipment={active3DExercise.equipment}
                tempo={active3DExercise.tempo}
              />

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-slate-400 line-clamp-1 max-w-lg">
                  {active3DExercise.description}
                </p>
                <Link
                  href={`/exercises/${active3DExercise.slug}`}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 shrink-0"
                >
                  <span>Full Form Guide & Sets</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kaggle Video Demonstration Modal */}
      {activeVideoExercise && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">{activeVideoExercise.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase">
                  Kaggle Video Demo
                </span>
              </div>
              <button
                onClick={() => setActiveVideoExercise(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-inner">
                <video
                  ref={modalVideoRef}
                  src={getExerciseVideoUrl(activeVideoExercise.slug, activeVideoExercise.primaryMuscle, activeVideoExercise.movementPattern)}
                  autoPlay
                  loop
                  muted={isVideoMuted}
                  controls
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-400 font-bold">
                    Primary: {activeVideoExercise.primaryMuscle}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-400 font-semibold">
                    Pattern: {activeVideoExercise.movementPattern}
                  </span>
                </div>

                <Link
                  href={`/exercises/${activeVideoExercise.slug}`}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 shrink-0"
                >
                  <span>View Full Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
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
                key={ex.id || ex.slug}
                className="glass-card rounded-3xl p-6 space-y-4 flex flex-col justify-between group relative border border-slate-800 hover:border-emerald-500/50 transition-all shadow-xl"
              >
                <div className="space-y-3">
                  {/* Badges: Muscle + 3D + Video */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                      {ex.primaryMuscle}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
                        <Box className="w-3 h-3 text-emerald-400" />
                        3D
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[10px] font-black uppercase tracking-wider">
                        <Film className="w-3 h-3 text-cyan-400" />
                        Video
                      </span>
                    </div>
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

                {/* Bottom Actions: 3D View + Watch Video Demo + Compare + Guide */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* 1-Click 3D Quick View */}
                    <button
                      onClick={() => setActive3DExercise(ex)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1 transition-all"
                      title="Inspect interactive 3D model"
                    >
                      <Box className="w-3.5 h-3.5" />
                      <span>3D</span>
                    </button>

                    {/* 1-Click Video Demo Modal */}
                    <button
                      onClick={() => setActiveVideoExercise(ex)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-xs font-bold flex items-center gap-1 transition-all"
                      title="Watch Kaggle workout video demonstration"
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>Video</span>
                    </button>

                    <button
                      onClick={() => toggleCompare(ex)}
                      className={`px-2 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isComparing
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white'
                      }`}
                    >
                      {isComparing ? '✓' : '+'}
                    </button>
                  </div>

                  <Link
                    href={`/exercises/${ex.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Guide</span>
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
