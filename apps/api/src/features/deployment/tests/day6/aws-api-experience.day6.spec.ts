import 'reflect-metadata';

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { jest } from '@jest/globals';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule, type ApiRuntime } from '../../../../app.module';
import { createRequestTelemetry } from '../../../../shared/observability/request-telemetry';
import {
  configureTrustedProxy,
  createCorsOptions,
  createPublicCatalogRateLimiter,
} from '../../../../shared/security/public-edge-policy';
import type { CatalogHttpService } from '../../../catalog/presentation/http/catalog-http.tokens';

const repositoryRoot = existsSync(resolve(process.cwd(), 'apps/api/src/main.ts'))
  ? process.cwd()
  : resolve(process.cwd(), '../..');
const apiRoot = resolve(repositoryRoot, 'apps/api');

describe('FEATURE-AWS-API-DEPLOY Dia 6 operational experience', () => {
  test('AWS-EXP-001 / AC-004..005 returns non-cacheable JSON health responses with correlation', async () => {
    const app = await createExperienceApp();

    try {
      for (const path of ['/health/live', '/health/ready']) {
        const response = await request(app.getHttpServer())
          .get(path)
          .set('x-correlation-id', 'corr-health-day6');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('application/json');
        expect(response.headers['cache-control']).toBe('no-store');
        expect(response.headers['x-correlation-id']).toBe('corr-health-day6');
      }
    } finally {
      await app.close();
    }
  });

  test('AWS-EXP-002 / AC-011 replaces an unsafe correlation identifier', async () => {
    const app = await createExperienceApp();

    try {
      const response = await request(app.getHttpServer())
        .get('/health/live')
        .set('x-correlation-id', 'unsafe value with spaces');

      expect(response.status).toBe(200);
      expect(response.headers['x-correlation-id']).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u,
      );
    } finally {
      await app.close();
    }
  });

  test('AWS-EXP-009 / AC-005 keeps unavailable readiness non-cacheable and generic', async () => {
    const app = await createExperienceApp(false);

    try {
      const response = await request(app.getHttpServer())
        .get('/health/ready')
        .set('x-correlation-id', 'corr-ready-unavailable');

      expect(response.status).toBe(503);
      expect(response.headers['cache-control']).toBe('no-store');
      expect(response.headers['x-correlation-id']).toBe('corr-ready-unavailable');
      expect(response.body).toEqual({ status: 'unavailable' });
    } finally {
      await app.close();
    }
  });

  test('AWS-EXP-003 / AC-016 makes allowed preflight explicit and credential-free', async () => {
    const app = await createExperienceApp();

    try {
      const response = await request(app.getHttpServer())
        .options('/v1/catalog/products')
        .set('origin', 'https://loja-plus-size.vercel.app')
        .set('access-control-request-method', 'GET')
        .set('access-control-request-headers', 'x-correlation-id');

      expect(response.status).toBe(204);
      expect(response.headers['access-control-allow-origin']).toBe(
        'https://loja-plus-size.vercel.app',
      );
      expect(response.headers['access-control-allow-credentials']).toBeUndefined();
      expect(response.headers['access-control-allow-methods']).toContain('GET');
      expect(response.headers['access-control-allow-headers']).toContain(
        'X-Correlation-ID',
      );
    } finally {
      await app.close();
    }
  });

  test('AWS-EXP-004 / AC-016 does not grant CORS to a denied preflight origin', async () => {
    const app = await createExperienceApp();

    try {
      const response = await request(app.getHttpServer())
        .options('/v1/catalog/products')
        .set('origin', 'https://attacker.example')
        .set('access-control-request-method', 'GET');

      expect(response.headers['access-control-allow-origin']).toBeUndefined();
      expect(response.headers['access-control-allow-credentials']).toBeUndefined();
    } finally {
      await app.close();
    }
  });

  test('AWS-EXP-005 / AC-011, AC-016 returns a diagnosable non-cacheable 429 response', async () => {
    const app = await createExperienceApp();

    try {
      await request(app.getHttpServer())
        .get('/v1/catalog/products')
        .set('x-forwarded-for', '203.0.113.20');
      const response = await request(app.getHttpServer())
        .get('/v1/catalog/products')
        .set('x-forwarded-for', '203.0.113.20')
        .set('x-correlation-id', 'corr-rate-day6');

      expect(response.status).toBe(429);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.headers['cache-control']).toBe('no-store');
      expect(response.headers['x-correlation-id']).toBe('corr-rate-day6');
      expect(response.body).toEqual({
        error: 'Too Many Requests',
        message: 'RATE_LIMIT_EXCEEDED',
        statusCode: 429,
      });
    } finally {
      await app.close();
    }
  });

  test('AWS-EXP-006 / AC-011 keeps telemetry before the terminating rate limiter', () => {
    const source = readFileSync(resolve(apiRoot, 'src/main.ts'), 'utf8');

    expect(source.indexOf('createRequestTelemetry({')).toBeGreaterThan(-1);
    expect(source.indexOf('createPublicCatalogRateLimiter(config.rateLimit)')).toBeGreaterThan(
      source.indexOf('createRequestTelemetry({'),
    );
  });

  test('AWS-EXP-007 / AC-013 provides a safe operational runbook', () => {
    const runbook = resolve(repositoryRoot, 'docs/infrastructure/aws-runbook.md');

    expect(existsSync(runbook)).toBe(true);
    if (!existsSync(runbook)) return;
    const source = readFileSync(runbook, 'utf8');

    expect(source).toContain('## Pre-deployment Gate');
    expect(source).toContain('## Smoke and Expected Results');
    expect(source).toContain('## Incident Triage');
    expect(source).toContain('## Rollback');
    expect(source).toContain('## Teardown Safety');
    expect(source).toContain('authorization: Bearer <redacted>');
    expect(source).toContain('No command in this runbook authorizes remote mutation.');
  });

  test('AWS-EXP-008 / AC-004, AC-011 validates operational headers in the image smoke', () => {
    const source = readFileSync(
      resolve(repositoryRoot, '.github/workflows/api-deploy.yml'),
      'utf8',
    );

    expect(source).toContain('X-Correlation-ID: smoke-live-runner');
    expect(source).toContain('cache-control: no-store');
    expect(source).toContain('x-correlation-id: smoke-live-runner');
  });
});

