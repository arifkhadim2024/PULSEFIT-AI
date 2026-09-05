import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import MobileBottomNav from '@/components/MobileBottomNav';
import Footer from '@/components/Footer';
import FloatingAICoach from '@/components/FloatingAICoach';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'FitPulse AI | Complete AI-Powered Fitness & Biomechanics Platform',
  description: 'Master 100+ exercises with AI form analysis, dynamic rest timers, personalized AI workout generation, interactive 3D muscle anatomy explorer, and progress tracking.',
  keywords: ['fitness app', 'AI workout generator', 'exercise library', 'proper form', 'muscle targeting', 'biomechanics', 'workout tracker', 'gym training'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-[#090d16] text-slate-100 min-h-screen flex flex-col selection:bg-emerald-500 selection:text-slate-950`}>
        <Navbar />
        <main className="flex-1 pt-20">
          {children}
        </main>
        <FloatingAICoach />
        <MobileBottomNav />
        <Footer />
      </body>
    </html>
  );
}
