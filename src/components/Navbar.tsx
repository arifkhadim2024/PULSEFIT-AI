'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Dumbbell, 
  Sparkles, 
  Flame, 
  User, 
  Menu, 
  X, 
  Shield, 
  Layers, 
  Activity, 
  Apple, 
  LogOut, 
  ChevronDown,
  Trophy,
  Search
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Fetch user status
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => setCurrentUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
    setUserDropdownOpen(false);
    router.push('/login');
    router.refresh();
  };

  const navLinks = [
    { href: '/exercises', label: 'Exercises', icon: Dumbbell },
    { href: '/muscles', label: 'Muscles', icon: Layers },
    { href: '/workouts', label: 'Workouts', icon: Flame },
    { href: '/ai-coach', label: 'FitAI Coach', icon: Sparkles, badge: 'AI' },
    { href: '/progress', label: 'Progress', icon: Activity },
    { href: '/nutrition', label: 'Nutrition', icon: Apple },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
              PULSE<span className="text-emerald-400">FIT</span>
              <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                AI
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80 backdrop-blur-md">
          {navLinks.map(link => {
            const isActive = pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-emerald-400'}`} />
                <span>{link.label}</span>
                {link.badge && !isActive && (
                  <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Account / CTA Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {currentUser?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-semibold transition-all"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </Link>
          )}

          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-xs font-semibold text-white"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-[11px]">
                  {currentUser.name?.[0] || 'U'}
                </div>
                <span className="max-w-[90px] truncate">{currentUser.name}</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                  Lv.{currentUser.level || 1}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-xs text-slate-200">
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <p className="font-bold text-white">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-emerald-400 font-bold">
                      <span>🔥 {currentUser.streakDays || 0} Day Streak</span>
                      <span>⚡ {currentUser.xp || 0} XP</span>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span>User Dashboard</span>
                  </Link>
                  <Link
                    href="/prs"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Personal Records</span>
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Profile & Settings</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-xl hover:bg-rose-500/10 text-rose-400 transition-colors mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20"
              >
                Start Training
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-900"
            >
              <div className="flex items-center gap-2.5">
                <link.icon className="w-4 h-4 text-emerald-400" />
                <span>{link.label}</span>
              </div>
            </Link>
          ))}

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {currentUser ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-sm font-bold"
                >
                  <Activity className="w-4 h-4" />
                  <span>My Dashboard ({currentUser.name})</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-rose-400 text-sm font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center rounded-xl bg-slate-900 text-xs font-bold text-slate-200 border border-slate-800"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center rounded-xl bg-emerald-500 text-xs font-bold text-slate-950"
                >
                  Start Training
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
