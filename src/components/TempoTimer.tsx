'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock, Volume2, VolumeX } from 'lucide-react';
import { sounds } from '@/lib/sound';

interface TempoTimerProps {
  tempoString?: string; // e.g. "3-1-1-0" or "3-0-1-0"
}

export default function TempoTimer({ tempoString = '3-1-1-0' }: TempoTimerProps) {
  const parts = tempoString.split('-').map(p => parseInt(p, 10) || 0);
  const eccentric = parts[0] || 3;
  const pauseBottom = parts[1] || 1;
  const concentric = parts[2] || 1;
  const pauseTop = parts[3] || 0;

  const totalCycle = Math.max(1, eccentric + pauseBottom + concentric + pauseTop);

  const [isRunning, setIsRunning] = useState(false);
  const [currentSecond, setCurrentSecond] = useState(0);
  const [repCount, setRepCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setCurrentSecond(prev => {
          const next = (prev + 1) % totalCycle;
          if (next === 0) {
            setRepCount(r => r + 1);
          }
          if (soundEnabled) {
            sounds.playTick();
          }
          return next;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, totalCycle, soundEnabled]);

  const reset = () => {
    setIsRunning(false);
    setCurrentSecond(0);
    setRepCount(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Determine current phase
  let phaseName = 'Eccentric (Lower)';
  let phaseColor = 'text-emerald-400 border-emerald-500 bg-emerald-500/10';
  let phaseSecondsLeft = eccentric - currentSecond;

  if (currentSecond < eccentric) {
    phaseName = '1. Lower Down (Eccentric)';
    phaseColor = 'text-emerald-400 border-emerald-500 bg-emerald-500/10';
    phaseSecondsLeft = eccentric - currentSecond;
  } else if (currentSecond < eccentric + pauseBottom) {
    phaseName = '2. Bottom Stretch Pause';
    phaseColor = 'text-amber-400 border-amber-500 bg-amber-500/10';
    phaseSecondsLeft = eccentric + pauseBottom - currentSecond;
  } else if (currentSecond < eccentric + pauseBottom + concentric) {
    phaseName = '3. Explosive Drive (Concentric)';
    phaseColor = 'text-cyan-400 border-cyan-500 bg-cyan-500/10';
    phaseSecondsLeft = eccentric + pauseBottom + concentric - currentSecond;
  } else {
    phaseName = '4. Top Reset / Squeeze';
    phaseColor = 'text-purple-400 border-purple-500 bg-purple-500/10';
    phaseSecondsLeft = totalCycle - currentSecond;
  }

  const progressPercent = Math.round((currentSecond / totalCycle) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 text-white shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          <h4 className="font-bold text-sm uppercase tracking-wider text-slate-200">
            Interactive Tempo Metronome
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title={soundEnabled ? 'Disable Audio Ticks' : 'Enable Audio Ticks'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800 font-mono text-xs font-bold text-emerald-400 border border-slate-700">
            {tempoString}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
        {/* Animated Visual Dial */}
        <div className="sm:col-span-6 flex flex-col items-center justify-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#1e293b"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#10b981"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * progressPercent) / 100}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold font-mono text-white tracking-tighter">
                {isRunning ? phaseSecondsLeft : totalCycle}s
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {isRunning ? 'Rep ' + (repCount + 1) : 'Cadence'}
              </span>
            </div>
          </div>
        </div>

        {/* Phase Description & Controls */}
        <div className="sm:col-span-6 space-y-4">
          <div className={`p-3.5 rounded-2xl border ${phaseColor} transition-colors`}>
            <span className="text-[11px] font-bold uppercase tracking-wider block opacity-75">
              Current Movement Phase
            </span>
            <span className="text-sm md:text-base font-extrabold block mt-0.5">
              {isRunning ? phaseName : 'Ready to Start Form Cadence'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-lg ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Metronome</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Tempo Pacer</span>
                </>
              )}
            </button>

            <button
              onClick={reset}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex justify-between text-xs text-slate-400 px-1 font-mono">
            <span>Eccentric: {eccentric}s</span>
            <span>Pause: {pauseBottom}s</span>
            <span>Concentric: {concentric}s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
