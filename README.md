# FitPulse AI — Complete AI-Powered Fitness & Biomechanics Platform

A modern, full-stack fitness application engineered for lifters of all experience levels — from complete beginners mastering barbell mechanics to advanced trainees tracking progressive overload and 1RM strength curves.

---

## 🌟 Key Features

### 1. Comprehensive Exercise Library (117+ Seeded Exercises)
- Complete coverage across 14+ muscle groups: **Chest, Back, Shoulders, Biceps, Triceps, Forearms, Abs/Core, Glutes, Quadriceps, Hamstrings, Calves, Traps, Lower Back, Adductors, and Abductors**.
- Each exercise includes:
  - Primary and secondary muscle targets with EMG activation estimates.
  - Equipment specifications and difficulty level.
  - Step-by-step setup and execution biomechanics.
  - Breathing and intra-abdominal pressure protocols.
  - Interactive **Tempo Metronome (e.g. 3-1-1-0 cadence visualizer)** with Web Audio ticks.
  - Common technique mistakes vs biomechanical corrections table.
  - Beginner regressions and advanced progressions with direct links.
  - Demonstration video and animated kinematic vector loops.

### 2. Interactive Anatomical Muscle Map
- Front (Anterior) and Back (Posterior) interactive SVG body canvas.
- Click or hover any muscle region (Pectorals, Deltoids, Lats, Quads, Hamstrings, Glutes, Calves, etc.) to immediately inspect biomechanics and filter targeted exercises.

### 3. Exercise Comparison Matrix (`/exercises/compare`)
- Side-by-side comparison between any two exercises (e.g., *Barbell Bench Press* vs *Dumbbell Bench Press* or *Barbell Squat* vs *Bulgarian Split Squat*).
- Compares primary/secondary recruitment, movement patterns, stability requirements, tempo, and rep schemes.

### 4. AI Training Program Architect (`/workouts/ai-generator`)
- 4-step dynamic questionnaire asking for training goal, experience level, days per week, session duration, equipment access, and injury exclusions.
- Generates a full weekly schedule with dynamic warmups, exercises, set/rep protocols, tempo schemes, and recovery guidance.
- Pluggable architecture supporting OpenAI, Gemini, Anthropic, or the built-in local Biomechanics Intelligence Engine.

### 5. Live Interactive Workout Session Player (`/workout/session`)
- Set-by-set tracker logging Weight (kg), Reps, RPE, and completion status.
- Interactive Rest Timer with audio chimes (Web Audio API), mobile vibration, and preset buttons (30s, 60s, 90s, 2m, 3m, +30s).
- On-the-fly **"Replace Exercise"** substitution modal for occupied equipment or joint discomfort.
- Real-time **PR Detection**: flags new heaviest weight and 1RM records automatically upon set completion.
- Finish workout summary screen with confetti explosion, cumulative tonnage, XP gains, and unlocked badges.

### 6. Progress Analytics & Biometric Vault (`/progress`, `/prs`)
- Body weight and circumference timeline (Chest, Waist, Arms, Thighs).
- Cumulative tonnage and set volume charts.
- Personal Records Hall of Fame tracking heaviest weights and estimated 1RMs (Epley & Brzycki formulas).
- Private progress photo comparison vault.

### 7. FitAI Biomechanics Assistant (`/ai-coach`)
- Full conversational assistant grounded in the exercise library.
- Fast prompts for substitutions, rest periods, progressive overload double progression, and muscle mechanics.
- Built-in medical guardrails directing users with acute symptoms to medical professionals.

### 8. Educational Nutrition & Macro Hub (`/nutrition`)
- Mifflin-St Jeor TDEE and BMR calculator with macro distribution (protein at 2.2g/kg).
- Evidence-based nutrient timing guides for pre-workout and post-workout muscle protein synthesis (MPS).

### 9. Gamification & Streaks
- Level progression (Level 1 to 20+; Iron Novice to Diamond Titan).
- Consecutive workout streak tracker with fire badges.
- 8+ system milestone badges (*First Step to Greatness*, *Breaking Boundaries*, *Iron Discipline*, *Centurion Lifter*).

