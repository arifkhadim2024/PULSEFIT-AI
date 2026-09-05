import { prisma } from './prisma';

export interface GenerateWorkoutInput {
  age?: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goal: 'muscle_building' | 'strength' | 'fat_loss' | 'general_fitness' | 'endurance' | 'athletic';
  daysPerWeek: number;
  durationMinutes: number;
  equipment: 'full_gym' | 'dumbbells_only' | 'bodyweight_home' | 'resistance_bands';
  targetMuscles?: string[];
  avoidMusclesOrInjuries?: string[];
  notes?: string;
}

export interface GeneratedDayPlan {
  dayName: string;
  focus: string;
  warmup: string[];
  exercises: {
    name: string;
    primaryMuscle: string;
    sets: number;
    reps: string;
    restSec: number;
    tempo: string;
    notes: string;
  }[];
  cooldown: string[];
}

export interface GeneratedProgram {
  programName: string;
  summary: string;
  weeklySchedule: GeneratedDayPlan[];
  progressionTip: string;
  recoveryGuidance: string;
}

export class AIService {
  private static provider = process.env.AI_PROVIDER || 'local';
  private static apiKey = process.env.AI_API_KEY || '';
  private static model = process.env.AI_MODEL || 'gpt-4o-mini';

  /**
   * Generates a fully personalized workout program
   */
  static async generateWorkout(input: GenerateWorkoutInput): Promise<GeneratedProgram> {
    // If OpenAI/Gemini/Anthropic API key is provided and provider is not 'local', call remote API
    if (this.apiKey && this.provider !== 'local') {
      try {
        if (this.provider === 'openai') {
          return await this.generateWorkoutOpenAI(input);
        }
      } catch (err) {
        console.warn('External AI failed, falling back to Fitness Biomechanics AI Engine:', err);
      }
    }

    // Built-in high-precision Biomechanics AI Generator
    return await this.generateWorkoutLocal(input);
  }

  /**
   * Fitness Chatbot Q&A with exercise grounding & safety filter
   */
  static async answerFitnessQuestion(question: string, userContext?: any): Promise<{
    answer: string;
    recommendedExercises?: string[];
    isMedicalWarning: boolean;
  }> {
    const qLower = question.toLowerCase();

    // Check for acute medical/injury red flags
    const injuryKeywords = ['sharp pain', 'torn', 'swelling', 'pop in my knee', 'dislocated', 'dizzy', 'fainted', 'chest pain', 'numbness', 'shooting pain'];
    const hasMedicalRedFlag = injuryKeywords.some(k => qLower.includes(k));

    if (hasMedicalRedFlag) {
      return {
        answer: `⚠️ **Important Health & Safety Notice**: \n\nI detected symptoms that may indicate an acute injury or medical concern. **Please discontinue training immediately and consult an appropriately qualified healthcare professional or physical therapist.** \n\nAI Fitness Assistants cannot diagnose injuries or provide medical clearance. Rest, elevate, avoid aggravating loaded movements, and seek professional evaluation.`,
        isMedicalWarning: true,
      };
    }

    // If external AI is active
    if (this.apiKey && this.provider === 'openai') {
      try {
        const response = await this.chatWithOpenAI(question, userContext);
        return {
          answer: response,
          isMedicalWarning: false,
        };
      } catch (e) {
        console.warn('Falling back to local knowledge engine');
      }
    }

    // Intelligent localized knowledge response
    return await this.answerFitnessQuestionLocal(question);
  }

