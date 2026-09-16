# Mood Log Module

`src/mood-log`: multi-modal mood logging (text label + optional photo + optional voice). Detection and recommendation both run synchronously inside `POST /v1/mood-log`, the response carries the real detected mood and the matching experiences, no follow-up event or socket push required.

## Structure

```
mood-log/
├── mood-log.module.ts
├── mood-log.constants.ts        # pagination defaults, daily-summary hour buckets
├── mood-log.controller.ts       # @Controller('mood-log')
├── services/
│   ├── mood-log.service.ts       # CRUD + history/streak/heatmap; create() runs detection + recommendation inline
│   ├── emotion-analysis.service.ts   # wraps ApiClientService (FastAPI) for photo/voice analysis
│   ├── storage.service.ts        # saves uploaded media locally or to S3
│   └── validation.service.ts
├── entities/
│   └── mood-log.entity.ts
├── interfaces/
└── dto/
    └── create-mood-log.dto.ts
```

## How it works

`POST /v1/mood-log` saves any uploaded photo/voice file, then calls `EmotionAnalysisService` directly and awaits the result before responding: `analyzeImageEmotion`/`analyzeVoiceEmotion` hit the external FastAPI inference service, and `finalMood` resolves to `photoEmotion ?? voiceSentiment ?? moodLabel ?? 'neutral'`. The row is saved with that real `finalMood`, then `ExperienceRecommendationService.recommendByEmotion` (from the [experience module](../experience/README.md)) runs in the same request to produce matching experiences. The response is `{ moodLog, recommendations }`, both final, no polling or socket connection needed on the client.

This trades request latency (the client waits on the FastAPI call) for immediacy: earlier this flow queued a `mood.detect` RabbitMQ event and returned `201` right away, with the worker process doing this same work off the request path and pushing results back over Socket.IO. That async path (`src/worker/mood-detection.worker.ts`) has been removed since nothing produces `mood.detect` anymore, see [worker README](../worker/README.md).

`EmotionAnalysisService` handles both local file paths and S3 URLs: S3 URLs are downloaded to a temp file via `FileDownloadService` before being re-uploaded to FastAPI, then cleaned up.

## Endpoints

`@Controller('mood-log')`, `JwtCookieGuard`, `@SkipThrottle()`

| Method | Route | Description |
|---|---|---|
| POST | `/v1/mood-log` | Create a mood log. Multipart form: `moodLabel`, `note`, optional `photo` file, optional `voice` file. Runs emotion detection and recommendation matching synchronously; returns `{ moodLog, recommendations }` |
| GET | `/v1/mood-log/today` | Most recent log created today |
| GET | `/v1/mood-log/recent` | Most recent log overall |
| GET | `/v1/mood-log/history` | Paginated history (`limit` default 30, `page` default 1) |
| GET | `/v1/mood-log/daily-summary` | Today's logs grouped into morning / afternoon / night (hour boundaries in `mood-log.constants.ts`, server local time), with a dominant mood per group |
| GET | `/v1/mood-log/range` | Logs between `start` and `end` query dates |
| GET | `/v1/mood-log/streak` | `{ streak, totalDaysLogged }` |
| GET | `/v1/mood-log/heatmap` | `{ [date]: finalMood }` map for calendar visualization |
