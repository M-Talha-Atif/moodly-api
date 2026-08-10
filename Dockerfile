# Multi-stage build shared by both processes (src/main.ts and src/worker/main.ts).
# `nest build` compiles the whole src/ tree with tsc, so both entrypoints land under dist/
# from a single build, docker-compose.yml picks the entrypoint per service via `command:`.

FROM node:20-bookworm-slim AS builder
WORKDIR /app

# python3/make/g++ are here for native modules (bcrypt, sharp) that fall back to
# compiling from source when a prebuilt binary isn't available for this platform.
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN npm prune --omit=dev

FROM node:20-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

# curl is only for the compose-level HEALTHCHECK probes below.
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --gid 1001 nodeapp \
    && useradd --uid 1001 --gid nodeapp --shell /bin/false --create-home nodeapp

COPY --from=builder --chown=nodeapp:nodeapp /app/node_modules ./node_modules
COPY --from=builder --chown=nodeapp:nodeapp /app/dist ./dist
COPY --from=builder --chown=nodeapp:nodeapp /app/package.json ./package.json

# main.ts and worker/main.ts both resolve logDir to <app-root>/logs at runtime and
# mkdir it themselves, but the directory needs to exist with the right owner up front
# since nodeapp has no write access to /app otherwise.
RUN mkdir -p /app/logs /app/uploads && chown -R nodeapp:nodeapp /app/logs /app/uploads

USER nodeapp

# API listens on 3002, worker's HTTP health listener is on 3001 (see src/worker/worker.constants.ts).
EXPOSE 3002 3001

# Overridden per service in docker-compose.yml (worker runs the worker/main.js variant).
# -r preloads OpenTelemetry instrumentation (src/tracing.ts) before anything else loads.
CMD ["node", "-r", "./dist/tracing.js", "dist/main.js"]
