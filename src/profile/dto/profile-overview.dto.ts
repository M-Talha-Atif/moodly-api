export class ProfileOverviewDto {
  stats: {
    streak: number;
    totalExperiences: number;
    communitiesJoined: number;
    moodAverage: number;
    goalsAchieved: number;
  };

  mood: {
    heatmap: Record<string, string>;
    positiveDays: number;
    neutralDays: number;
    challengingDays: number;
    weeklyTrend: number[];
  };

  progress: {
    milestones: { goal: string; progress: number }[];
    radar: { labels: string[]; datasets: any[] };
  };

  achievements: {
    title: string;
    description: string;
    earned: boolean;
    icon: string;
  }[];

  communities: {
    joined: number;
    posts: number;
    comments: number;
    reactions: number;
  };
}
