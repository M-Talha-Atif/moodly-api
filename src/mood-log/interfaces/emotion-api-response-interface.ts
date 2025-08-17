export interface EmotionApiResponse {
  dominant_emotion: string;
  [key: string]: any; // allow additional fields from API
}
