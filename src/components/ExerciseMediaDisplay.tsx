'use client';

import React, { useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Activity, Video, Image as ImageIcon, Volume2, VolumeX, Eye } from 'lucide-react';

interface ExerciseMediaDisplayProps {
  exerciseName: string;
  primaryMuscle: string;
  mediaList?: {
    id: string;
    type: string;
    url: string;
    thumbnail?: string | null;
    provider: string;
  }[];
  movementPattern?: string;
  tempo?: string;
}

export default function ExerciseMediaDisplay({
  exerciseName,
  primaryMuscle,
  mediaList = [],
  movementPattern = 'Horizontal Push',
  tempo = '3-0-1-0',
}: ExerciseMediaDisplayProps) {
  const [activeTab, setActiveTab] = useState<'video' | 'biomechanics' | 'heatmap'>('video');
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
      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'video'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Demonstration Media</span>
          </button>

          <button
            onClick={() => setActiveTab('biomechanics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'biomechanics'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Biomechanics Model</span>
          </button>

          <button
            onClick={() => setActiveTab('heatmap')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'heatmap'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Muscle Activation</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Form Cadence: <strong className="text-white">{tempo}</strong></span>
        </div>
      </div>

      {/* Media Canvas Viewport */}
      <div className="relative w-full aspect-video sm:aspect-[16/10] max-h-[440px] bg-slate-950 flex items-center justify-center overflow-hidden">
        {activeTab === 'video' && (
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
              /* Fallback animated visualizer with rich exercise mockup backdrop */
              <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 p-6 text-center">
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-15"></div>
                <div className="relative z-10 flex flex-col items-center max-w-md">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400 shadow-xl shadow-emerald-500/10 animate-pulse">
                    <Activity className="w-10 h-10" />
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
        )}

        {activeTab === 'biomechanics' && (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-950 text-white relative">
            <div className="text-center max-w-md space-y-3 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                Kinematic Movement Analysis
              </div>
              <h4 className="text-xl font-bold">{exerciseName} - Biomechanical Arc</h4>
              
              {/* Dynamic Step Phase Indicators */}
              <div className="grid grid-cols-3 gap-2 text-left text-xs pt-2">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <span className="text-emerald-400 font-bold block mb-1">1. Setup</span>
                  <p className="text-slate-400 text-[11px]">Neutral spine, packed scapulae, tight abdominal brace.</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <span className="text-cyan-400 font-bold block mb-1">2. Eccentric (3s)</span>
                  <p className="text-slate-400 text-[11px]">Loaded stretch under controlled tempo along joint plane.</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                  <span className="text-amber-400 font-bold block mb-1">3. Concentric (1s)</span>
                  <p className="text-slate-400 text-[11px]">Forceful acceleration through mid-foot / palms to peak.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'heatmap' && (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-950 text-white">
            <div className="w-full max-w-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider text-center">
                Muscular Activation Breakdown
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-emerald-400">{primaryMuscle} (Primary Target)</span>
                    <span className="text-white">85% EMG Activity</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-[85%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-cyan-400">Synergist & Stabilizer Groups</span>
                    <span className="text-white">55% EMG Activity</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full w-[55%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-amber-400">Core & Spinal Bracing</span>
                    <span className="text-white">40% EMG Activity</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full w-[40%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
