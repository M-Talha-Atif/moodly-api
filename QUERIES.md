UPDATE mood_log
SET "finalMood" = COALESCE("voiceSentiment", "photoEmotion")
WHERE "finalMood" IS NULL;

<!-- COALESCE(a, b) returns the first non-null value.

So if voice_sentiment exists, it will be used; otherwise photo_emotion will be used.

Only updates rows where final_mood is currently NULL. -->
