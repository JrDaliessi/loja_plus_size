import { randomUUID } from 'node:crypto';

import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import type { Observable } from 'rxjs';

interface HttpRequestLike {
  headers: Record<string, string | string[] | undefined>;
}

interface HttpResponseLike {
  setHeader(name: string, value: string): void;
}

@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<HttpRequestLike>();
    const response = http.getResponse<HttpResponseLike>();
    const header = request.headers['x-correlation-id'];
    const candidate = Array.isArray(header) ? header[0] : header;
    response.setHeader('x-correlation-id', candidate?.trim() || randomUUID());
    return next.handle();
  }
}
