'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Apple, 
  Sparkles, 
  Flame, 
  Activity, 
  Droplet, 
  Zap, 
  Calculator, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { calculateTDEE } from '@/lib/biomechanics';

export default function NutritionPage() {
  // Calculator state
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weightKg, setWeightKg] = useState<number>(75);
  const [heightCm, setHeightCm] = useState<number>(178);
  const [age, setAge] = useState<number>(26);
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'>('moderate');
  const [goal, setGoal] = useState<'fat_loss' | 'maintenance' | 'muscle_gain' | 'strength'>('muscle_gain');

  const macroBreakdown = calculateTDEE({
    gender,
    weightKg,
    heightCm,
    age,
    activityLevel,
    goal,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Apple className="w-3.5 h-3.5" />
          <span>Educational Fueling Science</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Nutrition & Macronutrient Hub
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl">
          Optimize muscle protein synthesis, training recovery, and energy balance with scientifically grounded macronutrient ratios.
        </p>
      </div>

      {/* 1. INTERACTIVE TDEE & MACRO CALCULATOR */}
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 space-y-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xl font-bold text-white">Daily Calorie & Macro Target Calculator</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Mifflin-St Jeor Protocol</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs */}
          <div className="lg:col-span-7 space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase">Biological Sex</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-2.5 rounded-xl font-bold transition-all ${
                      gender === 'male' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-2.5 rounded-xl font-bold transition-all ${
                      gender === 'female' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={e => setAge(parseInt(e.target.value, 10) || 25)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase">Weight (kg)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={e => setWeightKg(parseFloat(e.target.value) || 70)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={e => setHeightCm(parseInt(e.target.value, 10) || 175)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase">Weekly Activity Level</label>
              <select
                value={activityLevel}
                onChange={e => setActivityLevel(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
              >
                <option value="sedentary">Sedentary (Desk job, minimal exercise)</option>
                <option value="light">Lightly Active (1-3 workouts / week)</option>
                <option value="moderate">Moderately Active (3-5 workouts / week)</option>
                <option value="active">Very Active (6-7 intense sessions / week)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase">Primary Goal</label>
              <select
                value={goal}
                onChange={e => setGoal(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
              >
                <option value="muscle_gain">Lean Muscle Hypertrophy (+12% Caloric Surplus)</option>
                <option value="fat_loss">Fat Loss (-20% Caloric Deficit)</option>
                <option value="strength">Raw Strength (+5% Mild Surplus)</option>
                <option value="maintenance">Maintenance Energy Balance</option>
              </select>
            </div>
          </div>

          {/* Computed Results Card */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-950 border border-emerald-500/30 space-y-5 shadow-xl">
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                Target Daily Energy
              </span>
              <span className="text-4xl font-black text-white font-mono block mt-1">
                {macroBreakdown.calories} <span className="text-base font-sans font-bold text-emerald-400">kcal/day</span>
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                Basal Metabolic Rate (BMR): {macroBreakdown.bmr} kcal • TDEE: {macroBreakdown.tdee} kcal
              </p>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
              {/* Protein */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-emerald-400">Protein (2.2g / kg)</span>
                  <span className="text-white font-mono">{macroBreakdown.proteinGrams}g</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[35%]"></div>
                </div>
              </div>

              {/* Carbohydrates */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-cyan-400">Carbohydrates (Muscle Glycogen)</span>
                  <span className="text-white font-mono">{macroBreakdown.carbsGrams}g</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full w-[45%]"></div>
                </div>
              </div>

              {/* Fats */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-amber-400">Healthy Dietary Fats</span>
                  <span className="text-white font-mono">{macroBreakdown.fatsGrams}g</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[20%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. NUTRIENT TIMING & EDUCATION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Pre-Workout */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="text-lg font-bold text-white">Pre-Workout Nutrition (60-90m Prior)</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Consume 30-50g of easily digestible complex carbohydrates alongside 20-30g lean protein. Minimize high dietary fats immediately pre-training to ensure rapid gastric emptying and sustained intra-workout glycogen availability.
          </p>
          <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
            <li>• Oatmeal with whey protein & berries</li>
            <li>• Rice cakes with banana & honey</li>
            <li>• Sourdough toast with egg whites</li>
          </ul>
        </div>

        {/* Post-Workout */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            <Flame className="w-5 h-5" />
          </div>
          <h4 className="text-lg font-bold text-white">Post-Workout Recovery Window</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ingest 25-40g high biological value protein containing at least 2.5g leucine to trigger the mTOR signaling pathway and maximal Muscle Protein Synthesis (MPS), paired with 40-60g carbohydrates to replenish depleted muscle glycogen stores.
          </p>
          <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
            <li>• Whey isolate shake + banana</li>
            <li>• Chicken breast with jasmine rice & avocado</li>
            <li>• Salmon with sweet potato & spinach</li>
          </ul>
        </div>

        {/* Hydration & Electrolytes */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
            <Droplet className="w-5 h-5" />
          </div>
          <h4 className="text-lg font-bold text-white">Hydration & Electrolytes</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Even a 2% drop in total body hydration impairs maximal force production and neuromuscular firing rate. Aim for 3.0 to 4.0 liters of water daily, adding sodium (approx. 500mg) and potassium to intra-workout fluids for heavy lifting sessions.
          </p>
          <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
            <li>• 500ml water upon waking</li>
            <li>• 500-750ml sipped during training</li>
            <li>• Pinch of sea salt + lemon pre-workout</li>
          </ul>
        </div>
      </div>

      {/* Educational Notice */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200 block mb-0.5">Educational Purpose Only:</strong>
          The nutrition tools and macronutrient targets presented here are for physical fitness education and body recomposition planning. They are not medical nutritional therapies or diagnostic prescriptions.
        </div>
      </div>
    </div>
  );
}
