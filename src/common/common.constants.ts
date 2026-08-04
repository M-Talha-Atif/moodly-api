// How long a client-issued presigned S3 upload URL stays valid.
export const DEFAULT_PRESIGNED_URL_EXPIRY_SECONDS = 300;

// Applied to every call to the external FastAPI inference service (emotion analysis, embeddings).
export const FASTAPI_REQUEST_TIMEOUT_MS = 35000;