### 10. Complete Admin Dashboard (`/admin`)
- Full CRUD management over exercises.
- Video and media URL configuration (MP4, WebM, GIF, Image).
- User directory with role management (`USER` vs `ADMIN`).
- Platform analytics and usage metrics.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React, Canvas Confetti.
- **Audio & Kinematics**: Web Audio API synthesizer for countdown ticks and PR chimes.
- **Backend**: Next.js Server Actions & API Route Handlers.
- **Database & ORM**: Prisma ORM with SQLite (default for zero-dependency local runs) & PostgreSQL ready.
- **Authentication**: JWT session tokens with `bcryptjs` password hashing and secure HttpOnly cookies.
- **AI Engine**: Pluggable `AIService` supporting OpenAI, Gemini, Anthropic, and local Biomechanics engine.

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- Node.js 18+ and npm installed.

### 2. Clone & Install Dependencies
```bash
npm install
```

### 3. Environment Variables Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Default `.env` values:
```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="fitpulse-super-secret-jwt-key-change-in-production-32bytes"
JWT_EXPIRES_IN="7d"

# Optional External AI API Key (Built-in engine works without key)
AI_PROVIDER="local" # Options: "local", "openai", "gemini", "anthropic"
AI_API_KEY=""
AI_MODEL="gpt-4o-mini"
```

### 4. Initialize Database & Seed 117+ Exercises
```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

### 5. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Pre-Seeded Accounts for Testing

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@fitai.app` | `Admin@123456` |
| **Member Athlete** | `user@fitai.app` | `User@123456` |

*Tip: The login page includes 1-click test buttons to populate these credentials instantly.*

---

## 📁 Project Architecture & Key Files

```
AI-Powered Fitness App/
├── prisma/
│   ├── schema.prisma         # Relational database models (User, Exercise, Workout, PRs, etc.)
│   └── seed.ts               # 117+ comprehensive exercises seed script
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root shell with Navbar, Footer, MobileNav, FloatingAI
│   │   ├── page.tsx          # Landing page with Hero & Muscle Map
│   │   ├── login/            # Authentication
│   │   ├── register/         # User onboarding
│   │   ├── dashboard/        # Athlete command center
│   │   ├── exercises/        # Searchable exercise database & [slug] form guide
│   │   │   └── compare/      # Side-by-side exercise comparison
│   │   ├── muscles/          # Anatomical muscle explorer
│   │   ├── workouts/         # Workout programs & custom creator
│   │   │   └── ai-generator/ # Multi-step AI workout planner
│   │   ├── workout/session/  # Live workout player with rest timer & PR celebration
│   │   ├── progress/         # Measurements & volume analytics
│   │   ├── prs/              # Personal Records Hall of Fame
│   │   ├── nutrition/        # TDEE / Macro calculator & nutrient timing
│   │   ├── ai-coach/         # Dedicated FitAI chatbot
│   │   ├── profile/          # Profile & badge gallery
│   │   ├── admin/            # Admin overview, exercise manager & user roles
│   │   └── api/              # Full REST API endpoints
│   ├── components/
│   │   ├── MuscleMap.tsx     # Interactive SVG Anterior/Posterior Muscle Explorer
│   │   ├── ExerciseMediaDisplay.tsx # Video, GIF, and AI biomechanics visualizer
│   │   ├── TempoTimer.tsx    # Interactive cadence metronome with Web Audio ticks
│   │   ├── Navbar.tsx        # Responsive navigation bar
│   │   ├── MobileBottomNav.tsx # Mobile navigation bar
│   │   ├── FloatingAICoach.tsx # Persistent floating AI assistant
│   │   └── Footer.tsx        # Footer with medical disclaimer
│   └── lib/
│       ├── prisma.ts         # Singleton Prisma client
│       ├── auth.ts           # JWT & bcrypt authentication helpers
│       ├── ai-service.ts     # Multi-provider AI interface & local biomechanics engine
│       ├── biomechanics.ts   # 1RM, TDEE/BMR, and volume formulas
│       ├── gamification.ts   # XP levels & achievement unlocks
│       └── sound.ts          # Web Audio API synthesizer
└── package.json
```

---

## 🚢 Production Deployment

### 1. Database (PostgreSQL)
In `prisma/schema.prisma`, update provider to `postgresql` and set your connection string in `.env`:
```env
DATABASE_URL="postgresql://user:password@db-host:5432/fitpulse?sslmode=require"
```
Run `npx prisma db push && npx tsx prisma/seed.ts`.

### 2. Deploy to Vercel / Node.js Host
1. Set the environment variables in your deployment dashboard (`DATABASE_URL`, `AUTH_SECRET`, `AI_API_KEY`).
2. Build command: `npm run build`
3. Start command: `npm start`
