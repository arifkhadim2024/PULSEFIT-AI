'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Shield, ArrowLeft, RotateCw, CheckCircle2 } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      fetchUsers();
    } catch (err) {
      alert('Failed to update role');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-purple-400 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Portal</span>
        </Link>
        <h1 className="text-3xl font-black text-white">Registered User Directory</h1>
        <p className="text-xs text-slate-400 mt-1">Inspect trainee profiles and assign administrative privileges.</p>
      </div>

      {loading ? (
        <div className="p-20 text-center">
          <RotateCw className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
        </div>
      ) : (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Goal</th>
                  <th className="p-4">Experience</th>
                  <th className="p-4">Level & Streak</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="p-4">
                      <strong className="text-white block font-bold text-sm">{u.name}</strong>
                      <span className="text-[11px] text-slate-400">{u.email}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        u.role === 'ADMIN'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 capitalize">{u.fitnessGoal?.replace('_', ' ')}</td>
                    <td className="p-4 text-slate-300 capitalize">{u.experienceLevel}</td>
                    <td className="p-4">
                      <span className="text-purple-400 font-bold font-mono">Lv.{u.level}</span>
                      <span className="text-slate-400 ml-2 font-mono">🔥 {u.streakDays}d</span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => toggleRole(u.id, u.role)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold"
                      >
                        {u.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
