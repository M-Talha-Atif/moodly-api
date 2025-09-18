// src/config/rmq.constants.ts
export const RMQ_DOMAINS = {
  MOOD: {
    CLIENT: 'MOOD_RMQ_CLIENT',
    EXCHANGE: process.env.RMQ_MOOD_EXCHANGE || 'mood-exchange',
    QUEUE: process.env.RMQ_MOOD_QUEUE || 'mood-tasks',
    ROUTING: {
      DETECT: 'mood.detect',
      ANALYZED: 'mood.analyzed',
    },
  },
  COMMUNITY: {
    CLIENT: 'COMM_RMQ_CLIENT',
    EXCHANGE: process.env.RMQ_COMM_EXCHANGE || 'community-exchange',
    QUEUE: process.env.RMQ_COMM_QUEUE || 'community-tasks',
    ROUTING: {
      EMBED: 'community.embedding.generate',
    },
  },

  RECOMMENDATION: {
    CLIENT: 'REC_RMQ_CLIENT',
    EXCHANGE: process.env.RMQ_REC_EXCHANGE || 'recommendation-exchange',
    QUEUE: process.env.RMQ_REC_QUEUE || 'recommendation-tasks',
    ROUTING: {
      GENERATE: 'recommendation.generate',
    },
  },
  EXPERIENCE: {
    /* same pattern */
  },
  // add FEEDBACK, BOOKINGS, ONBOARDING... as needed
};
