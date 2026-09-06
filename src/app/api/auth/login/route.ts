import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, signToken } from '@/lib/auth';
import { findDemoUser, isDemoPasswordValid } from '@/lib/demo-users';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Please provide both email and password' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Instant Demo User Resolution (Guaranteed 100% uptime for demo/testing on serverless)
    const demoUser = findDemoUser(cleanEmail);
    if (demoUser && isDemoPasswordValid(demoUser, password)) {
      const token = signToken({
        userId: demoUser.id,
        email: demoUser.email,
        name: demoUser.name,
        role: demoUser.role,
      });

      cookies().set('fitpulse_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return NextResponse.json({
        success: true,
        user: {
          id: demoUser.id,
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role,
          avatar: demoUser.avatar,
          xp: demoUser.xp,
          level: demoUser.level,
          streakDays: demoUser.streakDays,
        },
      });
    }

    // 2. Database User Lookup
    try {
      const user = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });

      if (user) {
        const isValid = await verifyPassword(password, user.passwordHash);
        if (!isValid) {
          return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        const token = signToken({
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        });

        cookies().set('fitpulse_session', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        });

        return NextResponse.json({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
            xp: user.xp,
            level: user.level,
            streakDays: user.streakDays,
          },
        });
      }
    } catch (dbErr) {
      console.warn('Prisma DB query failed during login:', dbErr);
      // If demo user tried with incorrect password
      if (demoUser) {
        return NextResponse.json({ error: 'Invalid password. For demo testing, use User@123456' }, { status: 401 });
      }
    }

    // 3. Fallback check for demo user with standard password
    if (demoUser) {
      return NextResponse.json({ error: 'Invalid password for demo account' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Invalid credentials. You can click 1-Click Demo Accounts above to test.' }, { status: 401 });
  } catch (error) {
    console.error('Login route error:', error);
    return NextResponse.json({ error: 'Authentication failed. Please try 1-Click Demo login.' }, { status: 500 });
  }
}
