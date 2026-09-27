import {
  type CorrelationRequest,
  resolveCorrelationId,
} from './correlation-id';

interface TelemetryRequest extends CorrelationRequest {
  method?: string;
}

interface TelemetryResponse {
  statusCode: number;
  setHeader(name: string, value: string): void;
  once(event: 'finish', listener: () => void): void;
}

export interface RequestTelemetryRecord {
  correlationId: string;
  durationMs: number;
  environment: string;
  level: 'info';
  message: 'http_request_completed';
  method: string;
  revision: string;
  service: string;
  statusCode: number;
  timestamp: string;
}

interface RequestTelemetryOptions {
  environment: string;
  now?: () => number;
  revision: string;
  service: string;
  write: (record: RequestTelemetryRecord) => void;
}

export const createRequestTelemetry = ({
  environment,
  now = () => Date.now(),
  revision,
  service,
  write,
}: RequestTelemetryOptions) => {
  return (
    request: TelemetryRequest,
    response: TelemetryResponse,
    next: () => void,
  ): void => {
    const startedAt = now();
    const correlationId = resolveCorrelationId(request);
    response.setHeader('x-correlation-id', correlationId);
    response.once('finish', () => {
      const finishedAt = now();
      const record: RequestTelemetryRecord = {
        correlationId,
        durationMs: Math.max(0, Math.round(finishedAt - startedAt)),
        environment,
        level: 'info',
        message: 'http_request_completed',
        method: request.method ?? 'UNKNOWN',
        revision,
        service,
        statusCode: response.statusCode,
        timestamp: new Date(finishedAt).toISOString(),
      };

      try {
        write(record);
      } catch {
        // Telemetry must never break an otherwise valid HTTP response.
      }
    });
    next();
  };
};