const createExperienceApp = async (readinessAvailable = true) => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule.register(createRuntime(readinessAvailable))],
  }).compile();
  const app = moduleRef.createNestApplication();
  configureTrustedProxy(app, 1);
  app.enableCors(createCorsOptions(['https://loja-plus-size.vercel.app']));
  app.use(
    createRequestTelemetry({
      environment: 'test',
      revision: 'day6-test',
      service: 'plus-store-api',
      write: () => undefined,
    }),
  );
  app.use(
    '/v1/catalog/products',
    createPublicCatalogRateLimiter({ limit: 1, windowMs: 60_000 }),
  );
  await app.init();
  return app;
};

const createRuntime = (readinessAvailable: boolean): ApiRuntime => {
  const catalogService: CatalogHttpService = {
    createDraft: jest.fn<CatalogHttpService['createDraft']>(),
    activate: jest.fn<CatalogHttpService['activate']>(),
    archive: jest.fn<CatalogHttpService['archive']>(),
    listPublic: jest
      .fn<CatalogHttpService['listPublic']>()
      .mockResolvedValue({ items: [] }),
  };

  return {
    catalogIdentity: {
      authenticate: jest.fn<() => Promise<never>>(),
    },
    catalogService,
    readinessProbe: {
      check: readinessAvailable
        ? jest.fn<() => Promise<void>>().mockResolvedValue()
        : jest.fn<() => Promise<void>>().mockRejectedValue(new Error('synthetic')),
    },
  };
};
