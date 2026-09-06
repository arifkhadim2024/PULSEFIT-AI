import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { prisma } from './prisma';
import { findDemoUser } from './demo-users';

const JWT_SECRET = process.env.AUTH_SECRET || 'fitpulse-super-secret-jwt-key-change-in-production-32bytes';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface UserSessionPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (e) {
    return false;
  }
}

export function signToken(payload: UserSessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserSessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserSessionPayload;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('fitpulse_session')?.value;

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload?.userId) return null;

    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatar: true,
          fitnessGoal: true,
          experienceLevel: true,
          heightCm: true,
          weightKg: true,
          preferredDays: true,
          preferredDuration: true,
          equipmentAccess: true,
          xp: true,
          level: true,
          streakDays: true,
          lastWorkoutDate: true,
          createdAt: true,
        }
      });

      if (user) return user;
    } catch (dbError) {
      console.warn('Prisma getCurrentUser failed, falling back to resilient token session:', dbError);
    }

    // Fallback: Check if demo user
    const demo = findDemoUser(payload.email);
    if (demo) {
      return {
        id: demo.id,
        email: demo.email,
        name: demo.name,
        role: demo.role,
        avatar: demo.avatar,
        fitnessGoal: demo.fitnessGoal,
        experienceLevel: demo.experienceLevel,
        heightCm: demo.heightCm,
        weightKg: demo.weightKg,
        preferredDays: demo.preferredDays,
        preferredDuration: demo.preferredDuration,
        equipmentAccess: demo.equipmentAccess,
        xp: demo.xp,
        level: demo.level,
        streakDays: demo.streakDays,
        lastWorkoutDate: (demo.lastWorkoutDate ? new Date(demo.lastWorkoutDate) : null) as Date | null,
        createdAt: new Date(demo.createdAt),
      };
    }

    // Fallback minimal user from JWT
    return {
      id: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role || 'USER',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      fitnessGoal: 'strength',
      experienceLevel: 'intermediate',
      heightCm: 178,
      weightKg: 78,
      preferredDays: 4,
      preferredDuration: 45,
      equipmentAccess: 'full_gym',
      xp: 500,
      level: 2,
      streakDays: 3,
      lastWorkoutDate: null as Date | null,
      createdAt: new Date(),
    };
  } catch (err) {
    return null;
  }
}
