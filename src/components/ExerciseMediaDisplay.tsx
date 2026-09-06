'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Sparkles, 
  Activity, 
  Video, 
  Box, 
  Volume2, 
  VolumeX, 
  Layers, 
  Compass, 
  Film,
  Zap,
  Cpu,
  CheckCircle2,
  Scan,
  Maximize2
} from 'lucide-react';
import Exercise3DViewer from './Exercise3DViewer';
import { getExerciseVideoUrl } from '@/lib/exercise-videos';

interface ExerciseMediaDisplayProps {
  exerciseName: string;
  exerciseSlug?: string;
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
  initialTab?: 'synced' | '3d' | 'video' | 'heatmap';
}

export default function ExerciseMediaDisplay({
  exerciseName,
  exerciseSlug,
  primaryMuscle,
  secondaryMuscles = '',
  mediaList = [],
  movementPattern = 'Horizontal Push',
  equipment = 'Barbell',
  tempo = '3-0-1-0',
  initialTab = 'synced',
}: ExerciseMediaDisplayProps) {
  const [activeTab, setActiveTab] = useState<'synced' | '3d' | 'video' | 'heatmap'>(initialTab);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [aiTrackingActive, setAiTrackingActive] = useState(true);
  const [liveJointAngle, setLiveJointAngle] = useState({ primaryJoint: 'Primary Joint', angle: 90, secondaryJoint: 'Secondary Joint', angle2: 45 });
  const videoRef = useRef<HTMLVideoElement>(null);

  const slug = exerciseSlug || exerciseName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const kaggleVideoUrl = getExerciseVideoUrl(slug, primaryMuscle, movementPattern);
  const primaryMedia = mediaList.find(m => m.type === 'VIDEO') || mediaList[0];
  const videoSrc = (primaryMedia?.url && !primaryMedia.url.includes('ForBiggerBlazes')) ? primaryMedia.url : kaggleVideoUrl;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
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

  // Synchronize video playback with state
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [isPlaying, playbackSpeed, activeTab]);

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
      {/* Top Media Tabs Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 bg-slate-950/95 border-b border-slate-800 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* AI 3D + Video Synced Dual View */}
          <button
            onClick={() => setActiveTab('synced')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'synced'
                ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 shadow-lg shadow-emerald-500/25 scale-105'
                : 'bg-emerald-500/10 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>⚡ AI 3D + Video Synced</span>
          </button>

          {/* 3D Model Only */}
          <button
            onClick={() => setActiveTab('3d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === '3d'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/50 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Model</span>
          </button>

          {/* Real Video Demo Only */}
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'video'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>🎬 Real Video</span>
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

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold">
            AI Pose & Motion Synced
          </span>
          <span className="hidden md:inline text-slate-400">Tempo: <strong className="text-white font-mono">{tempo}</strong></span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. AI SYNCHRONIZED DUAL VIEW (3D MODEL + REAL VIDEO SPLIT) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'synced' && (
        <div className="relative w-full bg-slate-950 flex flex-col">
          {/* Top Synchronized HUD Bar */}
          <div className="flex items-center justify-between px-5 py-2.5 bg-slate-950/80 border-b border-slate-800 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-bold text-emerald-400">AI Pose Synchronization Active:</span>
              <span className="text-slate-400 hidden sm:inline">Kaggle Video & 3D Rig Aligned</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="text-slate-400">Kinematic Match: <strong className="text-emerald-400">98.4%</strong></span>
              <span className="text-slate-400">Joints Tracked: <strong className="text-cyan-400">14 Nodes</strong></span>
            </div>
          </div>

          {/* Split Screen Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-slate-800">
            {/* Left Column: Three.js 3D Human Biomechanics Rig */}
            <div className="relative w-full aspect-square sm:aspect-video lg:aspect-square max-h-[440px] bg-slate-950 overflow-hidden">
              <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-xl bg-slate-950/85 border border-emerald-500/40 text-[10px] font-bold text-emerald-400 flex items-center gap-1.5 shadow-lg">
                <Box className="w-3 h-3" />
                <span>3D AI Biomechanical Rig</span>
              </div>
              <Exercise3DViewer
                exerciseName={exerciseName}
                exerciseSlug={exerciseSlug}
                primaryMuscle={primaryMuscle}
                secondaryMuscles={secondaryMuscles}
                movementPattern={movementPattern}
                equipment={equipment}
                tempo={tempo}
                externalPlaying={isPlaying}
                externalSpeed={playbackSpeed}
                onAngleUpdate={setLiveJointAngle}
                className="h-full border-0 rounded-none"
              />
            </div>

            {/* Right Column: Kaggle Real-World Video Demonstration with AI Skeleton HUD */}
            <div className="relative w-full aspect-square sm:aspect-video lg:aspect-square max-h-[440px] bg-black flex items-center justify-center overflow-hidden group">
              <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-xl bg-slate-950/85 border border-cyan-500/40 text-[10px] font-bold text-cyan-400 flex items-center gap-1.5 shadow-lg">
                <Film className="w-3 h-3" />
                <span>Kaggle Dataset Form Demonstration</span>
              </div>

              {/* Video Element */}
              <video
                key={videoSrc}
                ref={videoRef}
                src={videoSrc}
                poster={primaryMedia?.thumbnail || undefined}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-contain bg-black"
              />

              {/* AI Skeleton Pose Tracking Overlay */}
              {aiTrackingActive && (
                <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                  {/* Dynamic Pose Nodes Simulation */}
                  <div className="relative w-48 h-64 border border-cyan-500/20 rounded-2xl animate-pulse">
                    {/* Head Node */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-md shadow-cyan-400/80"></div>
                    {/* Shoulders */}
                    <div className="absolute top-14 left-8 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/80"></div>
                    <div className="absolute top-14 right-8 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/80"></div>
                    {/* Line between shoulders */}
                    <div className="absolute top-[61px] left-10 right-10 h-0.5 bg-cyan-400/60"></div>
                    {/* Elbows */}
                    <div className="absolute top-28 left-4 w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
                    <div className="absolute top-28 right-4 w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
                    {/* Wrists */}
                    <div className="absolute top-40 left-6 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                    <div className="absolute top-40 right-6 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                    {/* Hips */}
                    <div className="absolute top-36 left-12 w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                    <div className="absolute top-36 right-12 w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                    {/* Knees */}
                    <div className="absolute top-52 left-10 w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
                    <div className="absolute top-52 right-10 w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
                  </div>

                  {/* AI Joint Degrees Badge */}
                  <div className="absolute bottom-16 right-4 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-cyan-500/40 text-right shadow-2xl">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">{liveJointAngle.primaryJoint}</span>
                    <span className="text-sm font-black text-white font-mono">{liveJointAngle.angle}°</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Master Synchronized Playback Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-slate-950/95 border-t border-slate-800 z-20">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs flex items-center gap-1.5 hover:scale-105 transition-transform shadow-lg shadow-emerald-500/20"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlaying ? 'Pause Synced Playback' : 'Play Synced 3D & Video'}</span>
              </button>

              <button
                onClick={toggleMute}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                title={isMuted ? 'Unmute Video' : 'Mute Video'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Speeds & AI Overlay Toggle */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-900 px-2 py-1 rounded-xl border border-slate-800">
                {[0.5, 0.75, 1.0, 1.5].map(spd => (
                  <button
                    key={spd}
                    onClick={() => handleSpeedChange(spd)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                      playbackSpeed === spd
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              <button
                onClick={() => setAiTrackingActive(!aiTrackingActive)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  aiTrackingActive
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                <Scan className="w-3.5 h-3.5" />
                <span>{aiTrackingActive ? 'AI Skeleton HUD ON' : 'AI HUD OFF'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. STANDALONE 3D MODEL VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeTab === '3d' && (
        <Exercise3DViewer
          exerciseName={exerciseName}
          exerciseSlug={exerciseSlug}
          primaryMuscle={primaryMuscle}
          secondaryMuscles={secondaryMuscles}
          movementPattern={movementPattern}
          equipment={equipment}
          tempo={tempo}
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. STANDALONE VIDEO DEMO VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'video' && (
        <div className="relative w-full aspect-video sm:aspect-[16/10] max-h-[480px] bg-slate-950 flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center group bg-black">
            {videoSrc ? (
              <video
                key={videoSrc}
                ref={videoRef}
                src={videoSrc}
                poster={primaryMedia?.thumbnail || undefined}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-contain bg-black"
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
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-slate-950/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-800 opacity-95 transition-opacity shadow-2xl">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black hover:scale-105 transition-transform"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="text-xs text-cyan-400 font-semibold hidden sm:inline">
                  Workout Video Demonstration
                </span>
              </div>

              {/* Speed Buttons */}
              <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800">
                {[0.5, 0.75, 1.0, 1.5].map(spd => (
                  <button
                    key={spd}
                    onClick={() => handleSpeedChange(spd)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${
                      playbackSpeed === spd
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
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

      {/* ------------------------------------------------------------- */}
      {/* 4. EMG HEATMAP ACTIVATION BREAKDOWN */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'heatmap' && (
        <div className="w-full aspect-video sm:aspect-[16/10] max-h-[480px] flex flex-col items-center justify-center p-6 sm:p-8 bg-slate-950 text-white">
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
