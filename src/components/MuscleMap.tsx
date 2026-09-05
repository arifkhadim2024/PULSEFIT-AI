'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, RotateCw } from 'lucide-react';

interface MuscleMapProps {
  selectedMuscle?: string;
  onSelectMuscle?: (muscle: string) => void;
  interactiveRedirect?: boolean;
}

export const MUSCLE_DETAILS: Record<string, { name: string; region: 'front' | 'back'; desc: string; mainMoves: string[] }> = {
  Chest: {
    name: 'Chest (Pectoralis Major & Minor)',
    region: 'front',
    desc: 'Primary pushing muscles responsible for horizontal adduction, flexion, and internal rotation of the humerus.',
    mainMoves: ['Barbell Bench Press', 'Incline Dumbbell Press', 'Cable Chest Fly', 'Dips']
  },
  Shoulders: {
    name: 'Shoulders (Deltoids - Front, Side, Rear)',
    region: 'front',
    desc: 'Three distinct heads responsible for arm abduction, flexion, overhead pressing, and external rotation.',
    mainMoves: ['Overhead Press', 'Lateral Raise', 'Face Pull', 'Arnold Press']
  },
  Biceps: {
    name: 'Biceps Brachii',
    region: 'front',
    desc: 'Two-headed flexor of the elbow and powerful supinator of the forearm.',
    mainMoves: ['Barbell Curl', 'Incline Dumbbell Curl', 'Preacher Curl', 'Hammer Curl']
  },
  Triceps: {
    name: 'Triceps Brachii',
    region: 'back',
    desc: 'Three-headed extensor of the elbow joint accounting for roughly 60% of total upper arm volume.',
    mainMoves: ['Close-Grip Bench Press', 'Rope Pushdown', 'Skull Crushers', 'Dips']
  },
  Back: {
    name: 'Back (Latissimus Dorsi & Rhomboids)',
    region: 'back',
    desc: 'Broad muscle groups responsible for pulling the arms downward, backward, and stabilizing the spine.',
    mainMoves: ['Conventional Deadlift', 'Pull-Ups', 'Barbell Row', 'Lat Pulldown']
  },
  Traps: {
    name: 'Trapezius (Upper, Middle, Lower)',
    region: 'back',
    desc: 'Kite-shaped muscle elevating, retracting, and depressing the shoulder blades.',
    mainMoves: ['Barbell Shrug', 'Dumbbell Shrug', 'Face Pull', 'Kelso Shrug']
  },
  Abs: {
    name: 'Abs & Core (Rectus Abdominis & Obliques)',
    region: 'front',
    desc: 'Central muscular corset stabilizing the lumbar spine, resisting spinal extension, and flexing the torso.',
    mainMoves: ['Hanging Leg Raise', 'Cable Crunch', 'Ab Wheel Rollout', 'Plank']
  },
  Forearms: {
    name: 'Forearms & Grip',
    region: 'front',
    desc: 'Wrist flexors and extensors governing grip endurance, crushing power, and forearm thickness.',
    mainMoves: ['Farmer\'s Walk', 'Barbell Wrist Curl', 'Reverse Curl', 'Dead Hang']
  },
  Quadriceps: {
    name: 'Quadriceps (Femoris, Vastus Lateralis/Medialis)',
    region: 'front',
    desc: 'Four large muscles on front of the thigh extending the knee and flexing the hip.',
    mainMoves: ['Barbell Back Squat', 'Bulgarian Split Squat', 'Leg Press', 'Hack Squat']
  },
  Hamstrings: {
    name: 'Hamstrings (Biceps Femoris, Semitendinosus)',
    region: 'back',
    desc: 'Posterior thigh muscles responsible for knee flexion and powerful hip extension during hinges.',
    mainMoves: ['Romanian Deadlift', 'Seated Leg Curl', 'Lying Leg Curl', 'Nordic Curl']
  },
  Glutes: {
    name: 'Glutes (Maximus, Medius, Minimus)',
    region: 'back',
    desc: 'The largest and most powerful muscle group in the human body driving hip extension and rotation.',
    mainMoves: ['Barbell Hip Thrust', 'Bulgarian Split Squat', 'Glute Kickback', 'Sumo Squat']
  },
  Calves: {
    name: 'Calves (Gastrocnemius & Soleus)',
    region: 'back',
    desc: 'Lower leg muscles driving ankle plantarflexion for jumping, sprinting, and stabilization.',
    mainMoves: ['Standing Calf Raise', 'Seated Calf Raise', 'Leg Press Calf Raise', 'Tibialis Raise']
  },
  'Lower Back': {
    name: 'Lower Back (Erector Spinae)',
    region: 'back',
    desc: 'Deep spinal erectors maintaining upright spinal posture and resisting shear loads.',
    mainMoves: ['Back Extension', 'Bird-Dog', 'Jefferson Curl', 'Deadlift']
  },
  Adductors: {
    name: 'Inner Thighs (Adductors)',
    region: 'front',
    desc: 'Inner thigh muscles pulling legs toward midline and stabilizing the pelvis during deep squats.',
    mainMoves: ['Seated Adduction Machine', 'Copenhagen Plank', 'Cossack Squat']
  },
  Abductors: {
    name: 'Outer Hips (Abductors & Glute Medius)',
    region: 'front',
    desc: 'Outer hip musculature preventing knee collapse and stabilizing single-leg balance.',
    mainMoves: ['Standing Cable Abduction', 'Side-Lying Clamshell', 'Lateral Band Walk']
  }
};

