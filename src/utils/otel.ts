import { CompositePropagator, W3CBaggagePropagator, W3CTraceContextPropagator } from '@opentelemetry/core';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { trace } from '@opentelemetry/api';

export const OTEL_SERVICE_NAME = process.env.NEXT_PUBLIC_OTEL_SERVICE_NAME || 'cf-pages';
export const OTEL_HTTP_ENDPOINT = process.env.NEXT_PUBLIC_OTEL_HTTP_ENDPOINT || 'http://localhost:4318/v1/traces';
export const LocalTraceTypeKey = 'localTraceType';
export let globalTracerProvider: WebTracerProvider | null = null;

export type TraceType = 'auto' | 'custom' | 'prevent';

export const getTracer = (service: string) => trace.getTracer(service);

const sendPreflightRequest = async () => {
  const preflightResult = await fetch(OTEL_HTTP_ENDPOINT, {
    method: 'POST',
  }).catch(() => {});
  if (!preflightResult) return false;
  const { status, ok } = preflightResult;
  if (status === 415) return true;
  return ok;
};

export const otelTracer = async (traceType: TraceType | null = null) => {
  if (traceType === null) return;
  const testFlightSuccess = await sendPreflightRequest();
  if (!testFlightSuccess || traceType === 'prevent') return;

  if (globalTracerProvider) await globalTracerProvider.shutdown();

  const { ZoneContextManager } = await import('@opentelemetry/context-zone');

  const provider = (globalTracerProvider = new WebTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: OTEL_SERVICE_NAME,
    }),
  }));

  provider.addSpanProcessor(
    new SimpleSpanProcessor(
      new OTLPTraceExporter({
        url: OTEL_HTTP_ENDPOINT,
      })
    )
  );

  const contextManager = new ZoneContextManager();

  provider.register({
    contextManager,
    propagator: new CompositePropagator({
      propagators: [new W3CBaggagePropagator(), new W3CTraceContextPropagator()],
    }),
  });

  if (traceType !== 'auto') return;

  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [getWebAutoInstrumentations()],
  });
};
