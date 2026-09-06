'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Film, 
  AlertCircle, 
  RotateCw, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  Play,
  Layers,
  Check
} from 'lucide-react';
import { MUSCLE_GROUPS, EQUIPMENT_LIST } from '@/lib/biomechanics';
import { getExerciseVideoUrl } from '@/lib/exercise-videos';

export default function AdminEditExercisePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [aliases, setAliases] = useState('');
  const [description, setDescription] = useState('');
  const [primaryMuscle, setPrimaryMuscle] = useState('Chest');
  const [secondaryMuscles, setSecondaryMuscles] = useState('');
  const [bodyPart, setBodyPart] = useState('Chest');
  const [equipment, setEquipment] = useState('Barbell');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [movementPattern, setMovementPattern] = useState('Horizontal Push');
  const [instructions, setInstructions] = useState('');
  const [setupStepsText, setSetupStepsText] = useState('');
  const [executionStepsText, setExecutionStepsText] = useState('');
  const [formCuesText, setFormCuesText] = useState('');
  const [breathingInstructions, setBreathingInstructions] = useState('');
  const [tempo, setTempo] = useState('3-0-1-0');
  const [recommendedSets, setRecommendedSets] = useState('3-4');
  const [recommendedReps, setRecommendedReps] = useState('8-12');
  const [recommendedRestSec, setRecommendedRestSec] = useState(90);
  const [safetyTips, setSafetyTips] = useState('');
  const [beginnerAlternative, setBeginnerAlternative] = useState('');
  const [advancedAlternative, setAdvancedAlternative] = useState('');
  const [tags, setTags] = useState('');

  // Verification & Quality Control
  const [verificationStatus, setVerificationStatus] = useState<'verified' | 'needs_review' | 'draft'>('verified');
  const [videoVerified, setVideoVerified] = useState(true);
  const [videoSource, setVideoSource] = useState('Kaggle: hasyimabdillah/workoutfitness-video');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  // Quality Control Checklist state
  const [chkNameCorrect, setChkNameCorrect] = useState(true);
  const [chkVideoMatch, setChkVideoMatch] = useState(true);
  const [chkMusclesCorrect, setChkMusclesCorrect] = useState(true);
  const [chkEquipmentCorrect, setChkEquipmentCorrect] = useState(true);
  const [chkInstructionsCorrect, setChkInstructionsCorrect] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/exercises`)
      .then(res => res.json())
      .then(data => {
        const found = (data.exercises || []).find((e: any) => e.id === id || e.slug === id);
        if (found) {
          setName(found.name);
          setSlug(found.slug);
          setAliases(found.aliases || '');
          setDescription(found.description);
          setPrimaryMuscle(found.primaryMuscle);
          setSecondaryMuscles(found.secondaryMuscles || '');
          setBodyPart(found.bodyPart);
          setEquipment(found.equipment);
          setDifficulty(found.difficulty);
          setMovementPattern(found.movementPattern);
          setInstructions(found.instructions);

          try {
            const ss = JSON.parse(found.setupSteps || '[]');
            setSetupStepsText(ss.join('\n'));
          } catch (e) {
            setSetupStepsText(found.setupSteps || '');
          }

          try {
            const es = JSON.parse(found.executionSteps || '[]');
            setExecutionStepsText(es.join('\n'));
          } catch (e) {
            setExecutionStepsText(found.executionSteps || '');
          }

          try {
            const fc = JSON.parse(found.formCues || '[]');
            setFormCuesText(fc.join('\n'));
          } catch (e) {
            setFormCuesText(found.formCues || '');
          }

          setBreathingInstructions(found.breathingInstructions);
          setTempo(found.tempo);
          setRecommendedSets(found.recommendedSets);
          setRecommendedReps(found.recommendedReps);
          setRecommendedRestSec(found.recommendedRestSec);
          setSafetyTips(found.safetyTips);
          setBeginnerAlternative(found.beginnerAlternative || '');
          setAdvancedAlternative(found.advancedAlternative || '');
          setTags(found.tags);

          setVerificationStatus(found.verificationStatus || (found.videoVerified ? 'verified' : 'needs_review'));
          setVideoVerified(Boolean(found.videoVerified));
          setVideoSource(found.videoSource || 'Kaggle: hasyimabdillah/workoutfitness-video');
          setVideoUrl(found.videoUrl || (found.media && found.media[0]?.url) || getExerciseVideoUrl(found.slug) || '');
          setThumbnailUrl(found.thumbnailUrl || (found.media && found.media[0]?.thumbnail) || '');
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const setupSteps = setupStepsText.split('\n').map(s => s.trim()).filter(Boolean);
    const executionSteps = executionStepsText.split('\n').map(s => s.trim()).filter(Boolean);
    const formCues = formCuesText.split('\n').map(s => s.trim()).filter(Boolean);

    try {
      const res = await fetch(`/api/admin/exercises/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          aliases,
          description,
          primaryMuscle,
          secondaryMuscles,
          bodyPart,
          equipment,
          difficulty,
          movementPattern,
          instructions,
          setupSteps: JSON.stringify(setupSteps),
          executionSteps: JSON.stringify(executionSteps),
          formCues: JSON.stringify(formCues),
          breathingInstructions,
          tempo,
          recommendedSets,
          recommendedReps,
          recommendedRestSec,
          safetyTips,
          beginnerAlternative,
          advancedAlternative,
          tags,
          verificationStatus,
          videoVerified: verificationStatus === 'verified' && Boolean(videoUrl),
          videoSource,
          videoUrl: videoUrl || null,
          thumbnailUrl: thumbnailUrl || null,
          mediaUrl: videoUrl || null,
          mediaType: 'VIDEO',
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to update exercise');
      }

      router.push('/admin/exercises');
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;

    try {
      await fetch(`/api/admin/exercises/${id}`, { method: 'DELETE' });
      router.push('/admin/exercises');
    } catch (err) {
      alert('Failed to delete exercise');
    }
  };

  if (loading) {
    return (
      <div className="p-20 text-center">
        <RotateCw className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/exercises"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-purple-400 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Exercises Manager</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-white">Edit & Verify: {name}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
              verificationStatus === 'verified'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}>
              {verificationStatus === 'verified' ? 'Verified Match' : 'Needs Review'}
            </span>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Exercise</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Form on Left, Live Video Preview & Quality Control on Right */}
      <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Comprehensive Exercise Metadata Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Basic Identity */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Exercise Identity & Taxonomy</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Exercise Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-300 font-mono text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Alternative Names (Aliases)</label>
                  <input
                    type="text"
                    value={aliases}
                    onChange={e => setAliases(e.target.value)}
                    placeholder="e.g. Flat Bench, Chest Press"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Scientific Overview & Biomechanics Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Muscle Anatomy & Movement */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Anatomical Targeting & Mechanics</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Primary Muscle (Prime Mover) *</label>
                <select
                  value={primaryMuscle}
                  onChange={e => setPrimaryMuscle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                >
                  {MUSCLE_GROUPS.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Body Part Region</label>
                <select
                  value={bodyPart}
                  onChange={e => setBodyPart(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                >
                  {['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Full Body'].map(bp => (
                    <option key={bp} value={bp}>{bp}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-400 font-bold block mb-1">Secondary Synergists (Comma-separated)</label>
                <input
                  type="text"
                  value={secondaryMuscles}
                  onChange={e => setSecondaryMuscles(e.target.value)}
                  placeholder="e.g. Triceps, Front Deltoids, Serratus Anterior"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Equipment</label>
                <select
                  value={equipment}
                  onChange={e => setEquipment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                >
                  {EQUIPMENT_LIST.map(eq => (
                    <option key={eq} value={eq}>{eq}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Movement Pattern</label>
                <select
                  value={movementPattern}
                  onChange={e => setMovementPattern(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                >
                  {['Horizontal Push', 'Horizontal Pull', 'Vertical Push', 'Vertical Pull', 'Squat', 'Hinge', 'Lunge', 'Carry', 'Isolation'].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Step-by-Step Instructions & Cues */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">
              Step-by-Step Execution & Form Cues
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Setup Steps (1 per line)</label>
                <textarea
                  rows={3}
                  value={setupStepsText}
                  onChange={e => setSetupStepsText(e.target.value)}
                  placeholder="Lie flat on bench with eyes under barbell..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Execution Steps (1 per line)</label>
                <textarea
                  rows={4}
                  value={executionStepsText}
                  onChange={e => setExecutionStepsText(e.target.value)}
                  placeholder="Inhale and lower the barbell in an arc toward lower sternum..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Breathing Cadence Instructions</label>
                <input
                  type="text"
                  value={breathingInstructions}
                  onChange={e => setBreathingInstructions(e.target.value)}
                  placeholder="Inhale on descent; exhale past the sticking point."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Video Preview, Verification Settings & Quality Control Checklist */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Video Preview Box */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <Film className="w-4 h-4 text-cyan-400" />
              <span>Exercise Demonstration Video Preview</span>
            </h3>

            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-inner">
              {videoUrl ? (
                <video
                  key={videoUrl}
                  src={videoUrl}
                  autoPlay
                  loop
                  muted
                  controls
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <div className="p-6 text-center space-y-2">
                  <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                  <p className="text-xs font-bold text-white">No Video URL Configured</p>
                  <p className="text-[10px] text-slate-400">
                    Add a verified video URL below to enable video demonstration.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Video Demonstration URL (MP4 / WebM)</label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  placeholder="/videos/exercises/bench-press.mp4"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-[11px] focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Verified Video Source</label>
                <input
                  type="text"
                  value={videoSource}
                  onChange={e => setVideoSource(e.target.value)}
                  placeholder="Kaggle: hasyimabdillah/workoutfitness-video"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-300 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Verification Status Selector */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-purple-500/30 space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Verification Status</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => {
                  setVerificationStatus('verified');
                  setVideoVerified(true);
                }}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  verificationStatus === 'verified'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 font-bold shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                <span>1:1 Verified Match</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setVerificationStatus('needs_review');
                  setVideoVerified(false);
                }}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  verificationStatus === 'needs_review'
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500 font-bold shadow-lg shadow-amber-500/20'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                <span>Needs Review</span>
              </button>
            </div>

            {/* Quality Control Checklist */}
            <div className="pt-3 border-t border-slate-800 space-y-2.5 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Quality Control Verification Checklist
              </span>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={chkNameCorrect}
                  onChange={e => setChkNameCorrect(e.target.checked)}
                  className="rounded border-slate-700 text-purple-500 focus:ring-purple-400"
                />
                <span>Exercise name is accurate & non-duplicate</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={chkVideoMatch}
                  onChange={e => setChkVideoMatch(e.target.checked)}
                  className="rounded border-slate-700 text-purple-500 focus:ring-purple-400"
                />
                <span>Video visually shows THIS EXACT movement</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={chkMusclesCorrect}
                  onChange={e => setChkMusclesCorrect(e.target.checked)}
                  className="rounded border-slate-700 text-purple-500 focus:ring-purple-400"
                />
                <span>Primary & Secondary muscles verified</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={chkEquipmentCorrect}
                  onChange={e => setChkEquipmentCorrect(e.target.checked)}
                  className="rounded border-slate-700 text-purple-500 focus:ring-purple-400"
                />
                <span>Equipment & Pattern match movement</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={chkInstructionsCorrect}
                  onChange={e => setChkInstructionsCorrect(e.target.checked)}
                  className="rounded border-slate-700 text-purple-500 focus:ring-purple-400"
                />
                <span>Execution steps & breathing verified</span>
              </label>
            </div>
          </div>

          {/* Submit Save Button */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between gap-3">
            <Link
              href="/admin/exercises"
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 disabled:opacity-50 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all"
            >
              {saving ? <RotateCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Saving Changes...' : 'Save & Publish Updates'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
