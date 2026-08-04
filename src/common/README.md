# Common Module

`src/common` — cross-cutting services and shared building blocks used across feature modules. No HTTP controller.

## Structure

```
common/
├── common.module.ts        # provides + exports the four services below
├── services/
│   ├── transaction.service.ts     # withTransaction / withSerializableTransaction (TypeORM QueryRunner wrapper)
│   ├── api-client.service.ts      # ApiClientService — HTTP client for the external FastAPI inference service
│   ├── gemini.service.ts          # GeminiService — @google/generative-ai wrapper (generateText)
│   ├── s3.service.ts               # S3Service — AWS S3 upload/presign
│   └── file-download.service.ts   # downloads an S3 URL to a local temp file (for re-upload to FastAPI)
├── dto/
│   └── result.dto.ts               # ResultDto — the response envelope used by nearly every controller
├── enums/
│   └── user.enums.ts                # UserRole: user | host | admin
├── constants/
│   └── error-code-map.ts            # maps ERROR_TYPE strings → HTTP status codes
├── interceptors/                    # (see source — perf/logging interceptors)
├── roles.decorator.ts                # @Roles(...roles)
└── roles.guard.ts                     # RolesGuard — checks request.user.role against @Roles metadata
```

## Key pieces

- **`ResultDto`** — the standard response shape across the API: `ResultDto.ok(data, message, statusCode)` / `ResultDto.fail(reason, statusCode, errorType)` / `ResultDto.okEmpty()`. Combined with `ERROR_CODE_MAP`, this gives a consistent `{ success, statusCode, data, message }` / `{ success: false, statusCode, reason, errorType }` shape everywhere.
- **`TransactionService`** — wraps a TypeORM `QueryRunner` in `try/commit/catch-rollback/finally-release`. `withTransaction` runs at `READ COMMITTED`; `withSerializableTransaction` is available for operations that need stronger isolation. Used by booking creation/cancellation — see [booking module](../booking/README.md).
- **`ApiClientService`** — the only place in this repo that calls the external FastAPI inference service (`FASTAPI_URL`, bearer `HF_TOKEN`). Exposes `postFile(...)` for multipart uploads (emotion analysis) and a JSON POST for `/embed`.
- **`GeminiService`** — wraps `@google/generative-ai` (model `gemini-2.5-flash`), `generateText(prompt)`, strips markdown code fences from JSON responses. Used by AI experience generation ([experience module](../experience/README.md)) and as one of two recommendation reranking providers ([recommendation module](../recommendation/README.md)).
- **`S3Service`** — uploads (avatars, experience images) to AWS S3 and generates presigned URLs, via `@aws-sdk/client-s3` / `@aws-sdk/s3-request-presigner`.
- **`FileDownloadService`** — downloads a file from an S3 URL to a local temp path, used when re-submitting previously-uploaded media to FastAPI for analysis, with cleanup after use.
- **`RolesGuard` / `@Roles(...)`** — role-based access control building block, used across almost every protected controller alongside `JwtCookieGuard`/`JwtBearerGuard` (see [auth module](../auth/README.md)).
