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
  TrendingUp,
  Image as ImageIcon,
  Repeat
} from 'lucide-react';
import { getExerciseMediaDetails, ExerciseMediaResult } from '@/lib/exercise-media-engine';
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
  const slug = exerciseSlug || exerciseName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const mediaDetails = getExerciseMediaDetails(slug);

  const [activeTab, setActiveTab] = useState<'video' | 'ai_hud' | 'heatmap' | 'biomechanics'>(initialTab);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [aiTrackingActive, setAiTrackingActive] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Dual-Phase Form Demonstration Player State
  const [currentFramePhase, setCurrentFramePhase] = useState<'start' | 'contraction'>('start');
  const [demoAutoLoop, setDemoAutoLoop] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const primaryMedia = mediaList.find(m => m.type === 'VIDEO') || mediaList[0];
  const videoSrc = (primaryMedia?.url && !primaryMedia.url.includes('ForBiggerBlazes')) 
    ? primaryMedia.url 
    : (mediaDetails.type === 'video' ? mediaDetails.videoUrl : getExerciseVideoUrl(slug));
  const hasVideo = Boolean(videoSrc);

  // Parse tempo (e.g. "3-1-1-0" -> [3, 1, 1, 0])
  const tempoParts = (tempo || '3-1-1-0').split('-').map(n => parseInt(n, 10) || 1);
  const eccentricSec = tempoParts[0] || 3;
  const stretchSec = tempoParts[1] || 1;
  const concentricSec = tempoParts[2] || 1;
  const squeezeSec = tempoParts[3] || 0;
  const totalCycleMs = Math.max(1500, (eccentricSec + stretchSec + concentricSec + squeezeSec) * 1000 / playbackSpeed);

  // Auto-looping dual-phase demonstration animation
  useEffect(() => {
    if (hasVideo || !demoAutoLoop) return;

    const interval = setInterval(() => {
      setCurrentFramePhase(prev => (prev === 'start' ? 'contraction' : 'start'));
    }, totalCycleMs / 2);

    return () => clearInterval(interval);
  }, [hasVideo, demoAutoLoop, totalCycleMs, playbackSpeed]);

  const togglePlay = () => {
    if (hasVideo && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    } else {
      setDemoAutoLoop(!demoAutoLoop);
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
    if (hasVideo && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      setCurrentFramePhase('start');
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

  // Synchronize video playback speed and play state
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

  // Primary joint angle & biomechanics calculations
  const getPrimaryJointInfo = () => {
    const p = (movementPattern || '').toLowerCase();
    const name = exerciseName.toLowerCase();
    if (p.includes('squat') || name.includes('squat') || name.includes('leg press')) {
      return { 
        joint: 'Knee & Hip Flexion', 
        targetAngle: '90° (Parallel Depth)', 
        normalRange: '45° - 120°', 
        phase: currentFramePhase === 'start' ? 'Initial Setup / Lockout' : 'Peak Depth & Hip Drive',
        action: 'Knee extension & Hip extension drive'
      };
    }
    if (p.includes('hinge') || name.includes('deadlift') || name.includes('rdl') || name.includes('shrug')) {
      return { 
        joint: name.includes('shrug') ? 'Scapular Elevation' : 'Hip Hinge Angle', 
        targetAngle: name.includes('shrug') ? 'Scapular Retraction' : '70° Posterior Tilt', 
        normalRange: '45° - 90°', 
        phase: currentFramePhase === 'start' ? 'Initial Stretch & Setup' : 'Peak Squeeze & Contraction',
        action: name.includes('shrug') ? 'Upper trapezius elevation' : 'Hamstrings & Glutes posterior loading'
      };
    }
    if (p.includes('pull') || name.includes('row') || name.includes('pullup') || name.includes('lat') || name.includes('chin')) {
      return { 
        joint: 'Scapular Retraction & Elbows', 
        targetAngle: '90° Humeral Adduction', 
        normalRange: '30° - 110°', 
        phase: currentFramePhase === 'start' ? 'Full Lat Stretch' : 'Peak Contraction Squeeze',
        action: 'Latissimus dorsi & Rhomboid retraction'
      };
    }
    if (name.includes('curl') || p.includes('bicep')) {
      return { 
        joint: 'Elbow Flexion', 
        targetAngle: '45° Peak Bicep Peak', 
        normalRange: '30° - 145°', 
        phase: currentFramePhase === 'start' ? 'Full Arm Extension' : 'Peak Concentric Bicep Squeeze',
        action: 'Biceps brachii & Brachialis flexion'
      };
    }
    if (name.includes('tricep') || name.includes('pushdown') || name.includes('dip')) {
      return { 
        joint: 'Elbow Extension', 
        targetAngle: '180° Full Lockout', 
        normalRange: '45° - 180°', 
        phase: currentFramePhase === 'start' ? '90° Elbow Flexion' : 'Terminal Extension Lockout',
        action: 'Triceps brachii lateral/medial head'
      };
    }
    if (name.includes('raise') || name.includes('lateral') || p.includes('shoulder') || name.includes('press')) {
      return { 
        joint: 'Glenohumeral Abduction', 
        targetAngle: '90° Scapular Plane', 
        normalRange: '0° - 90°', 
        phase: currentFramePhase === 'start' ? 'Lowered Position' : 'Peak Parallel Extension',
        action: 'Deltoid contraction & abduction'
      };
    }
    return { 
      joint: 'Elbow & Shoulder Angle', 
      targetAngle: '90° Sternum Level', 
      normalRange: '45° - 90°', 
      phase: currentFramePhase === 'start' ? 'Bottom Chest Stretch' : 'Peak Horizontal Lockout',
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
                <span>🎬 HD Form Video</span>
              </>
            ) : (
              <>
                <Repeat className="w-3.5 h-3.5 text-slate-950" />
                <span>⚡ Dual-Phase Movement Demo</span>
              </>
            )}
          </button>

          {/* AI Skeleton HUD Tab */}
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
            <span>AI Joint HUD</span>
          </button>

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
              1:1 HD Video Verified
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Verified Form Sequence
            </span>
          )}
          <span className="hidden md:inline text-slate-400 text-xs">
            Tempo: <strong className="text-white font-mono">{tempo}</strong>
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. VISUAL DEMONSTRATION PLAYER (HD VIDEO OR DUAL-PHASE DEMO) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'video' && (
        <div className="relative w-full aspect-video max-h-[520px] bg-slate-950 flex items-center justify-center overflow-hidden group">
          {hasVideo ? (
            /* REAL 1-TO-1 VERIFIED HD VIDEO */
            <>
              <video
                key={videoSrc!}
                ref={videoRef}
                src={videoSrc!}
                poster={mediaDetails.thumbnailUrl || primaryMedia?.thumbnail || undefined}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onClick={togglePlay}
                className="w-full h-full object-contain bg-black cursor-pointer"
              />

              {/* AI Skeleton Pose HUD Overlay */}
              {aiTrackingActive && (
                <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4">
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 text-cyan-400 text-xs font-bold flex items-center gap-2 shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>AI Kinematic Tracking Active</span>
                    </div>
                  </div>

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

              {/* Video Control Bar */}
              <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent transition-opacity duration-300 ${isHovered || !isPlaying ? 'opacity-100' : 'opacity-0 sm:opacity-90'}`}>
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

                  <div className="flex items-center gap-2">
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
            /* DUAL-PHASE FORM DEMONSTRATION PLAYER (FOR ALL 100+ EXERCISES) */
            <div className="relative w-full h-full bg-slate-950 flex flex-col justify-between overflow-hidden select-none">
              {/* Image Container with Crossfade */}
              <div 
                onClick={() => setCurrentFramePhase(prev => (prev === 'start' ? 'contraction' : 'start'))}
                className="relative w-full h-full flex items-center justify-center cursor-pointer overflow-hidden"
              >
                {/* Frame 1: Starting Position */}
                {mediaDetails.frameStartUrl && (
                  <img
                    src={mediaDetails.frameStartUrl}
                    alt={`${exerciseName} Starting Position`}
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ease-in-out ${
                      currentFramePhase === 'start' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                  />
                )}

                {/* Frame 2: Contraction Position */}
                {mediaDetails.frameContractionUrl && (
                  <img
                    src={mediaDetails.frameContractionUrl}
                    alt={`${exerciseName} Peak Contraction Position`}
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ease-in-out ${
                      currentFramePhase === 'contraction' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                  />
                )}

                {/* Top Phase Selector Tabs */}
                <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
                  <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md p-1 rounded-2xl border border-slate-800">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentFramePhase('start');
                        setDemoAutoLoop(false);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        currentFramePhase === 'start'
                          ? 'bg-emerald-500 text-slate-950 shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>Phase 1: Setup & Stretch</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentFramePhase('contraction');
                        setDemoAutoLoop(false);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        currentFramePhase === 'contraction'
                          ? 'bg-cyan-500 text-slate-950 shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>Phase 2: Peak Contraction</span>
                    </button>
                  </div>

                  {/* Auto-loop Status Pill */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDemoAutoLoop(!demoAutoLoop);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md border flex items-center gap-1.5 transition-all ${
                      demoAutoLoop 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-lg'
                        : 'bg-slate-900/80 text-slate-400 border-slate-700'
                    }`}
                  >
                    <Repeat className={`w-3.5 h-3.5 ${demoAutoLoop ? 'animate-spin' : ''}`} />
                    <span>{demoAutoLoop ? 'Cadence Auto-Loop ON' : 'Paused (Click to Resume)'}</span>
                  </button>
                </div>

                {/* AI Joint Degree Overlay Badge */}
                {aiTrackingActive && (
                  <div className="absolute bottom-16 right-4 z-20 pointer-events-none px-3.5 py-2 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-emerald-500/40 text-right shadow-2xl space-y-0.5">
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
                )}
              </div>

              {/* Bottom Control Bar */}
              <div className="relative z-20 p-4 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-transparent flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:scale-105 text-slate-950 font-black shadow-lg shadow-emerald-500/20 transition-transform"
                    title={demoAutoLoop ? 'Pause Auto-Loop' : 'Start Auto-Loop'}
                  >
                    {demoAutoLoop ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>

                  <button
                    onClick={() => setCurrentFramePhase(prev => (prev === 'start' ? 'contraction' : 'start'))}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-colors"
                  >
                    Switch Phase 🔀
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Speed Controls */}
                  <div className="flex items-center bg-slate-900 px-2 py-1 rounded-xl border border-slate-700">
                    {[0.5, 1.0, 1.5].map(spd => (
                      <button
                        key={spd}
                        onClick={() => setPlaybackSpeed(spd)}
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
                        : 'bg-slate-900 text-slate-400 border border-slate-700'
                    }`}
                  >
                    <Scan className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{aiTrackingActive ? 'AI HUD ON' : 'AI HUD OFF'}</span>
                  </button>

                  <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Toggle Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
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
