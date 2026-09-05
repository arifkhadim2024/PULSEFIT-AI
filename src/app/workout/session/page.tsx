'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  X, 
  Plus, 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  Dumbbell, 
  Sparkles, 
  Trophy, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  AlertCircle,
  Flame,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '@/lib/sound';
import ExerciseMediaDisplay from '@/components/ExerciseMediaDisplay';

export default function WorkoutSessionPlayerPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading workout player...</div>}>
      <WorkoutSessionPlayerContent />
    </Suspense>
  );
}

function WorkoutSessionPlayerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workoutId = searchParams.get('id') || 'push-day-hypertrophy';

  const [workout, setWorkout] = useState<any>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  // Set-by-set tracker state: mapping exerciseId -> array of sets
  const [setsData, setSetsData] = useState<Record<string, any[]>>({});

  // Active workout timer
  const [sessionSeconds, setSessionSeconds] = useState(0);

  // Rest Timer State
  const [restTimerSeconds, setRestTimerSeconds] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Substitution Modal
  const [replaceModalOpen, setReplaceModalOpen] = useState(false);
  const [allAvailableExercises, setAllAvailableExercises] = useState<any[]>([]);

  // PR Celebration Toast
  const [prToast, setPrToast] = useState<string | null>(null);

  // Finish Summary Modal State
  const [isFinished, setIsFinished] = useState(false);
  const [finishSummary, setFinishSummary] = useState<any | null>(null);
  const [savingSession, setSavingSession] = useState(false);

  // Session clock interval
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Rest timer countdown interval
  useEffect(() => {
    let restInterval: NodeJS.Timeout | null = null;

    if (isResting && restTimerSeconds > 0) {
      restInterval = setInterval(() => {
        setRestTimerSeconds(s => {
          if (s <= 4 && s > 1 && soundEnabled) {
            sounds.playTick();
          }
          if (s === 1) {
            if (soundEnabled) {
              sounds.playTimerDone();
              sounds.vibrate([200, 100, 200]);
            }
            setIsResting(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else if (restTimerSeconds === 0) {
      setIsResting(false);
    }

    return () => {
      if (restInterval) clearInterval(restInterval);
    };
  }, [isResting, restTimerSeconds, soundEnabled]);

  // Load Workout and Sets
  useEffect(() => {
    fetch(`/api/workouts/${workoutId}`)
      .then(res => res.json())
      .then(data => {
        if (data.workout) {
          setWorkout(data.workout);
          const exList = data.workout.exercises?.map((we: any) => we.exercise) || [];
          setExercises(exList);

          // Initialize default sets for each exercise
          const initialSets: Record<string, any[]> = {};
          data.workout.exercises?.forEach((we: any) => {
            const count = we.targetSets || 3;
            initialSets[we.exercise.id] = Array.from({ length: count }, (_, i) => ({
              setNumber: i + 1,
              weightKg: 60,
              reps: 10,
              rpe: 8.0,
              completed: false,
              isPR: false,
            }));
          });
          setSetsData(initialSets);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Also fetch available exercises for replace modal
    fetch('/api/exercises?limit=120')
      .then(res => res.json())
      .then(data => setAllAvailableExercises(data.exercises || []))
      .catch(() => {});
  }, [workoutId]);

  const currentExercise = exercises[currentExerciseIdx];
  const currentSets = (currentExercise && setsData[currentExercise.id]) || [];

  const updateSet = (exerciseId: string, setIdx: number, field: string, val: any) => {
    const updatedSets = { ...setsData };
    const list = [...(updatedSets[exerciseId] || [])];
    list[setIdx] = { ...list[setIdx], [field]: val };
    updatedSets[exerciseId] = list;
    setSetsData(updatedSets);
  };

  const handleCompleteSet = (setIdx: number) => {
    if (!currentExercise) return;
    const isAlreadyCompleted = currentSets[setIdx]?.completed;

    if (!isAlreadyCompleted) {
      updateSet(currentExercise.id, setIdx, 'completed', true);
      if (soundEnabled) {
        sounds.playSuccess();
        sounds.vibrate(150);
      }

      // Start rest timer (e.g. 90 seconds)
      setRestTimerSeconds(90);
      setIsResting(true);
    } else {
      updateSet(currentExercise.id, setIdx, 'completed', false);
    }
  };

  const addSet = () => {
    if (!currentExercise) return;
    const updatedSets = { ...setsData };
    const list = [...(updatedSets[currentExercise.id] || [])];
    const lastSet = list[list.length - 1] || { weightKg: 60, reps: 10, rpe: 8.0 };
    list.push({
      setNumber: list.length + 1,
      weightKg: lastSet.weightKg,
      reps: lastSet.reps,
      rpe: lastSet.rpe,
      completed: false,
      isPR: false,
    });
    updatedSets[currentExercise.id] = list;
    setSetsData(updatedSets);
  };

  const removeSet = (setIdx: number) => {
    if (!currentExercise) return;
    const updatedSets = { ...setsData };
    const list = (updatedSets[currentExercise.id] || []).filter((_, i) => i !== setIdx);
    updatedSets[currentExercise.id] = list.map((s, idx) => ({ ...s, setNumber: idx + 1 }));
    setSetsData(updatedSets);
  };

  const replaceCurrentExercise = (newEx: any) => {
    const updatedExercises = [...exercises];
    updatedExercises[currentExerciseIdx] = newEx;
    setExercises(updatedExercises);

    // Copy sets over
    const updatedSets = { ...setsData };
    updatedSets[newEx.id] = updatedSets[currentExercise.id] || [
      { setNumber: 1, weightKg: 50, reps: 10, rpe: 8.0, completed: false },
    ];
    setSetsData(updatedSets);
    setReplaceModalOpen(false);
  };

  const handleFinishWorkout = async () => {
    setSavingSession(true);

    // Prepare payload of all completed sets
    const allSetsPayload: any[] = [];
    exercises.forEach(ex => {
      const sets = setsData[ex.id] || [];
      sets.forEach(s => {
        if (s.completed) {
          allSetsPayload.push({
            exerciseId: ex.id,
            exerciseName: ex.name,
            setNumber: s.setNumber,
            weightKg: s.weightKg,
            reps: s.reps,
            rpe: s.rpe,
            completed: true,
          });
        }
      });
    });

    if (allSetsPayload.length === 0) {
      alert('Please complete at least 1 set before finishing the workout.');
      setSavingSession(false);
      return;
    }

    try {
      const res = await fetch('/api/workouts/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workoutId: workout?.id,
          workoutName: workout?.name || 'Live Workout Session',
          durationMinutes: Math.max(1, Math.round(sessionSeconds / 60)),
          sets: allSetsPayload,
        }),
      });

      const data = await res.json();
      if (data.summary) {
        setFinishSummary(data.summary);
        setIsFinished(true);
        if (soundEnabled) sounds.playSuccess();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error('Failed to log workout:', err);
    } finally {
      setSavingSession(false);
    }
  };

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading || !currentExercise) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <RotateCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
        <h2 className="text-xl font-bold text-white">Initializing Workout Engine...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. TOP STATUS BAR */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <Link
            href="/workouts"
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Exit Workout"
          >
            <X className="w-4 h-4" />
          </Link>
          <div>
            <h3 className="font-bold text-sm text-white truncate max-w-[160px] sm:max-w-xs">
              {workout?.name}
            </h3>
            <span className="text-[11px] text-slate-400">
              Exercise {currentExerciseIdx + 1} of {exercises.length}
            </span>
          </div>
        </div>

        {/* Live Duration & Sound */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs font-bold text-emerald-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(sessionSeconds)}</span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={handleFinishWorkout}
            disabled={savingSession}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-emerald-500/20"
          >
            {savingSession ? 'Saving...' : 'Finish Workout'}
          </button>
        </div>
      </div>

      {/* 2. ACTIVE REST TIMER BANNER */}
      {isResting && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950/90 via-slate-900 to-slate-900 border border-emerald-500/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse-slow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
              <Clock className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                Rest & Muscle Recovery Interval
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                {formatTime(restTimerSeconds)}
              </span>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[30, 60, 90, 120, 180].map(sec => (
              <button
                key={sec}
                onClick={() => setRestTimerSeconds(sec)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  restTimerSeconds === sec
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {sec >= 60 ? `${sec / 60}m` : `${sec}s`}
              </button>
            ))}
            <button
              onClick={() => setRestTimerSeconds(s => s + 30)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-emerald-400 text-xs font-bold hover:bg-slate-700"
            >
              +30s
            </button>
            <button
              onClick={() => setIsResting(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-rose-400 text-xs font-bold"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* 3. MAIN WORKOUT PLAYER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Exercise Media & Form Cues */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase">
                {currentExercise.primaryMuscle}
              </span>
              <button
                onClick={() => setReplaceModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-cyan-400 text-xs font-bold border border-slate-700 transition-colors"
              >
                🔄 Replace Exercise
              </button>
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">{currentExercise.name}</h2>
              <p className="text-xs text-slate-400 mt-1">{currentExercise.instructions}</p>
            </div>

            {/* Media Viewer */}
            <ExerciseMediaDisplay
              exerciseName={currentExercise.name}
              primaryMuscle={currentExercise.primaryMuscle}
              mediaList={currentExercise.media || []}
              movementPattern={currentExercise.movementPattern}
              tempo={currentExercise.tempo}
            />

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span>Cadence: <strong className="text-emerald-400 font-mono">{currentExercise.tempo || '3-0-1-0'}</strong></span>
              <span>Equipment: <strong className="text-slate-200">{currentExercise.equipment}</strong></span>
            </div>
          </div>
        </div>

        {/* Right Column: Sets / Reps Logger Table */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-emerald-400" />
                <span>Working Sets Logger</span>
              </h4>
              <span className="text-xs text-slate-400 font-mono">
                {currentSets.filter((s: any) => s.completed).length} / {currentSets.length} Completed
              </span>
            </div>

            {/* Sets Table Header */}
            <div className="grid grid-cols-12 gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
              <div className="col-span-2">Set</div>
              <div className="col-span-3">Weight (kg)</div>
              <div className="col-span-3">Reps</div>
              <div className="col-span-2">RPE</div>
              <div className="col-span-2 text-center">Done</div>
            </div>

            {/* Set Rows */}
            <div className="space-y-2">
              {currentSets.map((set: any, sIdx: number) => (
                <div
                  key={sIdx}
                  className={`grid grid-cols-12 gap-2 items-center p-2.5 rounded-2xl border transition-all ${
                    set.completed
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="col-span-2 font-mono font-bold text-xs text-slate-300 pl-1">
                    #{set.setNumber}
                  </div>

                  <div className="col-span-3">
                    <input
                      type="number"
                      step="0.5"
                      value={set.weightKg}
                      onChange={e => updateSet(currentExercise.id, sIdx, 'weightKg', parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs font-mono font-bold text-white text-center focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="col-span-3">
                    <input
                      type="number"
                      value={set.reps}
                      onChange={e => updateSet(currentExercise.id, sIdx, 'reps', parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs font-mono font-bold text-white text-center focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      step="0.5"
                      min="6"
                      max="10"
                      value={set.rpe || 8.0}
                      onChange={e => updateSet(currentExercise.id, sIdx, 'rpe', parseFloat(e.target.value) || 8.0)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-1.5 py-2 text-xs font-mono text-slate-300 text-center focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="col-span-2 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleCompleteSet(sIdx)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black transition-all ${
                        set.completed
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                          : 'bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Set Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={addSet}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-emerald-400 font-bold text-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Set</span>
              </button>

              {currentSets.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSet(currentSets.length - 1)}
                  className="text-xs text-slate-400 hover:text-rose-400"
                >
                  Remove Last Set
                </button>
              )}
            </div>
          </div>

          {/* Exercise Navigation Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              disabled={currentExerciseIdx === 0}
              onClick={() => setCurrentExerciseIdx(i => Math.max(0, i - 1))}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 font-bold text-xs border border-slate-800 flex items-center justify-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Exercise</span>
            </button>

            {currentExerciseIdx < exercises.length - 1 ? (
              <button
                onClick={() => setCurrentExerciseIdx(i => Math.min(exercises.length - 1, i + 1))}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <span>Next Exercise</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinishWorkout}
                disabled={savingSession}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/30"
              >
                <span>Finish Workout</span>
                <Trophy className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. REPLACE EXERCISE MODAL */}
      {replaceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="font-bold text-base text-white">Substitute Exercise</h4>
                <p className="text-xs text-slate-400">Targeting {currentExercise.primaryMuscle}</p>
              </div>
              <button
                onClick={() => setReplaceModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {allAvailableAvailable(allAvailableExercises, currentExercise.primaryMuscle).map(ex => (
                <div
                  key={ex.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{ex.name}</span>
                    <span className="text-[10px] text-slate-400">{ex.equipment} • {ex.difficulty}</span>
                  </div>
                  <button
                    onClick={() => replaceCurrentExercise(ex)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. FINISH WORKOUT SUMMARY CELEBRATION MODAL */}
      {isFinished && finishSummary && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5 mx-auto shadow-xl shadow-emerald-500/25">
              <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-emerald-400">
                <Trophy className="w-8 h-8" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
                Session Complete
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">Outstanding Work!</h3>
              <p className="text-xs text-slate-400">
                Workout logged to your permanent analytics vault.
              </p>
            </div>

            {/* Key Summary Metrics */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Volume</span>
                <span className="text-lg font-black text-emerald-400 font-mono">
                  {finishSummary.totalVolumeKg} kg
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Sets</span>
                <span className="text-lg font-black text-white font-mono">
                  {finishSummary.totalSets}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Duration</span>
                <span className="text-lg font-black text-cyan-400 font-mono">
                  {finishSummary.durationMinutes} mins
                </span>
              </div>
            </div>

            {/* XP Gained & Level Progress */}
            <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-purple-300">XP Gained</span>
                <span className="text-purple-400 font-mono">+{finishSummary.xpEarned} XP</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-amber-300">Workout Streak</span>
                <span className="text-amber-400 font-mono">🔥 {finishSummary.newStreak} Days</span>
              </div>
            </div>

            {/* PRs Detected */}
            {finishSummary.prs?.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs space-y-2">
                <span className="font-bold text-amber-400 uppercase tracking-wider block">
                  🎉 New Personal Record Achieved!
                </span>
                {finishSummary.prs.map((pr: any, idx: number) => (
                  <p key={idx} className="text-white font-medium">
                    {pr.exerciseName}: <strong className="text-amber-300 font-mono">{pr.value}</strong>
                  </p>
                ))}
              </div>
            )}

            <button
              onClick={() => {
                router.push('/dashboard');
                router.refresh();
              }}
              className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition-all"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function allAvailableAvailable(all: any[], muscle: string) {
  const filtered = all.filter(e => e.primaryMuscle === muscle);
  return filtered.length > 0 ? filtered : all.slice(0, 10);
}
