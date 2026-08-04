import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { MoodLog } from 'src/mood-log/entities/mood-log.entity';
import { Booking } from 'src/booking/entities/booking.entity';
import { CommunityMember } from 'src/community/entities/community/community-member.entity'; // adjust path
import { startOfDay, endOfDay, subDays } from 'date-fns';
import { DEFAULT_INSIGHTS_MOOD_WINDOW_DAYS } from '../insights.constants';

@Injectable()
export class InsightsService {
  constructor(
    @InjectRepository(MoodLog)
    private readonly moodLogRepo: Repository<MoodLog>,

    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,

    @InjectRepository(CommunityMember)
    private readonly communityMemberRepo: Repository<CommunityMember>,
  ) {}

  // Helper: normalize label string
  private normalizeLabel(label?: string): string | null {
    if (!label) return null;
    return label.trim().toLowerCase();
  }

  // Map finalMood to numeric score (0-10). Tune as needed.
  private moodScore(label?: string): number | null {
    const l = this.normalizeLabel(label);
    if (!l) return null;

    const map: Record<string, number> = {
      happy: 9,
      excited: 9,
      inspired: 8,
      peaceful: 7,
      calm: 7,
      neutral: 5,
      surprised: 6,
      sad: 2,
      anxious: 2,
      angry: 1,
      fear: 1,
      fearful: 1,
      disgusted: 1,
      disgust: 1,
      // small tolerance for common misspellings:
      disgused: 1,
      disguested: 1,
      surpriese: 6,
    };

    return map[l] ?? null;
  }

  // ---- Mood average over last `days` (default 30) ----
  async getMoodAverage(
    userId: string,
    days = DEFAULT_INSIGHTS_MOOD_WINDOW_DAYS,
  ): Promise<{ average: number | null; count: number; days }> {
    const end = new Date();
    const start = subDays(end, days);

    const logs = await this.moodLogRepo.find({
      where: {
        userId,
        createdAt: Between(startOfDay(start), endOfDay(end)),
      },
      select: ['finalMood'],
    });

    const scores: number[] = [];
    for (const l of logs) {
      const s = this.moodScore(l.finalMood);
      if (s !== null && !Number.isNaN(s)) scores.push(s);
    }

    if (scores.length === 0) return { average: null, count: 0, days };

    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    // round to one decimal for UI
    return { average: Math.round(avg * 10) / 10, count: scores.length, days };
  }

  // ---- Count distinct experiences user joined (bookings not cancelled) ----
  async getJoinedExperiencesCount(userId: string): Promise<number> {
    const raw = await this.bookingRepo
      .createQueryBuilder('b')
      .select('COUNT(DISTINCT b."experienceId")', 'count')
      .where('b."userId" = :userId', { userId })
      .andWhere("b.status != 'cancelled'")
      .getRawOne();

    return Number(raw?.count ?? 0);
  }

  // ---- Count communities joined (CommunityMember table) ----
  async getJoinedCommunitiesCount(userId: string): Promise<number> {
    return this.communityMemberRepo.count({
      where: { user: { id: userId } },
    });
  }

  // ---- Mood log streak (reuse your logic or implement here) ----
  // This version computes consecutive days till today inclusive
  async getMoodLogStreak(
    userId: string,
  ): Promise<{ streak: number; totalDaysLogged: number }> {
    // get distinct dates (yyyy-mm-dd) sorted descending
    const rows = await this.moodLogRepo
      .createQueryBuilder('log')
      .select('TO_CHAR(log."createdAt", \'YYYY-MM-DD\')', 'd')
      .where('log."userId" = :userId', { userId })
      .groupBy('d')
      .orderBy('d', 'DESC')
      .getRawMany<{ d: string }>();

    const dates = rows.map((r) => r.d);
    if (dates.length === 0) return { streak: 0, totalDaysLogged: 0 };

    // compute streak from most recent date
    let streak = 0;
    let last = new Date(dates[0]);

    // iterate until break
    for (let i = 0; i < dates.length; i++) {
      const current = new Date(dates[i]);
      const diffDays = Math.round(
        (last.getTime() - current.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (i === 0) {
        streak = 1;
        last = current;
        continue;
      }

      if (diffDays === 1) {
        streak++;
        last = current;
      } else if (diffDays === 0) {
        // same day duplicate, skip
        continue;
      } else {
        break;
      }
    }

    return { streak, totalDaysLogged: dates.length };
  }

  // ---- Aggregate insights payload ----
  async getUserInsights(userId: string, options?: { moodDays?: number }) {
    const moodDays = options?.moodDays ?? DEFAULT_INSIGHTS_MOOD_WINDOW_DAYS;

    const [streakObj, experiencesCount, communitiesCount, moodAvgObj] =
      await Promise.all([
        this.getMoodLogStreak(userId),
        this.getJoinedExperiencesCount(userId),
        this.getJoinedCommunitiesCount(userId),
        this.getMoodAverage(userId, moodDays),
      ]);

    return {
      streak: streakObj.streak,
      totalDaysLogged: streakObj.totalDaysLogged,
      experiences: experiencesCount,
      communities: communitiesCount,
      moodAvg: moodAvgObj.average, // null if no logs
      moodSampleCount: moodAvgObj.count,
      moodDays: moodAvgObj.days,
    };
  }
}
