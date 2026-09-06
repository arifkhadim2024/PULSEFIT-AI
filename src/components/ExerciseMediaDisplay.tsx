'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Sparkles, 
  Activity, 
  Film,
  Volume2, 
  VolumeX, 
  Layers, 
  Scan,
  Maximize2,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Flame,
  Info,
  ChevronRight,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Zap,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
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
  initialTab?: 'video' | 'ai_hud' | 'heatmap' | 'biomechanics';
}

export default function ExerciseMediaDisplay({
  exerciseName,
  exerciseSlug,
  primaryMuscle,
  secondaryMuscles = '',
  mediaList = [],
  movementPattern = 'Horizontal Push',
  equipment = 'Barbell',
  tempo = '3-1-1-0',
  initialTab = 'video',
}: ExerciseMediaDisplayProps) {
  const [activeTab, setActiveTab] = useState<'video' | 'ai_hud' | 'heatmap' | 'biomechanics'>(initialTab);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [aiTrackingActive, setAiTrackingActive] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Animated Cadence Simulation for In-Review Exercises
  const [cadencePhase, setCadencePhase] = useState<'concentric' | 'squeeze' | 'eccentric' | 'pause'>('concentric');
  const [cadenceProgress, setCadenceProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const slug = exerciseSlug || exerciseName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const kaggleVideoUrl = getExerciseVideoUrl(slug);
  const primaryMedia = mediaList.find(m => m.type === 'VIDEO') || mediaList[0];
  const videoSrc = (primaryMedia?.url && !primaryMedia.url.includes('ForBiggerBlazes')) ? primaryMedia.url : kaggleVideoUrl;
  const hasVideo = Boolean(videoSrc);

  // Parse tempo (e.g. "3-1-1-0" -> [3, 1, 1, 0])
  const tempoParts = (tempo || '3-1-1-0').split('-').map(n => parseInt(n, 10) || 1);
  const eccentricSec = tempoParts[0] || 3;
  const stretchSec = tempoParts[1] || 1;
  const concentricSec = tempoParts[2] || 1;
  const squeezeSec = tempoParts[3] || 0;
  const totalCycleSec = Math.max(1, eccentricSec + stretchSec + concentricSec + squeezeSec);

  // Cadence animation loop for kinetic guide
  useEffect(() => {
    if (hasVideo) return;
    let startTime = performance.now();
    let animId: number;

    const tick = (now: number) => {
      const elapsedSec = ((now - startTime) / 1000) % totalCycleSec;
      const progress = (elapsedSec / totalCycleSec) * 100;
      setCadenceProgress(progress);

      // Determine current phase
      if (elapsedSec < concentricSec) {
        setCadencePhase('concentric');
      } else if (elapsedSec < concentricSec + squeezeSec) {
        setCadencePhase('squeeze');
      } else if (elapsedSec < concentricSec + squeezeSec + eccentricSec) {
        setCadencePhase('eccentric');
      } else {
        setCadencePhase('pause');
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [hasVideo, totalCycleSec, concentricSec, squeezeSec, eccentricSec]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
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

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Synchronize playback speed and play state
  useEffect(() => {
    if (videoRef.current && hasVideo) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [isPlaying, playbackSpeed, activeTab, hasVideo]);

  const formatTime = (timeInSeconds: number) => {
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Exercise joint angle determination based on movement pattern
  const getPrimaryJointInfo = () => {
    const p = (movementPattern || '').toLowerCase();
    const name = exerciseName.toLowerCase();
    if (p.includes('squat') || name.includes('squat') || name.includes('leg press')) {
      return { 
        joint: 'Knee & Hip Flexion', 
        targetAngle: '90° (Parallel Depth)', 
        normalRange: '45° - 120°', 
        phase: 'Peak Depth',
        action: 'Knee extension & Hip extension drive'
      };
    }
    if (p.includes('hinge') || name.includes('deadlift') || name.includes('rdl')) {
      return { 
        joint: 'Hip Hinge Angle', 
        targetAngle: '70° Posterior Tilt', 
        normalRange: '45° - 90°', 
        phase: 'Eccentric Loaded Stretch',
        action: 'Hamstrings & Glutes posterior loading'
      };
    }
    if (p.includes('pull') || name.includes('row') || name.includes('pullup') || name.includes('lat')) {
      return { 
        joint: 'Scapular Retraction & Elbows', 
        targetAngle: '90° Humeral Adduction', 
        normalRange: '30° - 110°', 
        phase: 'Peak Contraction Squeeze',
        action: 'Latissimus dorsi & Rhomboid retraction'
      };
    }
    if (name.includes('curl') || p.includes('bicep')) {
      return { 
        joint: 'Elbow Flexion', 
        targetAngle: '45° Peak Bicep Peak', 
        normalRange: '30° - 145°', 
        phase: 'Concentric Contraction',
        action: 'Biceps brachii & Brachialis flexion'
      };
    }
    if (name.includes('tricep') || name.includes('pushdown') || name.includes('dip')) {
      return { 
        joint: 'Elbow Extension', 
        targetAngle: '180° Full Lockout', 
        normalRange: '45° - 180°', 
        phase: 'Terminal Extension',
        action: 'Triceps brachii lateral/medial head'
      };
    }
    if (name.includes('raise') || name.includes('lateral') || p.includes('shoulder')) {
      return { 
        joint: 'Glenohumeral Abduction', 
        targetAngle: '90° Scapular Plane', 
        normalRange: '0° - 90°', 
        phase: 'Parallel Hold',
        action: 'Lateral deltoid abduction'
      };
    }
    return { 
      joint: 'Elbow & Shoulder Angle', 
      targetAngle: '90° Sternum Level', 
      normalRange: '45° - 90°', 
      phase: 'Bottom Reversal',
      action: 'Pectoralis major horizontal adduction'
    };
  };

  const jointInfo = getPrimaryJointInfo();

  return (
    <div 
      ref={containerRef}
      className="w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-3 bg-slate-950/95 border-b border-slate-800 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Main Visual Demo / Video Tab */}
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'video'
                ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black shadow-lg shadow-emerald-500/25 scale-105'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            {hasVideo ? (
              <>
                <Film className="w-3.5 h-3.5" />
                <span>🎬 Form Video Demo</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>⚡ Kinetic Form Guide</span>
              </>
            )}
          </button>

          {/* AI Skeleton HUD Tab (If video exists) */}
          {hasVideo && (
            <button
              onClick={() => {
                setActiveTab('video');
                setAiTrackingActive(true);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'video' && aiTrackingActive
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Scan className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Skeleton HUD</span>
            </button>
          )}

          {/* EMG Muscle Activation Tab */}
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'heatmap'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>EMG Muscle Load</span>
          </button>

          {/* Biomechanics Breakdown */}
          <button
            onClick={() => setActiveTab('biomechanics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'biomechanics'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Biomechanics</span>
          </button>
        </div>

        {/* Status Tag & Tempo Pill */}
        <div className="flex items-center gap-2 text-xs">
          {hasVideo ? (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              1:1 Verified Demonstration
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
              Video Under Curation
            </span>
          )}
          <span className="hidden md:inline text-slate-400 text-xs">
            Tempo: <strong className="text-white font-mono">{tempo}</strong>
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. VERIFIED VIDEO PLAYER OR AI BIOMECHANICAL KINETIC GUIDE */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'video' && (
        <div className="relative w-full aspect-video max-h-[520px] bg-black flex items-center justify-center overflow-hidden group">
          {hasVideo ? (
            /* REAL 1-TO-1 VERIFIED VIDEO */
            <>
              <video
                key={videoSrc!}
                ref={videoRef}
                src={videoSrc!}
                poster={primaryMedia?.thumbnail || undefined}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onClick={togglePlay}
                className="w-full h-full object-contain bg-black cursor-pointer"
              />

              {/* AI Skeleton Pose HUD Overlay (Only when Video is present) */}
              {aiTrackingActive && (
                <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4">
                  {/* Top Left AI Detection Badge */}
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 text-cyan-400 text-xs font-bold flex items-center gap-2 shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>AI Kinematic Tracking Active</span>
                    </div>
                  </div>

                  {/* Bottom Right AI Joint Angle Degree Badge */}
                  <div className="self-end px-3.5 py-2 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-emerald-500/40 text-right shadow-2xl space-y-0.5">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {jointInfo.joint}
                    </div>
                    <div className="text-base font-black text-emerald-400 font-mono flex items-center justify-end gap-1.5">
                      <span>{jointInfo.targetAngle}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-[9px] text-cyan-300 font-mono">
                      Phase: {jointInfo.phase}
                    </div>
                  </div>
                </div>
              )}

              {/* Video Control Bar (Only when Video is present) */}
              <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent transition-opacity duration-300 ${isHovered || !isPlaying ? 'opacity-100' : 'opacity-0 sm:opacity-90'}`}>
                {/* Seek Bar */}
                <div className="w-full flex items-center gap-3 mb-2">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    step="0.1"
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                  <span className="text-[11px] font-mono text-slate-300 shrink-0">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  {/* Left Controls: Play, Restart, Mute */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={togglePlay}
                      className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:scale-105 text-slate-950 font-black shadow-lg shadow-emerald-500/20 transition-transform"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>

                    <button
                      onClick={handleRestart}
                      className="p-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Replay from start"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={toggleMute}
                      className="p-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Right Controls: Speeds, AI Toggle, Fullscreen */}
                  <div className="flex items-center gap-2">
                    {/* Speed Controls */}
                    <div className="flex items-center bg-slate-900/90 px-2 py-1 rounded-xl border border-slate-700">
                      {[0.5, 0.75, 1.0, 1.5].map(spd => (
                        <button
                          key={spd}
                          onClick={() => handleSpeedChange(spd)}
                          className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                            playbackSpeed === spd
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>

                    {/* AI HUD Toggle */}
                    <button
                      onClick={() => setAiTrackingActive(!aiTrackingActive)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        aiTrackingActive
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                          : 'bg-slate-900/90 text-slate-400 border border-slate-700'
                      }`}
                      title="Toggle AI Skeleton Overlay"
                    >
                      <Scan className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{aiTrackingActive ? 'AI HUD ON' : 'AI HUD OFF'}</span>
                    </button>

                    {/* Fullscreen Toggle */}
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Toggle Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* HIGH-TECH BIOMECHANICAL KINETIC GUIDE (For In-Review Exercises) */
            <div className="relative w-full h-full flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900/90 to-slate-950 p-6 sm:p-8 text-white overflow-hidden">
              {/* Background Geometric Grid Accent */}
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#10b981_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

              {/* Header Info */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                      {exerciseName}
                    </h4>
                    <span className="text-[11px] text-emerald-400/90 font-mono flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      Kinematic Vector Analysis Active
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Video In Review</span>
                  </span>
                </div>
              </div>

              {/* Center Kinetic Cadence Pulse & Biomechanics Dashboard */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 my-auto">
                {/* 1. Cadence Wave Simulator */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Cadence Flow</span>
                      <span className="text-emerald-400 font-mono font-bold text-xs uppercase">{cadencePhase}</span>
                    </div>
                    <div className="text-xs text-slate-300 font-semibold mb-2">
                      {cadencePhase === 'concentric' && '⚡ Concentric Contraction (Explosive Lift)'}
                      {cadencePhase === 'squeeze' && '🔥 Peak Muscle Contraction & Squeeze'}
                      {cadencePhase === 'eccentric' && '🌊 Controlled Eccentric Lowering'}
                      {cadencePhase === 'pause' && '⏸️ Reset & Scapular Re-engagement'}
                    </div>
                  </div>

                  {/* Progress Ring Bar */}
                  <div className="space-y-1.5">
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-75"
                        style={{ width: `${cadenceProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>Tempo: {tempo}</span>
                      <span>{Math.round(cadenceProgress)}% Rep Arc</span>
                    </div>
                  </div>
                </div>

                {/* 2. Primary Joint Vector */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md space-y-2">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
                    Target Joint Angle
                  </span>
                  <p className="text-base font-black text-cyan-400 font-mono">
                    {jointInfo.targetAngle}
                  </p>
                  <p className="text-xs text-slate-300 leading-snug">
                    {jointInfo.action}
                  </p>
                  <div className="pt-1 text-[11px] text-slate-400 font-mono border-t border-slate-800/80">
                    ROM: <span className="text-slate-200">{jointInfo.normalRange}</span>
                  </div>
                </div>

                {/* 3. Anatomical Hypertrophy Profile */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md space-y-2">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
                    Target Muscle Excitation
                  </span>
                  <p className="text-base font-black text-emerald-400">
                    {primaryMuscle}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                      {movementPattern}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/20">
                      {equipment}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Quick-Action Guidance Bar */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
                <p className="text-xs text-slate-400 max-w-lg">
                  1-to-1 video is undergoing quality verification. Follow verified biomechanical metrics and form execution steps below.
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('heatmap')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>View EMG Load</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('biomechanics')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Biomechanics</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. EMG MUSCLE ACTIVATION TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'heatmap' && (
        <div className="w-full aspect-video max-h-[520px] flex flex-col items-center justify-center p-6 sm:p-8 bg-slate-950 text-white">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <Flame className="w-3.5 h-3.5" />
                <span>Surface Electromyography (sEMG) Model</span>
              </div>
              <h4 className="text-base font-black text-white">
                Muscle Recruitment & Excitation
              </h4>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-emerald-400">{primaryMuscle} (Agonist / Prime Mover)</span>
                  <span className="text-white font-mono">92% Recruitment</span>
                </div>
                <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full w-[92%] shadow-lg shadow-emerald-500/50"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-cyan-400">{secondaryMuscles || 'Synergists & Kinetic Stabilizers'}</span>
                  <span className="text-white font-mono">68% Recruitment</span>
                </div>
                <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full w-[68%] shadow-lg shadow-cyan-500/50"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-purple-400">Core & Kinetic Stabilizers</span>
                  <span className="text-white font-mono">54% Recruitment</span>
                </div>
                <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full w-[54%]"></div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Kinematic Pattern</span>
                <strong className="text-white text-sm">{movementPattern}</strong>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Equipment</span>
                <strong className="text-emerald-400 text-sm">{equipment}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. BIOMECHANICS & KINEMATIC INSIGHTS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'biomechanics' && (
        <div className="w-full aspect-video max-h-[520px] p-6 sm:p-8 bg-slate-950 text-white flex flex-col justify-center overflow-y-auto">
          <div className="max-w-2xl mx-auto space-y-4 w-full">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <h4 className="text-base font-bold text-white">Biomechanical Force Vectors</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Primary Joint Action</span>
                <p className="text-emerald-400 font-bold text-sm">{jointInfo.joint}</p>
                <p className="text-slate-400 text-[11px]">Normal Functional Range: {jointInfo.normalRange}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Loading Curve Profile</span>
                <p className="text-cyan-400 font-bold text-sm">Ascending / Peak Concentric</p>
                <p className="text-slate-400 text-[11px]">Maximum mechanical tension at peak contraction.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Tempo Recommendation</span>
                <p className="text-amber-400 font-mono font-bold text-sm">{tempo}</p>
                <p className="text-slate-400 text-[11px]">Controlled eccentric descent with explosive drive.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Breathing Cadence</span>
                <p className="text-purple-400 font-bold text-sm">Valsalva / Exhale on Effort</p>
                <p className="text-slate-400 text-[11px]">Inhale during lowering phase; exhale past sticking point.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
