'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2, Video, AlertCircle, RotateCw } from 'lucide-react';
import { MUSCLE_GROUPS, EQUIPMENT_LIST } from '@/lib/biomechanics';

export default function AdminEditExercisePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
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
  const [breathingInstructions, setBreathingInstructions] = useState('');
  const [tempo, setTempo] = useState('3-0-1-0');
  const [recommendedSets, setRecommendedSets] = useState('3-4');
  const [recommendedReps, setRecommendedReps] = useState('8-12');
  const [recommendedRestSec, setRecommendedRestSec] = useState(90);
  const [safetyTips, setSafetyTips] = useState('');
  const [beginnerAlternative, setBeginnerAlternative] = useState('');
  const [advancedAlternative, setAdvancedAlternative] = useState('');
  const [tags, setTags] = useState('');

  // Media
  const [mediaType, setMediaType] = useState('VIDEO');
  const [mediaUrl, setMediaUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/exercises`)
      .then(res => res.json())
      .then(data => {
        const found = (data.exercises || []).find((e: any) => e.id === id || e.slug === id);
        if (found) {
          setName(found.name);
          setDescription(found.description);
          setPrimaryMuscle(found.primaryMuscle);
          setSecondaryMuscles(found.secondaryMuscles);
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

          setBreathingInstructions(found.breathingInstructions);
          setTempo(found.tempo);
          setRecommendedSets(found.recommendedSets);
          setRecommendedReps(found.recommendedReps);
          setRecommendedRestSec(found.recommendedRestSec);
          setSafetyTips(found.safetyTips);
          setBeginnerAlternative(found.beginnerAlternative || '');
          setAdvancedAlternative(found.advancedAlternative || '');
          setTags(found.tags);

          if (found.media && found.media.length > 0) {
            setMediaType(found.media[0].type);
            setMediaUrl(found.media[0].url);
            setThumbnailUrl(found.media[0].thumbnail || '');
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const setupSteps = setupStepsText.split('\n').filter(s => s.trim().length > 0);
    const executionSteps = executionStepsText.split('\n').filter(s => s.trim().length > 0);

    try {
      const res = await fetch(`/api/admin/exercises/${id}`, {
        method: 'PUT',
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

      if (!res.ok) {
        setError('Failed to update exercise');
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <RotateCw className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-2">
        <Link
          href="/admin/exercises"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-purple-400 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Exercise Manager</span>
        </Link>
        <h1 className="text-3xl font-black text-white">Edit Exercise: {name}</h1>
      </div>

      <form onSubmit={handleUpdate} className="space-y-8 text-xs">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="space-y-1">
            <label className="font-bold text-slate-300 uppercase">Exercise Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300 uppercase">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
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
          </div>
        </div>

        {/* Media */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
            <Video className="w-4 h-4" />
            <span>Demonstration Media URL</span>
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
              <label className="font-bold text-slate-300 uppercase">Media URL</label>
              <input
                type="url"
                value={mediaUrl}
                onChange={e => setMediaUrl(e.target.value)}
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
            <span>{saving ? 'Updating...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
