import { create } from 'zustand';
import type { UserLessonProgress, UserUnitProgress } from '../types/user';
import type { Unit, Lesson, Course } from '../types/lessons';
import { supabase } from '../services/supabase';

interface ProgressState {
  courses: Course[];
  units: Unit[];
  lessons: Lesson[];
  lessonProgress: Record<string, UserLessonProgress>;
  unitProgress: Record<string, UserUnitProgress>;
  isLoading: boolean;

  loadCourseContent: () => Promise<void>;
  loadUserProgress: (userId: string) => Promise<void>;
  completeLesson: (userId: string, lessonId: string, score: number, xp: number) => Promise<void>;
  unlockNextLesson: (userId: string, currentLessonId: string) => Promise<void>;
  getLessonsForUnit: (unitId: string) => Lesson[];
  getUnitProgress: (unitId: string) => UserUnitProgress | null;
  getLessonProgress: (lessonId: string) => UserLessonProgress | null;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  courses: [],
  units: [],
  lessons: [],
  lessonProgress: {},
  unitProgress: {},
  isLoading: false,

  loadCourseContent: async () => {
    set({ isLoading: true });
    try {
      const [coursesRes, unitsRes, lessonsRes] = await Promise.all([
        supabase.from('courses').select('*').eq('is_active', true).order('sort_order'),
        supabase.from('units').select('*').order('sort_order'),
        supabase.from('lessons').select('*').order('sort_order'),
      ]);

      set({
        courses: (coursesRes.data || []).map(c => ({
          id: c.id, slug: c.slug, titleEs: c.title_es, titleEn: c.title_en,
          descriptionEs: c.description_es, level: c.level, sortOrder: c.sort_order, isActive: c.is_active,
        })),
        units: (unitsRes.data || []).map(u => ({
          id: u.id, courseId: u.course_id, slug: u.slug, titleEs: u.title_es, titleEn: u.title_en,
          descriptionEs: u.description_es, icon: u.icon, sortOrder: u.sort_order,
          totalLessons: u.total_lessons, guidebookEs: u.guidebook_es,
        })),
        lessons: (lessonsRes.data || []).map(l => ({
          id: l.id, unitId: l.unit_id, slug: l.slug, titleEs: l.title_es,
          lessonType: l.lesson_type, sortOrder: l.sort_order, xpReward: l.xp_reward,
          difficulty: l.difficulty, estimatedMinutes: l.estimated_minutes,
        })),
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  loadUserProgress: async (userId) => {
    try {
      const [lpRes, upRes] = await Promise.all([
        supabase.from('user_lesson_progress').select('*').eq('user_id', userId),
        supabase.from('user_unit_progress').select('*').eq('user_id', userId),
      ]);

      const lessonProgress: Record<string, UserLessonProgress> = {};
      (lpRes.data || []).forEach(p => {
        lessonProgress[p.lesson_id] = {
          userId: p.user_id, lessonId: p.lesson_id, status: p.status,
          stars: p.stars, bestScore: p.best_score, attempts: p.attempts,
          xpEarned: p.xp_earned, completedAt: p.completed_at, lastAttemptAt: p.last_attempt_at,
        };
      });

      const unitProgress: Record<string, UserUnitProgress> = {};
      (upRes.data || []).forEach(p => {
        unitProgress[p.unit_id] = {
          userId: p.user_id, unitId: p.unit_id, status: p.status,
          lessonsCompleted: p.lessons_completed, crownLevel: p.crown_level,
        };
      });

      set({ lessonProgress, unitProgress });
    } catch {
      // Silent fail - will show default locked state
    }
  },

  completeLesson: async (userId, lessonId, score, xp) => {
    const stars = score >= 100 ? 3 : score >= 80 ? 2 : 1;
    const now = new Date().toISOString();

    await supabase
      .from('user_lesson_progress')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        status: 'completed',
        stars: Math.max(stars, get().lessonProgress[lessonId]?.stars || 0),
        best_score: Math.max(score, get().lessonProgress[lessonId]?.bestScore || 0),
        attempts: (get().lessonProgress[lessonId]?.attempts || 0) + 1,
        xp_earned: (get().lessonProgress[lessonId]?.xpEarned || 0) + xp,
        completed_at: now,
        last_attempt_at: now,
      }, { onConflict: 'user_id,lesson_id' });

    set(state => ({
      lessonProgress: {
        ...state.lessonProgress,
        [lessonId]: {
          userId, lessonId, status: 'completed', stars,
          bestScore: Math.max(score, state.lessonProgress[lessonId]?.bestScore || 0),
          attempts: (state.lessonProgress[lessonId]?.attempts || 0) + 1,
          xpEarned: (state.lessonProgress[lessonId]?.xpEarned || 0) + xp,
          completedAt: now, lastAttemptAt: now,
        },
      },
    }));

    // Unlock next lesson
    await get().unlockNextLesson(userId, lessonId);
  },

  unlockNextLesson: async (userId, currentLessonId) => {
    const { lessons, lessonProgress } = get();
    const currentLesson = lessons.find(l => l.id === currentLessonId);
    if (!currentLesson) return;

    const unitLessons = lessons
      .filter(l => l.unitId === currentLesson.unitId)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    const currentIndex = unitLessons.findIndex(l => l.id === currentLessonId);
    const nextLesson = unitLessons[currentIndex + 1];

    if (nextLesson && !lessonProgress[nextLesson.id]) {
      await supabase
        .from('user_lesson_progress')
        .upsert({
          user_id: userId,
          lesson_id: nextLesson.id,
          status: 'available',
        }, { onConflict: 'user_id,lesson_id' });

      set(state => ({
        lessonProgress: {
          ...state.lessonProgress,
          [nextLesson.id]: {
            userId, lessonId: nextLesson.id, status: 'available',
            stars: 0, bestScore: 0, attempts: 0, xpEarned: 0,
            completedAt: null, lastAttemptAt: null,
          },
        },
      }));
    }
  },

  getLessonsForUnit: (unitId) => {
    return get().lessons.filter(l => l.unitId === unitId).sort((a, b) => a.sortOrder - b.sortOrder);
  },

  getUnitProgress: (unitId) => {
    return get().unitProgress[unitId] || null;
  },

  getLessonProgress: (lessonId) => {
    return get().lessonProgress[lessonId] || null;
  },
}));
