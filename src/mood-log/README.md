# Mood Log Module

`src/mood-log`: multi-modal mood logging (text label + optional photo + optional voice), the entry point into the mood-detection → recommendation event chain. See [root README > Sample Event Flow](../../README.md#sample-event-flow-mood-log-to-recommendation) for the full async trace.

## Structure

```
mood-log/
├── mood-log.module.ts
├── mood-log.constants.ts        # pagination defaults, daily-summary hour buckets
├── mood-log.controller.ts       # @Controller('mood-log')
├── services/
│   ├── mood-log.service.ts       # CRUD + history/streak/heatmap, emits mood.detect
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

`POST /v1/mood-log` persists the log immediately with `finalMood` provisionally set to the client-supplied `moodLabel`, returns `201`, and emits a `mood.detect` RabbitMQ event containing the mood log id and any uploaded file paths. The **worker process** (`src/worker/mood-detection.worker.ts`, a different module: see [worker README](../worker/README.md)) picks that event up, calls the external FastAPI inference service for photo/voice emotion analysis, and updates the row's `finalMood`, `photoEmotion`, `voiceSentiment`: then chains a `recommendation.generate` event. This module never talks to FastAPI or RabbitMQ consumers directly on the request path; it only produces the initial event.

`EmotionAnalysisService` (used by the worker, defined here since it shares the mood-log domain) handles both local file paths and S3 URLs: S3 URLs are downloaded to a temp file via `FileDownloadService` before being re-uploaded to FastAPI, then cleaned up.

## Endpoints

`@Controller('mood-log')`, `JwtCookieGuard`, `@SkipThrottle()`

| Method | Route | Description |
|---|---|---|
| POST | `/v1/mood-log` | Create a mood log. Multipart form: `moodLabel`, `note`, optional `photo` file, optional `voice` file |
| GET | `/v1/mood-log/today` | Most recent log created today |
| GET | `/v1/mood-log/recent` | Most recent log overall |
| GET | `/v1/mood-log/history` | Paginated history (`limit` default 30, `page` default 1) |
| GET | `/v1/mood-log/daily-summary` | Today's logs grouped into morning / afternoon / night (hour boundaries in `mood-log.constants.ts`, server local time), with a dominant mood per group |
| GET | `/v1/mood-log/range` | Logs between `start` and `end` query dates |
| GET | `/v1/mood-log/streak` | `{ streak, totalDaysLogged }` |
| GET | `/v1/mood-log/heatmap` | `{ [date]: finalMood }` map for calendar visualization |
