'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  RotateCw, 
  Flame, 
  Clock, 
  Dumbbell, 
  ShieldCheck, 
  Play, 
  Save,
  Zap
} from 'lucide-react';
import { MUSCLE_GROUPS } from '@/lib/biomechanics';

export default function AIWorkoutGeneratorPage() {
  const router = useRouter();

  // Step state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Form State
  const [goal, setGoal] = useState('muscle_building');
  const [fitnessLevel, setFitnessLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [equipment, setEquipment] = useState<'full_gym' | 'dumbbells_only' | 'bodyweight_home' | 'resistance_bands'>('full_gym');
  const [targetMuscles, setTargetMuscles] = useState<string[]>([]);
  const [avoidInjuries, setAvoidInjuries] = useState<string>('');

  // Results State
  const [loading, setLoading] = useState(false);
  const [generatedProgram, setGeneratedProgram] = useState<any | null>(null);

  const toggleMuscle = (muscle: string) => {
    if (targetMuscles.includes(muscle)) {
      setTargetMuscles(targetMuscles.filter(m => m !== muscle));
    } else {
      setTargetMuscles([...targetMuscles, muscle]);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/workouts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          fitnessLevel,
          daysPerWeek,
          durationMinutes,
          equipment,
          targetMuscles,
          avoidMusclesOrInjuries: avoidInjuries ? [avoidInjuries] : [],
        }),
      });

      const data = await res.json();
      if (data.program) {
        setGeneratedProgram(data.program);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <Sparkles className="w-5 h-5" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            AI Training Program Architect
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          Personalized periodization engineered via scientific biomechanics heuristics and volume loading curves.
        </p>
      </div>

      {!generatedProgram ? (
        /* Questionnaire Wizard */
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 space-y-8 shadow-2xl">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Step {currentStep} of {totalSteps}</span>
              <span className="text-emerald-400">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* STEP 1: Goal & Experience */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">1. Select Your Primary Training Objective</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'muscle_building', title: 'Muscle Hypertrophy', desc: 'Maximum muscle mass and aesthetic symmetry (8-12 rep ranges).' },
                  { id: 'strength', title: 'Raw Strength & Power', desc: 'Compound overload (Squat, Bench, Deadlift 5x5/3x5 schemes).' },
                  { id: 'fat_loss', title: 'Fat Loss & Density', desc: 'High metabolic output and short rest intervals for fat reduction.' },
                  { id: 'athletic', title: 'Athletic Conditioning', desc: 'Explosive power, rotational stability, and movement durability.' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGoal(item.id)}
                    className={`p-5 rounded-2xl text-left border transition-all ${
                      goal === item.id
                        ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-lg shadow-emerald-500/15'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <h4 className="font-bold text-sm text-white mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </button>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Current Training Experience
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'beginner', label: 'Beginner (0-1 yr)' },
                    { id: 'intermediate', label: 'Intermediate (1-3 yrs)' },
                    { id: 'advanced', label: 'Advanced (3+ yrs)' },
                  ].map(lvl => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setFitnessLevel(lvl.id as any)}
                      className={`py-3 px-2 rounded-xl text-xs font-bold transition-all ${
                        fitnessLevel === lvl.id
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Schedule & Time */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">2. Available Frequency & Time</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Training Days Per Week</span>
                  <span className="text-emerald-400 font-mono text-base">{daysPerWeek} Days</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {[2, 3, 4, 5, 6].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDaysPerWeek(d)}
                      className={`py-3 rounded-xl text-xs font-bold transition-all ${
                        daysPerWeek === d
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {d} Days
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Target Workout Duration</span>
                  <span className="text-cyan-400 font-mono text-base">{durationMinutes} Minutes</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[30, 45, 60].map(mins => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDurationMinutes(mins)}
                      className={`py-3 rounded-xl text-xs font-bold transition-all ${
                        durationMinutes === mins
                          ? 'bg-cyan-500 text-slate-950 font-black'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {mins} mins
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Equipment Access */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">3. Available Equipment</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'full_gym', title: 'Commercial Gym', desc: 'Barbells, dumbbells, cables, power racks, and pin machines.' },
                  { id: 'dumbbells_only', title: 'Dumbbells & Bench', desc: 'Home gym setup with adjustable dumbbells and bench.' },
                  { id: 'bodyweight_home', title: 'Calisthenics & Bodyweight', desc: 'Pull-up bar, floor mat, and dips.' },
                  { id: 'resistance_bands', title: 'Resistance Bands', desc: 'Loop bands and anchor handles.' },
                ].map(eq => (
                  <button
                    key={eq.id}
                    type="button"
                    onClick={() => setEquipment(eq.id as any)}
                    className={`p-5 rounded-2xl text-left border transition-all ${
                      equipment === eq.id
                        ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-lg shadow-emerald-500/15'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <h4 className="font-bold text-sm text-white mb-1">{eq.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{eq.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Target Muscles & Limitations */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">4. Focus Muscles & Joint Safety</h3>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Priority Muscles to Emphasize (Optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {MUSCLE_GROUPS.map(m => {
                    const isSelected = targetMuscles.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => toggleMuscle(m.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{m.id}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Joint Concerns or Movements to Avoid (e.g. &quot;No heavy spinal loading / lower back pain&quot;)
                </label>
                <input
                  type="text"
                  value={avoidInjuries}
                  onChange={e => setAvoidInjuries(e.target.value)}
                  placeholder="e.g. Mild shoulder impingement, avoid upright barbell rows"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Wizard Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs"
              >
                Previous
              </button>
            ) : <div></div>}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={handleGenerate}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-50 text-slate-950 font-black text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/25 hover:scale-105 transition-all"
              >
                {loading ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Architecting Custom Split...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Training Routine</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* GENERATED WORKOUT DISPLAY */
        <div className="space-y-8">
          {/* Header Summary */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-emerald-500/40 space-y-4 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                ✓ AI Program Generated
              </span>
              <button
                onClick={() => setGeneratedProgram(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:text-white"
              >
                Adjust Parameters & Regenerate
              </button>
            </div>

            <h2 className="text-3xl font-black text-white tracking-tight">
              {generatedProgram.programName}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {generatedProgram.summary}
            </p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs text-slate-300">
              <strong className="text-emerald-400 font-bold block">Scientific Progression Protocol:</strong>
              <p className="leading-relaxed">{generatedProgram.progressionTip}</p>
            </div>
          </div>

          {/* Days Schedule */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Weekly Training Schedule</h3>
            {generatedProgram.weeklySchedule?.map((day: any, idx: number) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-lg font-bold text-white">{day.dayName}</h4>
                    <span className="text-xs text-emerald-400 font-semibold">{day.focus}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-950 text-slate-300 text-xs font-mono border border-slate-800">
                    Day {idx + 1}
                  </span>
                </div>

                {/* Warmup */}
                {day.warmup?.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1 text-slate-300">
                    <span className="text-amber-400 font-bold block text-[11px] uppercase">
                      Dynamic Warmup (5-8 mins):
                    </span>
                    <p>{day.warmup.join(' • ')}</p>
                  </div>
                )}

                {/* Exercise List */}
                <div className="space-y-3">
                  {day.exercises?.map((ex: any, eIdx: number) => (
                    <div
                      key={eIdx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-850 border border-slate-800 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px]">
                            {eIdx + 1}
                          </span>
                          <strong className="text-white text-sm font-bold">{ex.name}</strong>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                            {ex.primaryMuscle}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px] italic pl-7">{ex.notes}</p>
                      </div>

                      <div className="flex items-center gap-3 font-mono text-slate-200 pl-7 sm:pl-0 shrink-0">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
                          {ex.sets} Sets × {ex.reps}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                          {ex.restSec}s Rest
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400">
                          {ex.tempo}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Link
              href="/workouts"
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs"
            >
              Back to Workout Hub
            </Link>
            <Link
              href="/workout/session?id=push-day-hypertrophy"
              className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/25"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Day 1 in Workout Player</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
