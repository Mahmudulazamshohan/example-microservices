import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { DiagConsoleLogger, DiagLogLevel, diag } from '@opentelemetry/api';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { MySQL2Instrumentation } from '@opentelemetry/instrumentation-mysql2';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';

const instrumentations = [
  new HttpInstrumentation(),
  // new ExpressInstrumentation(),
  new NestInstrumentation(),
  new MySQL2Instrumentation(),
];

((serviceName = '') => {
  if (!process.env.OTEL_EXPORTER_OTLP_ENDPOINT) {
    throw new Error('OTEL_EXPORTER_OTLP_SPAN_ENDPOINT is not defined');
  }

  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]:
        process?.env?.SERVICE_NAME || serviceName,
    }),
  });

  const exporter = new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
  });

  provider.addSpanProcessor(new BatchSpanProcessor(exporter));
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);
  provider.register();

  registerInstrumentations({
    tracerProvider: provider,
    instrumentations,
  });

  console.log(`Tracing initialized for ${serviceName}`);
})();
