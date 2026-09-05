'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, ArrowLeft, Save, Dumbbell, Video, Layers, AlertCircle } from 'lucide-react';
import { MUSCLE_GROUPS, EQUIPMENT_LIST } from '@/lib/biomechanics';

export default function AdminNewExercisePage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [primaryMuscle, setPrimaryMuscle] = useState('Chest');
  const [secondaryMuscles, setSecondaryMuscles] = useState('');
  const [bodyPart, setBodyPart] = useState('Chest');
  const [equipment, setEquipment] = useState('Barbell');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [movementPattern, setMovementPattern] = useState('Horizontal Push');
  const [instructions, setInstructions] = useState('');
  const [setupStepsText, setSetupStepsText] = useState('1. Set body posture and grip.\n2. Retract scapulae.');
  const [executionStepsText, setExecutionStepsText] = useState('1. Lower weight controlled.\n2. Press upward forcefully.');
  const [breathingInstructions, setBreathingInstructions] = useState('Inhale on descent, exhale on press.');
  const [tempo, setTempo] = useState('3-0-1-0');
  const [recommendedSets, setRecommendedSets] = useState('3-4');
  const [recommendedReps, setRecommendedReps] = useState('8-12');
  const [recommendedRestSec, setRecommendedRestSec] = useState(90);
  const [safetyTips, setSafetyTips] = useState('Keep core braced and wrists straight.');
  const [beginnerAlternative, setBeginnerAlternative] = useState('');
  const [advancedAlternative, setAdvancedAlternative] = useState('');
  const [tags, setTags] = useState('');

  // Media
  const [mediaType, setMediaType] = useState('VIDEO');
  const [mediaUrl, setMediaUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !primaryMuscle) return;

    setSaving(true);
    setError(null);

    const setupSteps = setupStepsText.split('\n').filter(s => s.trim().length > 0);
    const executionSteps = executionStepsText.split('\n').filter(s => s.trim().length > 0);

    try {
      const res = await fetch('/api/admin/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          primaryMuscle,
          secondaryMuscles,
          bodyPart,
          equipment,
          difficulty,
          movementPattern,
          instructions,
          setupSteps,
          executionSteps,
          breathingInstructions,
          tempo,
          recommendedSets,
          recommendedReps,
          recommendedRestSec,
          safetyTips,
          beginnerAlternative,
          advancedAlternative,
          tags,
          mediaType,
          mediaUrl,
          thumbnailUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create exercise');
        setSaving(false);
        return;
      }

      router.push('/admin/exercises');
      router.refresh();
    } catch (err) {
      setError('An error occurred');
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Link
          href="/admin/exercises"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-purple-400 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Exercise Manager</span>
        </Link>
        <h1 className="text-3xl font-black text-white">Create New Exercise</h1>
        <p className="text-xs text-slate-400">Add a verified gym exercise to the database with biomechanical metadata.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8 text-xs">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Basic Information */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400">
            1. Core Exercise Details
          </h3>

          <div className="space-y-1">
            <label className="font-bold text-slate-300 uppercase">Exercise Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Incline Cable Chest Fly"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300 uppercase">Description / Overview</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Biomechanical purpose and target head..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase">Primary Muscle</label>
              <select
                value={primaryMuscle}
                onChange={e => setPrimaryMuscle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
              >
                {MUSCLE_GROUPS.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase">Secondary Synergists</label>
              <input
                type="text"
                value={secondaryMuscles}
                onChange={e => setSecondaryMuscles(e.target.value)}
                placeholder="e.g. Front Delts, Triceps"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase">Equipment</label>
              <select
                value={equipment}
                onChange={e => setEquipment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
              >
                {EQUIPMENT_LIST.map(eq => (
                  <option key={eq} value={eq}>{eq}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase">Difficulty</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase">Movement Pattern</label>
              <select
                value={movementPattern}
                onChange={e => setMovementPattern(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
              >
                <option value="Horizontal Push">Horizontal Push</option>
                <option value="Horizontal Pull">Horizontal Pull</option>
                <option value="Vertical Push">Vertical Push</option>
                <option value="Vertical Pull">Vertical Pull</option>
                <option value="Squat">Squat</option>
                <option value="Hinge">Hinge</option>
                <option value="Lunge">Lunge</option>
                <option value="Isolation">Isolation</option>
              </select>
            </div>
          </div>
        </div>

        {/* Biomechanics & Form Analysis */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400">
            2. Form Instructions & Cadence
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase">Setup Steps (1 per line)</label>
              <textarea
                rows={3}
                value={setupStepsText}
                onChange={e => setSetupStepsText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase">Execution Steps (1 per line)</label>
              <textarea
                rows={3}
                value={executionStepsText}
                onChange={e => setExecutionStepsText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase">Tempo</label>
              <input
                type="text"
                value={tempo}
                onChange={e => setTempo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase">Recommended Sets</label>
              <input
                type="text"
                value={recommendedSets}
                onChange={e => setRecommendedSets(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase">Recommended Reps</label>
              <input
                type="text"
                value={recommendedReps}
                onChange={e => setRecommendedReps(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase">Rest Sec</label>
              <input
                type="number"
                value={recommendedRestSec}
                onChange={e => setRecommendedRestSec(parseInt(e.target.value, 10))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300 uppercase">Safety & Joint Cues</label>
            <input
              type="text"
              value={safetyTips}
              onChange={e => setSafetyTips(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
            />
          </div>
        </div>

        {/* Media & Demonstration Video */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
            <Video className="w-4 h-4" />
            <span>3. Demonstration Media & URLs</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase">Media Format</label>
              <select
                value={mediaType}
                onChange={e => setMediaType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
              >
                <option value="VIDEO">MP4 / WebM Video</option>
                <option value="GIF">Animated GIF</option>
                <option value="IMAGE">Static Image</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-300 uppercase">Video or GIF URL</label>
              <input
                type="url"
                value={mediaUrl}
                onChange={e => setMediaUrl(e.target.value)}
                placeholder="https://commondatastorage.googleapis.com/.../video.mp4"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/admin/exercises"
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs shadow-lg shadow-purple-500/25 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Creating Exercise...' : 'Publish to Exercise Library'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
