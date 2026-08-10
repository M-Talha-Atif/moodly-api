// Preloaded via `node -r ./dist/tracing.js dist/main.js` (see package.json scripts, the
// Dockerfile CMD, and docker-compose.yml), not imported normally. It has to run before
// dist/main.js is required at all so auto-instrumentation can patch http/pg/mongoose/
// ioredis/amqplib before the app's own code first requires them.
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';

const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;

if (otlpEndpoint) {
  const headers = parseOtlpHeaders(process.env.OTEL_EXPORTER_OTLP_HEADERS);
  const serviceName = process.env.OTEL_SERVICE_NAME || 'moodly-backend';

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: serviceName,
      [ATTR_SERVICE_VERSION]: process.env.npm_package_version || '0.0.1',
    }),
    traceExporter: new OTLPTraceExporter({
      url: `${otlpEndpoint}/v1/traces`,
      headers,
    }),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
        url: `${otlpEndpoint}/v1/metrics`,
        headers,
      }),
      exportIntervalMillis: 15000,
    }),
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();

  process.on('SIGTERM', () => {
    sdk.shutdown().finally(() => process.exit(0));
  });
} else {
  console.log(
    'OTEL_EXPORTER_OTLP_ENDPOINT not set, skipping OpenTelemetry setup.',
  );
}

// OTEL_EXPORTER_OTLP_HEADERS is a comma-separated "key=value" list per the OTel spec, but
// values here are "Authorization=Basic <base64>" and base64 can itself contain "=" padding,
// so splitting naively on every "=" would corrupt the header value.
function parseOtlpHeaders(raw?: string): Record<string, string> | undefined {
  if (!raw) return undefined;
  const headers: Record<string, string> = {};
  for (const pair of raw.split(',')) {
    const separatorIndex = pair.indexOf('=');
    if (separatorIndex === -1) continue;
    const key = pair.slice(0, separatorIndex).trim();
    const value = pair.slice(separatorIndex + 1).trim();
    if (key) headers[key] = value;
  }
  return headers;
}
