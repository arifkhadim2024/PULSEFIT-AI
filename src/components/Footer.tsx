import React from 'react';
import Link from 'next/link';
import { Dumbbell, ShieldAlert, Heart, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-sm mt-20 pb-20 md:pb-12 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Dumbbell className="w-4 h-4" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                PULSE<span className="text-emerald-400">FIT</span> AI
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Next-generation biomechanics, AI workout architecture, and form education built for lifters of all levels.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Explore</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/exercises" className="hover:text-emerald-400 transition-colors">100+ Exercise Library</Link></li>
              <li><Link href="/muscles" className="hover:text-emerald-400 transition-colors">Anatomical Muscle Map</Link></li>
              <li><Link href="/workouts" className="hover:text-emerald-400 transition-colors">Workout Programs</Link></li>
              <li><Link href="/workouts/ai-generator" className="hover:text-emerald-400 transition-colors">AI Workout Generator</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Tools & Science</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/ai-coach" className="hover:text-emerald-400 transition-colors">FitAI Biomechanics Coach</Link></li>
              <li><Link href="/nutrition" className="hover:text-emerald-400 transition-colors">TDEE & Macro Calculator</Link></li>
              <li><Link href="/progress" className="hover:text-emerald-400 transition-colors">Strength & Volume Tracker</Link></li>
              <li><Link href="/prs" className="hover:text-emerald-400 transition-colors">1RM & PR Wall of Fame</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Account & Access</h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/login" className="hover:text-emerald-400 transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-emerald-400 transition-colors">Create Free Account</Link></li>
              <li><Link href="/admin" className="hover:text-purple-400 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* Health & Safety Disclaimer */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 mb-8 flex items-start gap-3 text-xs text-slate-400 leading-relaxed">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-200 block mb-0.5">Important Health & Fitness Disclaimer:</strong>
            FitPulse is an educational training and workout tracking platform. The exercise demonstrations, tempo pacing, and AI recommendations are provided strictly for educational and physical conditioning purposes and do not constitute medical advice or diagnosis. Always consult a qualified physician or healthcare provider before commencing any strenuous exercise program.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 border-t border-slate-900 pt-6">
          <p>© {new Date().getFullYear()} PulseFit AI. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Powered by Biomechanics AI & Evidence-Based Exercise Science</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
