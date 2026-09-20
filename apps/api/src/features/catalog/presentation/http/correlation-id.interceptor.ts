import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import type { Observable } from 'rxjs';

import {
  type CorrelationRequest,
  resolveCorrelationId,
} from './correlation-id';

interface HttpResponseLike {
  setHeader(name: string, value: string): void;
}

@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<CorrelationRequest>();
    const response = http.getResponse<HttpResponseLike>();
    response.setHeader('x-correlation-id', resolveCorrelationId(request));
    return next.handle();
  }
}