export default function MuscleMap({ selectedMuscle, onSelectMuscle, interactiveRedirect = true }: MuscleMapProps) {
  const [view, setView] = useState<'front' | 'back'>('front');
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);

  const activeMuscle = hoveredMuscle || selectedMuscle || (view === 'front' ? 'Chest' : 'Back');
  const muscleInfo = MUSCLE_DETAILS[activeMuscle] || MUSCLE_DETAILS['Chest'];

  const handleMuscleClick = (muscle: string) => {
    if (onSelectMuscle) {
      onSelectMuscle(muscle);
    }
  };

  const isHighlighted = (muscle: string) => {
    return (hoveredMuscle === muscle) || (selectedMuscle === muscle);
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl">
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Biomechanics Engine</span>
          </div>
          <h3 className="text-2xl font-bold text-white mt-1">Anatomical Muscle Explorer</h3>
          <p className="text-sm text-slate-400">Click any muscle group to explore targeted biomechanical exercises.</p>
        </div>

        {/* Front / Back Toggle */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-full border border-slate-800">
          <button
            onClick={() => setView('front')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
              view === 'front'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Anterior (Front)
          </button>
          <button
            onClick={() => setView('back')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
              view === 'back'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Posterior (Back)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Anatomical SVG Canvas */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative min-h-[420px] bg-slate-950/60 rounded-2xl border border-slate-800/60 p-4">
          <svg
            viewBox="0 0 300 480"
            className="w-full max-w-[280px] h-[400px] select-none filter drop-shadow-[0_0_15px_rgba(16,185,129,0.15)]"
          >
            <defs>
              <linearGradient id="bodyBase" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id="muscleActiveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Head & Neck Base */}
            <circle cx="150" cy="45" r="24" fill="url(#bodyBase)" stroke="#334155" strokeWidth="1.5" />
            <path d="M 140 68 L 140 85 L 160 85 L 160 68 Z" fill="url(#bodyBase)" stroke="#334155" />

            {view === 'front' ? (
              /* ANTERIOR (FRONT) VIEW */
              <g className="cursor-pointer transition-all duration-300">
                {/* Traps Front */}
                <path
                  d="M 135 75 Q 150 82 165 75 L 175 90 L 125 90 Z"
                  fill={isHighlighted('Traps') ? 'url(#muscleActiveGrad)' : '#1e293b'}
                  stroke={isHighlighted('Traps') ? '#10b981' : '#334155'}
                  strokeWidth="1.5"
                  onMouseEnter={() => setHoveredMuscle('Traps')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => handleMuscleClick('Traps')}
                />

                {/* Shoulders (Delts Front) */}
                <path
                  d="M 115 90 C 100 95 95 115 102 130 C 108 135 118 128 122 110 Z"
                  fill={isHighlighted('Shoulders') ? 'url(#muscleActiveGrad)' : '#1e293b'}
                  stroke={isHighlighted('Shoulders') ? '#10b981' : '#334155'}
                  strokeWidth="1.5"
                  onMouseEnter={() => setHoveredMuscle('Shoulders')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => handleMuscleClick('Shoulders')}
                />
                <path
                  d="M 185 90 C 200 95 205 115 198 130 C 192 135 182 128 178 110 Z"
                  fill={isHighlighted('Shoulders') ? 'url(#muscleActiveGrad)' : '#1e293b'}
                  stroke={isHighlighted('Shoulders') ? '#10b981' : '#334155'}
                  strokeWidth="1.5"
                  onMouseEnter={() => setHoveredMuscle('Shoulders')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => handleMuscleClick('Shoulders')}
                />

                {/* Chest (Pectorals) */}
                <path
                  d="M 124 92 C 148 95 150 110 150 135 C 135 140 120 135 118 120 Z"
                  fill={isHighlighted('Chest') ? 'url(#muscleActiveGrad)' : '#1e293b'}
                  stroke={isHighlighted('Chest') ? '#10b981' : '#334155'}
                  strokeWidth="1.5"
                  filter={isHighlighted('Chest') ? 'url(#glowEffect)' : undefined}
                  onMouseEnter={() => setHoveredMuscle('Chest')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => handleMuscleClick('Chest')}
                />
                <path
                  d="M 176 92 C 152 95 150 110 150 135 C 165 140 180 135 182 120 Z"
                  fill={isHighlighted('Chest') ? 'url(#muscleActiveGrad)' : '#1e293b'}
                  stroke={isHighlighted('Chest') ? '#10b981' : '#334155'}
                  strokeWidth="1.5"
                  filter={isHighlighted('Chest') ? 'url(#glowEffect)' : undefined}
                  onMouseEnter={() => setHoveredMuscle('Chest')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => handleMuscleClick('Chest')}
                />

                {/* Biceps */}
                <path
                  d="M 100 132 C 92 145 92 170 102 180 C 108 175 112 155 108 135 Z"
                  fill={isHighlighted('Biceps') ? 'url(#muscleActiveGrad)' : '#1e293b'}
                  stroke={isHighlighted('Biceps') ? '#10b981' : '#334155'}
                  strokeWidth="1.5"
                  onMouseEnter={() => setHoveredMuscle('Biceps')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => handleMuscleClick('Biceps')}
                />
                <path
                  d="M 200 132 C 208 145 208 170 198 180 C 192 175 188 155 192 135 Z"
                  fill={isHighlighted('Biceps') ? 'url(#muscleActiveGrad)' : '#1e293b'}
                  stroke={isHighlighted('Biceps') ? '#10b981' : '#334155'}
                  strokeWidth="1.5"
                  onMouseEnter={() => setHoveredMuscle('Biceps')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => handleMuscleClick('Biceps')}
                />

                {/* Forearms */}
                <path
                  d="M 98 185 C 88 200 85 230 92 245 C 98 245 105 220 106 185 Z"
                  fill={isHighlighted('Forearms') ? 'url(#muscleActiveGrad)' : '#1e293b'}
                  stroke={isHighlighted('Forearms') ? '#10b981' : '#334155'}
                  strokeWidth="1.5"
                  onMouseEnter={() => setHoveredMuscle('Forearms')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => handleMuscleClick('Forearms')}
                />
                <path
                  d="M 202 185 C 212 200 215 230 208 245 C 202 245 195 220 194 185 Z"
                  fill={isHighlighted('Forearms') ? 'url(#muscleActiveGrad)' : '#1e293b'}
                  stroke={isHighlighted('Forearms') ? '#10b981' : '#334155'}
                  strokeWidth="1.5"
                  onMouseEnter={() => setHoveredMuscle('Forearms')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => handleMuscleClick('Forearms')}
                />

                {/* Abs & Core */}
                <path
                  d="M 132 142 L 168 142 L 166 215 L 134 215 Z"
                  fill={isHighlighted('Abs') ? 'url(#muscleActiveGrad)' : '#1e293b'}
                  stroke={isHighlighted('Abs') ? '#10b981' : '#334155'}
                  strokeWidth="1.5"
                  filter={isHighlighted('Abs') ? 'url(#glowEffect)' : undefined}
                  onMouseEnter={() => setHoveredMuscle('Abs')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => handleMuscleClick('Abs')}
                />

                {/* Quadriceps */}
                <path
                  d="M 125 225 C 110 245 110 300 120 330 C 135 330 144 280 144 225 Z"
                  fill={isHighlighted('Quadriceps') ? 'url(#muscleActiveGrad)' : '#1e293b'}
                  stroke={isHighlighted('Quadriceps') ? '#10b981' : '#334155'}
                  strokeWidth="1.5"
                  onMouseEnter={() => setHoveredMuscle('Quadriceps')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => handleMuscleClick('Quadriceps')}
                />
                <path
                  d="M 175 225 C 190 245 190 300 180 330 C 165 330 156 280 156 225 Z"
                  fill={isHighlighted('Quadriceps') ? 'url(#muscleActiveGrad)' : '#1e293b'}
                  stroke={isHighlighted('Quadriceps') ? '#10b981' : '#334155'}
                  strokeWidth="1.5"
                  onMouseEnter={() => setHoveredMuscle('Quadriceps')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => handleMuscleClick('Quadriceps')}
                />

                {/* Adductors (Inner Thighs) */}
                <path
                  d="M 144 235 L 156 235 L 152 290 L 148 290 Z"
                  fill={isHighlighted('Adductors') ? 'url(#muscleActiveGrad)' : '#1e293b'}
                  stroke={isHighlighted('Adductors') ? '#10b981' : '#334155'}
                  strokeWidth="1"
                  onMouseEnter={() => setHoveredMuscle('Adductors')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => handleMuscleClick('Adductors')}
                />

                {/* Calves / Shins Front */}
                <path
                  d="M 120 340 C 114 360 115 410 125 435 C 132 430 136 390 134 340 Z"
                  fill={isHighlighted('Calves') ? 'url(#muscleActiveGrad)' : '#1e293b'}
                  stroke={isHighlighted('Calves') ? '#10b981' : '#334155'}
                  strokeWidth="1.5"
                  onMouseEnter={() => setHoveredMuscle('Calves')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => handleMuscleClick('Calves')}
                />
                <path
                  d="M 180 340 C 186 360 185 410 175 435 C 168 430 164 390 166 340 Z"
                  fill={isHighlighted('Calves') ? 'url(#muscleActiveGrad)' : '#1e293b'}
                  stroke={isHighlighted('Calves') ? '#10b981' : '#334155'}
                  strokeWidth="1.5"
                  onMouseEnter={() => setHoveredMuscle('Calves')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => handleMuscleClick('Calves')}
                />
              </g>
            ) : (
              /* POSTERIOR (BACK) VIEW */
              <g className="cursor-pointer transition-all duration-300">
                {/* Upper Traps */}
                <path
                  d="M 130 75 L 170 75 L 180 105 L 150 120 L 120 105 Z"
                  fill={isHighlighted('Traps') ? 'url(#muscleActiveGrad)' : '#1e293b'}
                  stroke={isHighlighted('Traps') ? '#10b981' : '#334155'}
                  strokeWidth="1.5"
                  onMouseEnter={() => setHoveredMuscle('Traps')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => handleMuscleClick('Traps')}
                />

                {/* Back (Lats & Rhomboids) */}
                <path
                  d="M 120 106 L 150 121 L 180 106 L 175 160 C 160 175 140 175 125 160 Z"
                  fill={isHighlighted('Back') ? 'url(#muscleActiveGrad)' : '#1e293b'}
                  stroke={isHighlighted('Back') ? '#10b981' : '#334155'}
                  strokeWidth="1.5"
                  filter={isHighlighted('Back') ? 'url(#glowEffect)' : undefined}
                  onMouseEnter={() => setHoveredMuscle('Back')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => handleMuscleClick('Back')}
                />

                {/* Triceps */}
                <path
                  d="M 98 115 C 90 130 90 160 100 175 C 106 170 110 145 106 120 Z"
                  fill={isHighlighted('Triceps') ? 'url(#muscleActiveGrad)' : '#1e293b'}
                  stroke={isHighlighted('Triceps') ? '#10b981' : '#334155'}
                  strokeWidth="1.5"
                  onMouseEnter={() => setHoveredMuscle('Triceps')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => handleMuscleClick('Triceps')}
                />
                <path
                  d="M 202 115 C 210 130 210 160 200 175 C 194 170 190 145 194 120 Z"
                  fill={isHighlighted('Triceps') ? 'url(#muscleActiveGrad)' : '#1e293b'}
                  stroke={isHighlighted('Triceps') ? '#10b981' : '#334155'}
                  strokeWidth="1.5"
                  onMouseEnter={() => setHoveredMuscle('Triceps')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => handleMuscleClick('Triceps')}
                />

                {/* Lower Back (Erectors) */}
                <path
                  d="M 132 165 L 168 165 L 165 205 L 135 205 Z"
                  fill={isHighlighted('Lower Back') ? 'url(#muscleActiveGrad)' : '#1e293b'}
                  stroke={isHighlighted('Lower Back') ? '#10b981' : '#334155'}
                  strokeWidth="1.5"
                  onMouseEnter={() => setHoveredMuscle('Lower Back')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => handleMuscleClick('Lower Back')}
                />

                {/* Glutes */}
                <path
                  d="M 125 206 C 112 215 110 245 125 258 C 145 258 150 225 150 206 Z"
                  fill={isHighlighted('Glutes') ? 'url(#muscleActiveGrad)' : '#1e293b'}
                  stroke={isHighlighted('Glutes') ? '#10b981' : '#334155'}
                  strokeWidth="1.5"
                  filter={isHighlighted('Glutes') ? 'url(#glowEffect)' : undefined}
                  onMouseEnter={() => setHoveredMuscle('Glutes')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => handleMuscleClick('Glutes')}
                />
                <path
                  d="M 175 206 C 188 215 190 245 175 258 C 155 258 150 225 150 206 Z"
                  fill={isHighlighted('Glutes') ? 'url(#muscleActiveGrad)' : '#1e293b'}
                  stroke={isHighlighted('Glutes') ? '#10b981' : '#334155'}
                  strokeWidth="1.5"
                  filter={isHighlighted('Glutes') ? 'url(#glowEffect)' : undefined}
                  onMouseEnter={() => setHoveredMuscle('Glutes')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => handleMuscleClick('Glutes')}
                />

                {/* Hamstrings */}
                <path
                  d="M 124 260 C 112 280 114 320 126 335 C 138 335 145 295 145 260 Z"
                  fill={isHighlighted('Hamstrings') ? 'url(#muscleActiveGrad)' : '#1e293b'}
                  stroke={isHighlighted('Hamstrings') ? '#10b981' : '#334155'}
                  strokeWidth="1.5"
                  onMouseEnter={() => setHoveredMuscle('Hamstrings')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => handleMuscleClick('Hamstrings')}
                />
                <path
                  d="M 176 260 C 188 280 186 320 174 335 C 162 335 155 295 155 260 Z"
                  fill={isHighlighted('Hamstrings') ? 'url(#muscleActiveGrad)' : '#1e293b'}
                  stroke={isHighlighted('Hamstrings') ? '#10b981' : '#334155'}
                  strokeWidth="1.5"
                  onMouseEnter={() => setHoveredMuscle('Hamstrings')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => handleMuscleClick('Hamstrings')}
                />

                {/* Calves (Gastrocnemius & Soleus) */}
                <path
                  d="M 120 342 C 110 365 112 410 124 435 C 135 430 138 385 136 342 Z"
                  fill={isHighlighted('Calves') ? 'url(#muscleActiveGrad)' : '#1e293b'}
                  stroke={isHighlighted('Calves') ? '#10b981' : '#334155'}
                  strokeWidth="1.5"
                  onMouseEnter={() => setHoveredMuscle('Calves')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => handleMuscleClick('Calves')}
                />
                <path
                  d="M 180 342 C 190 365 188 410 176 435 C 165 430 162 385 164 342 Z"
                  fill={isHighlighted('Calves') ? 'url(#muscleActiveGrad)' : '#1e293b'}
                  stroke={isHighlighted('Calves') ? '#10b981' : '#334155'}
                  strokeWidth="1.5"
                  onMouseEnter={() => setHoveredMuscle('Calves')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => handleMuscleClick('Calves')}
                />
              </g>
            )}
          </svg>

          {/* Quick Muscle Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4 max-w-sm">
            {Object.keys(MUSCLE_DETAILS)
              .filter(m => (view === 'front' ? ['Chest', 'Shoulders', 'Biceps', 'Abs', 'Quadriceps', 'Forearms', 'Adductors'].includes(m) : ['Back', 'Triceps', 'Glutes', 'Hamstrings', 'Calves', 'Traps', 'Lower Back'].includes(m)))
              .map(m => (
                <button
                  key={m}
                  onMouseEnter={() => setHoveredMuscle(m)}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => handleMuscleClick(m)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    isHighlighted(m)
                      ? 'bg-emerald-500 text-slate-950 font-bold scale-105 shadow-md shadow-emerald-500/30'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {m}
                </button>
              ))}
          </div>
        </div>

        {/* Muscle Information Card */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-5 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 p-6 md:p-8 rounded-2xl border border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
              Target Anatomy: {muscleInfo.region.toUpperCase()} CHAIN
            </div>
            <h4 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{muscleInfo.name}</h4>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed mt-3">{muscleInfo.desc}</p>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Key Biomechanical Exercises
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {muscleInfo.mainMoves.map(move => (
                <div
                  key={move}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs font-medium text-slate-200 hover:border-emerald-500/50 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{move}</span>
                </div>
              ))}
            </div>
          </div>

          {interactiveRedirect && (
            <div className="pt-2">
              <Link
                href={`/exercises?muscle=${encodeURIComponent(activeMuscle)}`}
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 group"
              >
                <span>Browse All {activeMuscle} Exercises</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
