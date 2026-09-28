import type { INestApplication } from '@nestjs/common';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import rateLimit, { type RateLimitRequestHandler } from 'express-rate-limit';

interface ExpressProxySettings {
  set(setting: 'trust proxy', value: number): void;
}

interface RateLimitResponse {
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
  status(code: number): RateLimitResponse;
}

export const configureTrustedProxy = (
  app: Pick<INestApplication, 'getHttpAdapter'>,
  hops: number,
): void => {
  const express = app.getHttpAdapter().getInstance() as ExpressProxySettings;
  express.set('trust proxy', hops);
};

export const createCorsOptions = (
  allowedOrigins: string[],
): CorsOptions => ({
  origin: allowedOrigins,
  credentials: false,
  methods: ['GET', 'HEAD', 'OPTIONS', 'POST'],
  allowedHeaders: ['Authorization', 'Content-Type', 'X-Correlation-ID'],
  exposedHeaders: ['X-Correlation-ID'],
  maxAge: 86_400,
  optionsSuccessStatus: 204,
});

export const createPublicCatalogRateLimiter = (options: {
  limit: number;
  windowMs: number;
}): RateLimitRequestHandler =>
  rateLimit({
    windowMs: options.windowMs,
    limit: options.limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    passOnStoreError: false,
    handler: (_request, response: RateLimitResponse) => {
      response.setHeader('Cache-Control', 'no-store');
      response.status(429).json({
        statusCode: 429,
        error: 'Too Many Requests',
        message: 'RATE_LIMIT_EXCEEDED',
      });
    },
  });
