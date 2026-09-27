import { randomUUID } from 'node:crypto';

export interface CorrelationRequest {
  headers: Record<string, string | string[] | undefined>;
  correlationId?: string;
}

const trustedCorrelationId = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

export const resolveCorrelationId = (request: CorrelationRequest): string => {
  if (request.correlationId) {
    return request.correlationId;
  }

  const header = request.headers['x-correlation-id'];
  const candidate = (Array.isArray(header) ? header[0] : header)?.trim();
  const correlationId =
    candidate && trustedCorrelationId.test(candidate) ? candidate : randomUUID();
  request.correlationId = correlationId;
  return correlationId;
};
