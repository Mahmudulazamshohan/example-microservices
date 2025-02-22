export interface EventEnvelope<T> {
  version: string;
  eventType: string;
  timestamp: string;
  payload: T;
  meta?: Record<string, unknown>;
  corralationId?: string;
}
