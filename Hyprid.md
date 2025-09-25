<!--
  // === HYBRID RECOMMENDATION (Best of Both Worlds) ===
  async hybridRecommend(
    userMood: string,
    userEmbedding?: number[],
    userId?: string,
    limit = 10
  ): Promise<Experience[]> {

    // Run both recommendation strategies in parallel
    const [emotionRecs, embeddingRecs] = await Promise.all([
      this.recommendByEmotion(userMood, userId, limit * 2), // Get more for deduplication
      userEmbedding ? this.recommendByEmbedding(userEmbedding, limit * 2) : Promise.resolve([])
    ]);

    // If no embedding recommendations, return emotion-based ones
    if (embeddingRecs.length === 0) {
      return emotionRecs.slice(0, limit);
    }

    // Merge and deduplicate results
    const mergedRecs = this.mergeAndRankRecommendations(emotionRecs, embeddingRecs, limit);

    return mergedRecs;
  }

  // === UTILITY METHODS ===
  private extractCulturalTagsFromUser(user: User): string[] {
    const tags: string[] = [];

    if (user.culturalBackground) {
      if (user.culturalBackground.ethnicity) {
        tags.push(user.culturalBackground.ethnicity.toLowerCase());
      }
      if (user.culturalBackground.religion) {
        tags.push(user.culturalBackground.religion.toLowerCase());
      }
      if (user.culturalBackground.values) {
        tags.push(...user.culturalBackground.values.map(v => v.toLowerCase()));
      }
    }

    // Add language preferences as cultural tags
    if (user.languagePreferences) {
      tags.push(...user.languagePreferences.map(lang => `${lang}_culture`));
    }

    return [...new Set(tags)]; // Remove duplicates
  }

  private mergeAndRankRecommendations(
    emotionRecs: Experience[],
    embeddingRecs: Experience[],
    limit: number
  ): Experience[] {

    const experienceMap = new Map();

    // Score emotion-based recommendations (higher initial score)
    emotionRecs.forEach((exp, index) => {
      experienceMap.set(exp.id, {
        experience: exp,
        score: (emotionRecs.length - index) * 2 // Higher weight for emotion-based
      });
    });

    // Score embedding-based recommendations
    embeddingRecs.forEach((exp, index) => {
      const existing = experienceMap.get(exp.id);
      if (existing) {
        existing.score += (embeddingRecs.length - index); // Add to existing score
      } else {
        experienceMap.set(exp.id, {
          experience: exp,
          score: (embeddingRecs.length - index) // Base score for embedding-based
        });
      }
    });

    // Convert to array and sort by score
    const ranked = Array.from(experienceMap.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.experience);

    return ranked;
  }

  // === BATCH PROCESSING FOR MULTIPLE USERS ===
  async batchRecommendByEmotion(
    userMoods: { userId: string; mood: string }[],
    limitPerUser = 5
  ): Promise<Map<string, Experience[]>> {

    const recommendations = new Map<string, Experience[]>();

    // Process in batches to avoid overwhelming the database
    const batchSize = 10;
    for (let i = 0; i < userMoods.length; i += batchSize) {
      const batch = userMoods.slice(i, i + batchSize);

      const batchPromises = batch.map(async ({ userId, mood }) => {
        const recs = await this.recommendByEmotion(mood, userId, limitPerUser);
        return { userId, recs };
      });

      const batchResults = await Promise.all(batchPromises);

      batchResults.forEach(({ userId, recs }) => {
        recommendations.set(userId, recs);
      });
    }

    return recommendations;
  } -->
