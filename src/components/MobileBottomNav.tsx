'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Dumbbell, Flame, Sparkles, User } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on active workout player session screen to give maximum full-screen focus
  if (pathname === '/workout/session') return null;

  const items = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/exercises', label: 'Exercises', icon: Dumbbell },
    { href: '/workouts', label: 'Workouts', icon: Flame },
    { href: '/ai-coach', label: 'FitAI', icon: Sparkles },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2">
      <div className="flex items-center justify-around">
        {items.map(item => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                isActive ? 'text-emerald-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-xl ${isActive ? 'bg-emerald-500/15' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
