import { randomUUID } from 'node:crypto';

import {
  ArgumentsHost,
  Catch,
  type ExceptionFilter,
} from '@nestjs/common';
import { z } from 'zod';

import { CatalogError } from '../../domain/catalog.error';

interface HttpRequestLike {
  headers: Record<string, string | string[] | undefined>;
}

interface HttpResponseLike {
  status(code: number): HttpResponseLike;
  setHeader(name: string, value: string): void;
  json(body: unknown): void;
}

interface ErrorPresentation {
  status: number;
  code: string;
  message: string;
}

const presentCatalogError = (error: CatalogError): ErrorPresentation => {
  if (error.code === 'CATALOG_UNAUTHENTICATED') {
    return { status: 401, code: error.code, message: 'Authentication required' };
  }
  if (error.code === 'CATALOG_FORBIDDEN') {
    return { status: 403, code: error.code, message: 'Insufficient permission' };
  }
  if (error.code.endsWith('_NOT_FOUND')) {
    return { status: 404, code: error.code, message: 'Catalog resource not found' };
  }
  if (error.code.endsWith('_CONFLICT')) {
    return { status: 409, code: error.code, message: 'Catalog resource conflict' };
  }
  if (
    error.code.startsWith('CATALOG_INVALID_') ||
    error.code === 'CATALOG_PUBLICATION_INCOMPLETE'
  ) {
    return { status: 422, code: error.code, message: 'Catalog request is invalid' };
  }
  if (
    error.code === 'CATALOG_STORAGE_UNAVAILABLE' ||
    error.code === 'CATALOG_PERSISTENCE_UNAVAILABLE'
  ) {
    return { status: 503, code: error.code, message: 'Catalog dependency unavailable' };
  }
  return { status: 500, code: 'CATALOG_INTERNAL_ERROR', message: 'Unexpected catalog error' };
};

const readCorrelationId = (request: HttpRequestLike): string => {
  const value = request.headers['x-correlation-id'];
  const candidate = Array.isArray(value) ? value[0] : value;
  return candidate?.trim() || randomUUID();
};

@Catch()
export class CatalogHttpExceptionFilter implements ExceptionFilter {
  catch(error: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const request = http.getRequest<HttpRequestLike>();
    const response = http.getResponse<HttpResponseLike>();
    const correlationId = readCorrelationId(request);
    const presentation =
      error instanceof z.ZodError
        ? {
            status: 422,
            code: 'CATALOG_VALIDATION_FAILED',
            message: 'Request validation failed',
          }
        : error instanceof CatalogError
          ? presentCatalogError(error)
          : {
              status: 500,
              code: 'CATALOG_INTERNAL_ERROR',
              message: 'Unexpected catalog error',
            };

    response.setHeader('x-correlation-id', correlationId);
    response.status(presentation.status).json({
      error: {
        code: presentation.code,
        message: presentation.message,
        correlationId,
      },
    });
  }
}