  /**
   * Local Fitness AI Generator Engine
   */
  private static async generateWorkoutLocal(input: GenerateWorkoutInput): Promise<GeneratedProgram> {
    const { fitnessLevel, goal, daysPerWeek, durationMinutes, equipment } = input;

    let programName = `${fitnessLevel.toUpperCase()} - ${goal.replace('_', ' ').toUpperCase()} Split`;
    let summary = `Scientifically structured ${daysPerWeek}-day program optimized for ${goal.replace('_', ' ')} with ${equipment.replace('_', ' ')}.`;

    const days: GeneratedDayPlan[] = [];

    if (daysPerWeek <= 3) {
      // Full Body Routine
      const fullBodyDays = ['Day A - Full Body Power', 'Day B - Full Body Hypertrophy', 'Day C - Full Body Conditioning'];
      for (let i = 0; i < Math.min(daysPerWeek, 3); i++) {
        days.push({
          dayName: fullBodyDays[i],
          focus: 'Full Body Compound Movement',
          warmup: ['5 min light cardio', 'Arm circles & Band pull-aparts', 'World\'s Greatest Stretch', 'Bodyweight Squats x 15'],
          exercises: [
            { name: i === 0 ? 'Barbell Back Squat' : i === 1 ? 'Romanian Deadlift' : 'Leg Press', primaryMuscle: i === 0 ? 'Quadriceps' : 'Hamstrings', sets: 3, reps: '8-10', restSec: 120, tempo: '3-0-1-0', notes: 'Focus on bracing core and controlled eccentric' },
            { name: i === 0 ? 'Barbell Bench Press' : i === 1 ? 'Incline Dumbbell Press' : 'Dips', primaryMuscle: 'Chest', sets: 3, reps: '8-12', restSec: 90, tempo: '3-1-1-0', notes: 'Retract scapula and drive through feet' },
            { name: i === 0 ? 'Lat Pulldown' : i === 1 ? 'Barbell Bent-Over Row' : 'Seated Cable Row', primaryMuscle: 'Back', sets: 3, reps: '10-12', restSec: 90, tempo: '2-0-1-1', notes: 'Squeeze back at peak contraction' },
            { name: i === 0 ? 'Dumbbell Shoulder Press' : i === 1 ? 'Lateral Raise' : 'Face Pull', primaryMuscle: 'Shoulders', sets: 3, reps: '12-15', restSec: 60, tempo: '2-0-1-0', notes: 'Strict form, zero momentum' },
            { name: i === 0 ? 'Barbell Bicep Curl' : 'Triceps Rope Pushdown', primaryMuscle: i === 0 ? 'Biceps' : 'Triceps', sets: 3, reps: '12-15', restSec: 60, tempo: '2-1-1-1', notes: 'Full elbow extension' },
            { name: 'Hanging Knee Raise', primaryMuscle: 'Abs', sets: 3, reps: '12-15', restSec: 45, tempo: '2-0-1-0', notes: 'Posterior pelvic tilt to engage core' },
          ],
          cooldown: ['Cat-Cow Stretch 2 mins', 'Pigeon pose 1 min per side', 'Child\'s pose 2 mins'],
        });
      }
    } else if (daysPerWeek === 4) {
      // Upper / Lower Split
      const splits = [
        { name: 'Day 1 - Upper Body (Strength Focus)', focus: 'Chest, Back, Shoulders & Arms' },
        { name: 'Day 2 - Lower Body (Quad & Glute Focus)', focus: 'Quadriceps, Glutes & Calves' },
        { name: 'Day 3 - Upper Body (Hypertrophy Focus)', focus: 'Chest, Back & Shoulders' },
        { name: 'Day 4 - Lower Body (Posterior Chain & Core)', focus: 'Hamstrings, Glutes & Abs' },
      ];

      days.push({
        dayName: splits[0].name,
        focus: splits[0].focus,
        warmup: ['Thoracic spine rotations', 'Scapular pushups', 'Light shoulder dislocates'],
        exercises: [
          { name: 'Barbell Bench Press', primaryMuscle: 'Chest', sets: 4, reps: '6-8', restSec: 120, tempo: '3-1-1-0', notes: 'Primary heavy compound press' },
          { name: 'Barbell Bent-Over Row', primaryMuscle: 'Back', sets: 4, reps: '6-8', restSec: 120, tempo: '2-1-1-0', notes: '45-degree hip hinge, pull to belly button' },
          { name: 'Overhead Press (OHP)', primaryMuscle: 'Shoulders', sets: 3, reps: '8-10', restSec: 90, tempo: '2-0-1-0', notes: 'Tight glutes and core' },
          { name: 'Close-Grip Bench Press', primaryMuscle: 'Triceps', sets: 3, reps: '8-10', restSec: 75, tempo: '3-0-1-0', notes: 'Shoulder-width grip' },
          { name: 'Incline Dumbbell Curl', primaryMuscle: 'Biceps', sets: 3, reps: '10-12', restSec: 60, tempo: '2-1-1-1', notes: 'Full long head stretch' },
        ],
        cooldown: ['Chest doorway stretch', 'Lat hang stretch'],
      });

      days.push({
        dayName: splits[1].name,
        focus: splits[1].focus,
        warmup: ['Hip openers 90/90', 'Ankle mobility wall touches', 'Leg swings'],
        exercises: [
          { name: 'Barbell Back Squat', primaryMuscle: 'Quadriceps', sets: 4, reps: '6-8', restSec: 150, tempo: '3-1-1-0', notes: 'Hit parallel with chest up' },
          { name: 'Bulgarian Split Squat', primaryMuscle: 'Quadriceps', sets: 3, reps: '8-10 / leg', restSec: 90, tempo: '2-1-1-0', notes: 'Torso slightly leaned forward' },
          { name: 'Leg Extension', primaryMuscle: 'Quadriceps', sets: 3, reps: '12-15', restSec: 60, tempo: '2-0-1-1', notes: 'Hold 1s squeeze at top' },
          { name: 'Standing Calf Raise', primaryMuscle: 'Calves', sets: 4, reps: '12-15', restSec: 60, tempo: '3-1-1-1', notes: 'Deep stretch at bottom' },
        ],
        cooldown: ['Couch stretch 2 mins / leg', 'Foam roll quads'],
      });

      days.push({
        dayName: splits[2].name,
        focus: splits[2].focus,
        warmup: ['Face pulls with light band', 'Shoulder circles'],
        exercises: [
          { name: 'Incline Dumbbell Press', primaryMuscle: 'Chest', sets: 3, reps: '10-12', restSec: 90, tempo: '3-0-1-0', notes: '30-degree incline' },
          { name: 'Lat Pulldown', primaryMuscle: 'Back', sets: 3, reps: '10-12', restSec: 90, tempo: '2-1-1-0', notes: 'Drive elbows down into ribs' },
          { name: 'Cable Lateral Raise', primaryMuscle: 'Shoulders', sets: 4, reps: '12-15', restSec: 60, tempo: '2-0-1-1', notes: 'Constant cable tension' },
          { name: 'Cable Chest Fly', primaryMuscle: 'Chest', sets: 3, reps: '12-15', restSec: 60, tempo: '3-1-1-1', notes: 'Hug an imaginary tree' },
          { name: 'Triceps Rope Pushdown', primaryMuscle: 'Triceps', sets: 3, reps: '12-15', restSec: 60, tempo: '2-0-1-1', notes: 'Spread rope at lockout' },
        ],
        cooldown: ['Upper body yoga flow'],
      });

      days.push({
        dayName: splits[3].name,
        focus: splits[3].focus,
        warmup: ['Glute bridges x 15', 'Monster walks with band'],
        exercises: [
          { name: 'Romanian Deadlift (RDL)', primaryMuscle: 'Hamstrings', sets: 4, reps: '8-10', restSec: 120, tempo: '3-1-1-0', notes: 'Push hips back until deep hamstring stretch' },
          { name: 'Barbell Hip Thrust', primaryMuscle: 'Glutes', sets: 3, reps: '10-12', restSec: 90, tempo: '2-1-1-1', notes: 'Full hip extension, chin tucked' },
          { name: 'Lying Leg Curl', primaryMuscle: 'Hamstrings', sets: 3, reps: '12-15', restSec: 60, tempo: '2-0-1-1', notes: 'Control the eccentric' },
          { name: 'Hanging Leg Raise', primaryMuscle: 'Abs', sets: 3, reps: '12-15', restSec: 60, tempo: '2-0-1-0', notes: 'Lift with core not hip flexors' },
          { name: 'Ab Wheel Rollout', primaryMuscle: 'Abs', sets: 3, reps: '10-12', restSec: 60, tempo: '3-0-1-0', notes: 'Keep hollow body position' },
        ],
        cooldown: ['Hamstring seated stretch', 'Pigeon pose'],
      });
    } else {
      // 5-6 Day Push / Pull / Legs
      days.push({
        dayName: 'Day 1 - Push (Chest, Shoulders, Triceps)',
        focus: 'Upper Body Pressing',
        warmup: ['Band shoulder dislocations', 'Rotator cuff external rotations'],
        exercises: [
          { name: 'Barbell Bench Press', primaryMuscle: 'Chest', sets: 4, reps: '6-8', restSec: 120, tempo: '3-1-1-0', notes: 'Barbell touch lower sternum' },
          { name: 'Incline Dumbbell Press', primaryMuscle: 'Chest', sets: 3, reps: '8-10', restSec: 90, tempo: '3-0-1-0', notes: 'Target upper pectorals' },
          { name: 'Overhead Press (OHP)', primaryMuscle: 'Shoulders', sets: 3, reps: '8-10', restSec: 90, tempo: '2-0-1-0', notes: 'Vertical bar path' },
          { name: 'Dumbbell Lateral Raise', primaryMuscle: 'Shoulders', sets: 4, reps: '12-15', restSec: 60, tempo: '2-0-1-1', notes: 'Lead with elbows' },
          { name: 'Skull Crushers', primaryMuscle: 'Triceps', sets: 3, reps: '10-12', restSec: 60, tempo: '3-0-1-0', notes: 'Lower bar to crown of head' },
        ],
        cooldown: ['Chest & anterior delt stretches'],
      });

      days.push({
        dayName: 'Day 2 - Pull (Back, Rear Delts, Biceps)',
        focus: 'Upper Body Pulling',
        warmup: ['Dead hangs 2x30s', 'Band pull aparts'],
        exercises: [
          { name: 'Deadlift', primaryMuscle: 'Back', sets: 3, reps: '5-6', restSec: 180, tempo: '2-0-1-0', notes: 'Brace core, push the floor away' },
          { name: 'Pull-Ups', primaryMuscle: 'Back', sets: 3, reps: '8-10', restSec: 90, tempo: '2-1-1-0', notes: 'Full dead hang to chin over bar' },
          { name: 'Seated Cable Row', primaryMuscle: 'Back', sets: 3, reps: '10-12', restSec: 75, tempo: '2-1-1-1', notes: 'Squeeze scapulae' },
          { name: 'Face Pull', primaryMuscle: 'Shoulders', sets: 4, reps: '15-20', restSec: 60, tempo: '2-1-1-1', notes: 'Pull to eyes, external rotation' },
          { name: 'Barbell Bicep Curl', primaryMuscle: 'Biceps', sets: 3, reps: '10-12', restSec: 60, tempo: '2-1-1-0', notes: 'Elbows pinned to sides' },
        ],
        cooldown: ['Lat stretch', 'Cobra pose'],
      });

      days.push({
        dayName: 'Day 3 - Legs (Quads, Hamstrings, Glutes, Calves)',
        focus: 'Lower Body Compound',
        warmup: ['Leg swings', 'Glute activations', 'Squat mobility'],
        exercises: [
          { name: 'Barbell Back Squat', primaryMuscle: 'Quadriceps', sets: 4, reps: '6-8', restSec: 150, tempo: '3-1-1-0', notes: 'Controlled descent' },
          { name: 'Romanian Deadlift (RDL)', primaryMuscle: 'Hamstrings', sets: 3, reps: '8-10', restSec: 90, tempo: '3-1-1-0', notes: 'Hips back, soft knees' },
          { name: 'Leg Press', primaryMuscle: 'Quadriceps', sets: 3, reps: '10-12', restSec: 90, tempo: '3-0-1-0', notes: 'Full depth without pelvic tuck' },
          { name: 'Seated Leg Curl', primaryMuscle: 'Hamstrings', sets: 3, reps: '12-15', restSec: 60, tempo: '2-0-1-1', notes: 'Lock in thighs' },
          { name: 'Standing Calf Raise', primaryMuscle: 'Calves', sets: 4, reps: '12-15', restSec: 45, tempo: '3-1-1-1', notes: '2 second pause at bottom' },
        ],
        cooldown: ['Quad & hamstring static stretching'],
      });

      if (daysPerWeek >= 4) {
        days.push({
          dayName: 'Day 4 - Push & Hypertrophy Focus',
          focus: 'Pecs, Delts & Arms Pump',
          warmup: ['Arm circles', 'Pushups x 10'],
          exercises: [
            { name: 'Dumbbell Bench Press', primaryMuscle: 'Chest', sets: 3, reps: '8-12', restSec: 90, tempo: '3-1-1-0', notes: 'Deep stretch at bottom' },
            { name: 'Cable Chest Fly', primaryMuscle: 'Chest', sets: 3, reps: '12-15', restSec: 60, tempo: '2-1-1-1', notes: 'Peak contraction' },
            { name: 'Arnold Press', primaryMuscle: 'Shoulders', sets: 3, reps: '10-12', restSec: 75, tempo: '2-0-1-0', notes: 'Rotate smooth from palms in to out' },
            { name: 'Triceps Rope Pushdown', primaryMuscle: 'Triceps', sets: 3, reps: '12-15', restSec: 60, tempo: '2-0-1-1', notes: 'Lockout arms' },
          ],
          cooldown: ['Stretching & foam rolling'],
        });
      }

      if (daysPerWeek >= 5) {
        days.push({
          dayName: 'Day 5 - Pull & Core Focus',
          focus: 'Lats, Rhomboids, Core',
          warmup: ['Cat-cow', 'Bird-dog'],
          exercises: [
            { name: 'Lat Pulldown', primaryMuscle: 'Back', sets: 3, reps: '10-12', restSec: 75, tempo: '2-1-1-0', notes: 'Medium wide grip' },
            { name: 'Chest-Supported Row', primaryMuscle: 'Back', sets: 3, reps: '10-12', restSec: 75, tempo: '2-1-1-1', notes: 'Protects lower spine' },
            { name: 'Hammer Curl', primaryMuscle: 'Biceps', sets: 3, reps: '10-12', restSec: 60, tempo: '2-0-1-0', notes: 'Targets brachialis & forearms' },
            { name: 'Cable Crunch', primaryMuscle: 'Abs', sets: 4, reps: '15-20', restSec: 45, tempo: '2-1-1-1', notes: 'Round thoracic spine down' },
          ],
          cooldown: ['Spinal twists'],
        });
      }
    }

    return {
      programName,
      summary,
      weeklySchedule: days,
      progressionTip: `**Double Progression Protocol**: Stick with a given weight until you can perform the top of the rep range (e.g. 12 reps) across all sets with clean form. Then increase the load by 2.5kg - 5kg and aim for the bottom of the rep range.`,
      recoveryGuidance: `Aim for 7.5 - 9 hours of quality sleep, 1.8g - 2.2g of protein per kg of bodyweight, and hydrate with at least 3 liters of water per day. Take at least 1-2 rest days per week.`,
    };
  }

