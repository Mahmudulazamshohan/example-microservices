// import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
// import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
// import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
// import { Resource } from '@opentelemetry/resources';
// import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
// // import { DiagConsoleLogger, DiagLogLevel, diag } from '@opentelemetry/api';
// import { registerInstrumentations } from '@opentelemetry/instrumentation';
// import { MySQL2Instrumentation } from '@opentelemetry/instrumentation-mysql2';
// import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
// import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';

// const instrumentations = [
//   new HttpInstrumentation(),
//   // new ExpressInstrumentation(),
//   new NestInstrumentation(),
//   new MySQL2Instrumentation(),
// ];

// ((serviceName = process?.env?.SERVICE_NAME) => {
//   if (!process.env.OTEL_EXPORTER_OTLP_ENDPOINT) {
//     throw new Error('OTEL_EXPORTER_OTLP_SPAN_ENDPOINT is not defined');
//   }

//   const provider = new NodeTracerProvider({
//     resource: new Resource({
//       [SemanticResourceAttributes.SERVICE_NAME]:
//         process?.env?.SERVICE_NAME || serviceName,
//     }),
//   });

//   const exporter = new OTLPTraceExporter({
//     url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
//   });

//   provider.addSpanProcessor(new BatchSpanProcessor(exporter));
//   // diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);
//   provider.register();

//   registerInstrumentations({
//     tracerProvider: provider,
//     instrumentations,
//   });

//   console.log(`Tracing initialized for ${serviceName}`);
// })();

import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
const opentelemetry = require('@opentelemetry/sdk-node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
// const {
//   getNodeAutoInstrumentations,
// } = require('@opentelemetry/auto-instrumentations-node');
import { MySQL2Instrumentation } from '@opentelemetry/instrumentation-mysql2';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { AmqplibInstrumentation } from '@opentelemetry/instrumentation-amqplib';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
const { Resource } = require('@opentelemetry/resources');
const {
  SemanticResourceAttributes,
} = require('@opentelemetry/semantic-conventions');
(async () => {
  // Configure logging FIRST to capture initialization process
  diag.setLogger(new DiagConsoleLogger(), {
    logLevel: DiagLogLevel.INFO,
    suppressOverrideMessage: true,
  });

  // Jaeger Configuration (Choose either Collector or Agent approach)
  const jaegerExporter = new JaegerExporter({
    // Collector configuration (HTTP)
    endpoint: 'http://jaeger:14268/api/traces',
    serviceName: 'authentication',
  });
  const sdk = new opentelemetry.NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'authentication',
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: 'development',
    }),
    traceExporter: jaegerExporter,
    instrumentations: [
      new HttpInstrumentation(),
      // new ExpressInstrumentation(),
      new NestInstrumentation(),
      new MySQL2Instrumentation(),
      new AmqplibInstrumentation(),
    ],
  });

  // Handle initialization errors
  await sdk.start();

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM - Shutting down');
    sdk
      .shutdown()
      .then(() => console.log('SDK shut down successfully'))
      .catch((err: Error) => console.error('Error during SDK shutdown:', err))
      .finally(() => {
        // Add any additional cleanup here
        process.exit(0);
      });
  });

  // Optional: Handle other shutdown signals
  process.on('SIGINT', async () => {
    console.log('Received SIGINT - Shutting down');
    await sdk.shutdown();
  });
})();
