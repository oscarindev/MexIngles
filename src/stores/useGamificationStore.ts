import { create } from 'zustand';
import type { UserGamification } from '../types/user';
import type { Achievement, UserAchievement } from '../types/gamification';
import { supabase } from '../services/supabase';
import { HEARTS, XP_VALUES } from '../constants/gamification';

interface GamificationState {
  gamification: UserGamification | null;
  achievements: UserAchievement[];
  pendingAchievement: Achievement | null;
  isLoading: boolean;

  loadGamification: (userId: string) => Promise<void>;
  awardXP: (userId: string, amount: number) => Promise<void>;
  loseHeart: (userId: string) => Promise<boolean>;
  refillHearts: (userId: string) => Promise<void>;
  updateStreak: (userId: string) => Promise<void>;
  useStreakFreeze: (userId: string) => Promise<boolean>;
  checkAchievements: (userId: string) => Promise<void>;
  dismissAchievement: () => void;
}

export const useGamificationStore = create<GamificationState>((set, get) => ({
  gamification: null,
  achievements: [],
  pendingAchievement: null,
  isLoading: false,

  loadGamification: async (userId) => {
    set({ isLoading: true });
    try {
      // Get or create gamification record
      let { data } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!data) {
        const { data: newData } = await supabase
          .from('user_gamification')
          .insert({ user_id: userId })
          .select()
          .single();
        data = newData;
      }

      // Get achievements
      const { data: achData } = await supabase
        .from('user_achievements')
        .select('*, achievement:achievements(*)')
        .eq('user_id', userId);

      set({
        gamification: data ? {
          userId: data.user_id,
          totalXp: data.total_xp,
          weeklyXp: data.weekly_xp,
          monthlyXp: data.monthly_xp,
          currentStreak: data.current_streak,
          longestStreak: data.longest_streak,
          streakFreezeCount: data.streak_freeze_count,
          lastActivityDate: data.last_activity_date,
          hearts: data.hearts,
          heartsLastRefill: data.hearts_last_refill,
          gems: data.gems,
          currentLeague: data.current_league,
        } : null,
        achievements: achData as UserAchievement[] || [],
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  awardXP: async (userId, amount) => {
    const { gamification } = get();
    if (!gamification) return;

    const today = new Date().toISOString().split('T')[0];

    // Update gamification totals
    await supabase
      .from('user_gamification')
      .update({
        total_xp: gamification.totalXp + amount,
        weekly_xp: gamification.weeklyXp + amount,
        monthly_xp: gamification.monthlyXp + amount,
        last_activity_date: today,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    // Upsert daily XP
    await supabase
      .from('user_daily_xp')
      .upsert({
        user_id: userId,
        activity_date: today,
        xp_earned: (gamification.totalXp || 0) + amount, // Will be handled by DB function
      }, { onConflict: 'user_id,activity_date' });

    set({
      gamification: {
        ...gamification,
        totalXp: gamification.totalXp + amount,
        weeklyXp: gamification.weeklyXp + amount,
        monthlyXp: gamification.monthlyXp + amount,
        lastActivityDate: today,
      },
    });
  },

  loseHeart: async (userId) => {
    const { gamification } = get();
    if (!gamification) return false;

    if (gamification.hearts <= 0) return false;

    const newHearts = gamification.hearts - HEARTS.COST_PER_MISTAKE;
    await supabase
      .from('user_gamification')
      .update({ hearts: newHearts })
      .eq('user_id', userId);

    set({
      gamification: { ...gamification, hearts: newHearts },
    });
    return true;
  },

  refillHearts: async (userId) => {
    const { gamification } = get();
    if (!gamification) return;

    await supabase
      .from('user_gamification')
      .update({
        hearts: HEARTS.MAX,
        hearts_last_refill: new Date().toISOString(),
      })
      .eq('user_id', userId);

    set({
      gamification: {
        ...gamification,
        hearts: HEARTS.MAX,
        heartsLastRefill: new Date().toISOString(),
      },
    });
  },

  updateStreak: async (userId) => {
    const { gamification } = get();
    if (!gamification) return;

    const today = new Date().toISOString().split('T')[0];
    const lastActivity = gamification.lastActivityDate;

    if (lastActivity === today) return; // Already active today

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = gamification.currentStreak;

    if (lastActivity === yesterdayStr) {
      newStreak += 1;
    } else if (lastActivity !== today) {
      // Check for streak freeze
      if (gamification.streakFreezeCount > 0) {
        // Use streak freeze automatically
        await supabase
          .from('user_gamification')
          .update({
            streak_freeze_count: gamification.streakFreezeCount - 1,
          })
          .eq('user_id', userId);
      } else {
        newStreak = 1; // Reset streak
      }
    }

    const longestStreak = Math.max(newStreak, gamification.longestStreak);

    await supabase
      .from('user_gamification')
      .update({
        current_streak: newStreak,
        longest_streak: longestStreak,
        last_activity_date: today,
      })
      .eq('user_id', userId);

    set({
      gamification: {
        ...gamification,
        currentStreak: newStreak,
        longestStreak,
        lastActivityDate: today,
      },
    });
  },

  useStreakFreeze: async (userId) => {
    const { gamification } = get();
    if (!gamification || gamification.streakFreezeCount <= 0) return false;

    await supabase
      .from('user_gamification')
      .update({
        streak_freeze_count: gamification.streakFreezeCount - 1,
      })
      .eq('user_id', userId);

    set({
      gamification: {
        ...gamification,
        streakFreezeCount: gamification.streakFreezeCount - 1,
      },
    });
    return true;
  },

  checkAchievements: async (userId) => {
    const { gamification, achievements } = get();
    if (!gamification) return;

    // Fetch all achievements from DB
    const { data: allAchievements } = await supabase
      .from('achievements')
      .select('*');

    if (!allAchievements) return;

    const unlockedSlugs = new Set(achievements.map(a => a.achievement?.slug));

    for (const ach of allAchievements) {
      if (unlockedSlugs.has(ach.slug)) continue;

      let qualified = false;
      switch (ach.requirement_type) {
        case 'streak_days':
          qualified = gamification.currentStreak >= ach.requirement_value;
          break;
        case 'xp_total':
          qualified = gamification.totalXp >= ach.requirement_value;
          break;
        // Other types checked elsewhere (lessons_completed, words_learned, etc.)
      }

      if (qualified) {
        await supabase
          .from('user_achievements')
          .insert({ user_id: userId, achievement_id: ach.id });

        set({ pendingAchievement: ach as Achievement });
        break; // Show one at a time
      }
    }
  },

  dismissAchievement: () => set({ pendingAchievement: null }),
}));