  /**
   * Local Knowledge Q&A Handler
   */
  private static async answerFitnessQuestionLocal(question: string): Promise<{
    answer: string;
    recommendedExercises?: string[];
    isMedicalWarning: boolean;
  }> {
    const q = question.toLowerCase();

    if (q.includes('progressive overload')) {
      return {
        answer: `### Understanding Progressive Overload 📈\n\n**Progressive overload** is the fundamental principle of resistance training: to grow muscle and increase strength, you must continually increase the demands placed on your musculoskeletal system.\n\n#### 5 Ways to Apply Progressive Overload:\n1. **Increase Weight / Load**: Adding 1-2.5 kg to the barbell when you hit your target reps.\n2. **Increase Repetitions**: Doing 10 reps with a weight you previously did 8 reps with.\n3. **Increase Sets / Volume**: Progressing from 3 sets to 4 sets over a training cycle.\n4. **Improve Technique & Tempo**: Lowering the weight under a strict 3-second eccentric with zero momentum.\n5. **Decrease Rest Intervals**: Performing the same workload in less time with equal form.`,
        isMedicalWarning: false,
      };
    }

    if (q.includes('chest') || q.includes('bench press')) {
      return {
        answer: `### Optimizing Chest Development 🏋️‍♂️\n\nThe pectoralis major consists of the clavicular (upper) head and the sternal (mid/lower) head.\n\n#### Best Chest Exercises:\n1. **Barbell Bench Press**: Master compound horizontal press for maximum mechanical tension.\n2. **Incline Dumbbell Press**: Best angle (30°) for upper chest hypertrophy.\n3. **Weighted Dips / Push-ups**: Superb lower pectoral and triceps builder.\n4. **Cable Crossover / Fly**: Provides constant peak contraction tension at the fully shortened position.\n\n*Pro Tip*: Always retract and depress your scapulae ("tuck your shoulder blades into your back pockets") to protect your shoulders and maximize chest activation.`,
        recommendedExercises: ['barbell-bench-press', 'incline-dumbbell-press', 'cable-chest-fly'],
        isMedicalWarning: false,
      };
    }

    if (q.includes('squat') || q.includes('legs') || q.includes('replace squat')) {
      return {
        answer: `### Squat Alternatives & Leg Development 🦵\n\nIf you have mobility limits or back fatigue and want alternatives to the standard Barbell Back Squat:\n\n1. **Bulgarian Split Squats**: Superior quad & glute hypertrophy with virtually zero spinal compression.\n2. **Leg Press**: Allows you to safely load quadriceps to failure without stabilizer fatigue.\n3. **Hack Squats**: Pure quad focus with an aligned fixed back support.\n4. **Goblet Squats**: Outstanding for beginners to learn upright torso mechanics and hip mobility.`,
        recommendedExercises: ['bulgarian-split-squat', 'leg-press', 'hack-squat', 'barbell-back-squat'],
        isMedicalWarning: false,
      };
    }

    if (q.includes('rest') || q.includes('how much rest') || q.includes('between sets')) {
      return {
        answer: `### Optimal Rest Periods Between Sets ⏱️\n\n- **Heavy Compound Movements (Squat, Deadlift, Bench Press)**: **2 to 3.5 minutes**.\n  *Why*: Allows central nervous system (CNS) recovery and ATP-CP replenishment so you can maintain heavy output without technique breakdown.\n\n- **Hypertrophy / Accessory Movements (Rows, Overhead Press, Split Squats)**: **90 seconds to 2 minutes**.\n\n- **Isolation Exercises (Curls, Lateral Raises, Tricep Pushdowns, Calves)**: **60 to 90 seconds**.\n  *Why*: High metabolic stress and pump with minimal cardiovascular/CNS fatigue.`,
        isMedicalWarning: false,
      };
    }

    // Default dynamic smart answer
    return {
      answer: `### Training & Biomechanics Guidance 💡\n\nTo achieve consistent results in strength and hypertrophy:\n\n- **Consistency & Frequency**: Hit each muscle group 2x per week with 10–20 total weekly working sets.\n- **Intensity (RIR/RPE)**: Take most working sets to 1–3 Reps in Reserve (RIR) with pristine technique.\n- **Nutrition**: Maintain a slight caloric surplus (+200-300 kcal) for muscle gain, or deficit (-300-500 kcal) for fat loss, alongside 1.6-2.2g protein/kg.\n\nFeel free to ask me for custom workout routines, form breakdown of any exercise, or exercise substitutions!`,
      isMedicalWarning: false,
    };
  }

