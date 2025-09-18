import { Injectable } from '@nestjs/common';
import { OnboardingService } from 'src/onboarding/onboarding.service';
import { getTimeOfDay, getDayOfWeek } from 'src/common/utils/context-time';
import { InsightsService } from 'src/insights/services/insights.service';

@Injectable()
export class UserMoodEmbeddingService {
  constructor(
    private readonly onboarding: OnboardingService,
    private readonly insights: InsightsService,
  ) {}

  async buildUserEmbeddingText(
    userId: string,
    finalMood: string,
    note?: string,
  ) {
    const onboarding = await this.onboarding.findByUserId(userId);
    const streakData = await this.insights.getMoodLogStreak(userId);

    const timeOfDay = getTimeOfDay(new Date());
    const dayOfWeek = getDayOfWeek(new Date());

    const streakText = `${streakData.streak} day${
      streakData.streak !== 1 ? 's' : ''
    }`;

    const goals = onboarding?.goals ?? [];
    const activities = onboarding?.activities ?? [];
    const responses = onboarding?.responses ?? [];

    const goalsText =
      goals.length > 0 ? goals.join(', ') : 'No goals specified';
    const activitiesText =
      activities.length > 0 ? activities.join(', ') : 'No activities specified';
    const preferencesText =
      responses.length > 0
        ? responses.map((r) => `- ${r.question}: ${r.answer}`).join('\n')
        : 'No preferences recorded';

    const combinedText = `
Mood: ${finalMood}.
Note: ${note?.trim() ? note : 'No additional notes'}.
Current streak: ${streakText}.
Goals: ${goalsText}.
Activities: ${activitiesText}.
Preferences:
${preferencesText}
Context: ${timeOfDay}, ${dayOfWeek}.
    `.trim();

    console.log('🔎 [UserMoodEmbeddingService] Combined text:\n', combinedText);

    return combinedText;
  }
}
