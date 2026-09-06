'use client';

import React, { useState, useRef } from 'react';
import { Play, Pause, Sparkles, Activity, Video, Box, Volume2, VolumeX, Layers, Compass } from 'lucide-react';
import Exercise3DViewer from './Exercise3DViewer';

interface ExerciseMediaDisplayProps {
  exerciseName: string;
  primaryMuscle: string;
  secondaryMuscles?: string;
  mediaList?: {
    id: string;
    type: string;
    url: string;
    thumbnail?: string | null;
    provider: string;
  }[];
  movementPattern?: string;
  equipment?: string;
  tempo?: string;
}

export default function ExerciseMediaDisplay({
  exerciseName,
  primaryMuscle,
  secondaryMuscles = '',
  mediaList = [],
  movementPattern = 'Horizontal Push',
  equipment = 'Barbell',
  tempo = '3-0-1-0',
}: ExerciseMediaDisplayProps) {
  const [activeTab, setActiveTab] = useState<'3d' | 'video' | 'heatmap'>('3d');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const primaryMedia = mediaList.find(m => m.type === 'VIDEO') || mediaList[0];

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
      {/* Top Media Tabs Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 bg-slate-950/90 border-b border-slate-800">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* 3D Tab - Highlighted */}
          <button
            onClick={() => setActiveTab('3d')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === '3d'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/80 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Interactive 3D Model</span>
          </button>

          {/* Video Tab */}
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'video'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video Demo</span>
          </button>

          {/* Muscle Activation Tab */}
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'heatmap'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>EMG Activation</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Tempo Cadence: <strong className="text-white font-mono">{tempo}</strong></span>
        </div>
      </div>

      {/* Media Viewports */}
      {activeTab === '3d' && (
        <Exercise3DViewer
          exerciseName={exerciseName}
          primaryMuscle={primaryMuscle}
          secondaryMuscles={secondaryMuscles}
          movementPattern={movementPattern}
          equipment={equipment}
          tempo={tempo}
        />
      )}

      {activeTab === 'video' && (
        <div className="relative w-full aspect-video sm:aspect-[16/10] max-h-[460px] bg-slate-950 flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center group">
            {primaryMedia?.url?.endsWith('.mp4') || primaryMedia?.url?.endsWith('.webm') ? (
              <video
                ref={videoRef}
                src={primaryMedia.url}
                poster={primaryMedia.thumbnail || undefined}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400 shadow-xl animate-pulse">
                  <Activity className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-white mb-1">{exerciseName}</h4>
                <p className="text-xs text-slate-400 mb-4">
                  Visual Vector Demonstration & AI Motion Vectors Ready
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-slate-800 text-xs text-emerald-400 font-semibold border border-slate-700">
                    Primary: {primaryMuscle}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-800 text-xs text-cyan-400 font-semibold border border-slate-700">
                    Pattern: {movementPattern}
                  </span>
                </div>
              </div>
            )}

            {/* Video Control Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-800 opacity-90 transition-opacity">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-2 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:scale-105 transition-transform"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Speed Buttons */}
              <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800">
                {[0.5, 0.75, 1.0].map(spd => (
                  <button
                    key={spd}
                    onClick={() => handleSpeedChange(spd)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${
                      playbackSpeed === spd
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'heatmap' && (
        <div className="w-full aspect-video sm:aspect-[16/10] max-h-[460px] flex flex-col items-center justify-center p-6 sm:p-8 bg-slate-950 text-white">
          <div className="w-full max-w-md space-y-5">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider text-center">
              Target Muscle Activation Breakdown
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-400 font-bold">{primaryMuscle} (Prime Mover)</span>
                  <span className="text-white font-mono">88% EMG Activation</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-[88%] shadow-lg shadow-emerald-500/50"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-cyan-400 font-bold">{secondaryMuscles || 'Synergists & Stabilizers'}</span>
                  <span className="text-white font-mono">60% EMG Activation</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full w-[60%] shadow-lg shadow-cyan-500/50"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-amber-400 font-bold">Core Bracing & Spinal Fixators</span>
                  <span className="text-white font-mono">45% EMG Activation</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full w-[45%]"></div>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <span>Kinematic Plane: <strong className="text-white">{movementPattern}</strong></span>
              <span>Loaded Tension: <strong className="text-emerald-400">Peak Concentric</strong></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