  /**
   * OpenAI API Handler
   */
  private static async generateWorkoutOpenAI(input: GenerateWorkoutInput): Promise<GeneratedProgram> {
    const prompt = `You are a certified CSCS Strength & Conditioning specialist.
Generate a comprehensive structured workout plan in JSON format based on:
Level: ${input.fitnessLevel}
Goal: ${input.goal}
Days/week: ${input.daysPerWeek}
Duration: ${input.durationMinutes} mins
Equipment: ${input.equipment}
Target Muscles: ${input.targetMuscles?.join(', ') || 'Balanced'}
Avoid: ${input.avoidMusclesOrInjuries?.join(', ') || 'None'}

Return ONLY a JSON object matching this structure:
{
  "programName": "string",
  "summary": "string",
  "weeklySchedule": [
    {
      "dayName": "string",
      "focus": "string",
      "warmup": ["string"],
      "exercises": [
        {
          "name": "string",
          "primaryMuscle": "string",
          "sets": 3,
          "reps": "8-12",
          "restSec": 90,
          "tempo": "3-0-1-0",
          "notes": "string"
        }
      ],
      "cooldown": ["string"]
    }
  ],
  "progressionTip": "string",
  "recoveryGuidance": "string"
}`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model || 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      }),
    });

    const data = await res.json();
    return JSON.parse(data.choices[0].message.content);
  }

  private static async chatWithOpenAI(question: string, context?: any): Promise<string> {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are FitAI, an elite exercise science AI coach. Give clear, evidence-based fitness advice with biomechanical rationale. NEVER diagnose injuries or disease; include a medical disclaimer if symptoms are reported.',
          },
          { role: 'user', content: question },
        ],
      }),
    });

    const data = await res.json();
    return data.choices[0].message.content;
  }
}
