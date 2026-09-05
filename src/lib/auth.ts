import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

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
  return bcrypt.compare(password, hash);
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

    return user;
  } catch (err) {
    return null;
  }
}
