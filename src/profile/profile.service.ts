// import { Injectable } from '@nestjs/common';
// import { BookingService } from '../booking/services/booking.service';
// import { ExperienceService } from '../experience/services/experience.service';
// import { CommunityService } from '../community/services/community.service';
// import { FeedbackService } from '../feedback/services/feedback.service';
// import { ProfileOverviewDto } from './dto/profile-overview.dto';

// @Injectable()
// export class ProfileService {
//   constructor(
//     private readonly bookingService: BookingService,
//     private readonly experienceService: ExperienceService,
//     private readonly communityService: CommunityService,
//     private readonly feedbackService: FeedbackService,
//     private readonly achievementService: AchievementService,
//   ) {}

//   async getOverview(userId: string): Promise<ProfileOverviewDto> {
//     const stats = await this.bookingService.getStatsForUser(userId);
//     const mood = await this.feedbackService.getMoodAnalytics(userId);
//     const progress = await this.bookingService.getProgress(userId);
//     // const achievements = await this.achievementService.getForUser(userId);
//     const communities = await this.communityService.getStats(userId);

//     return {
//       stats,
//       mood,
//       progress,
//       achievements,
//       communities,
//     };
//   }

//   async getRecommendations(userId: string) {
//     return this.experienceService.getRecommendedExperiences(userId);
//   }
// }
