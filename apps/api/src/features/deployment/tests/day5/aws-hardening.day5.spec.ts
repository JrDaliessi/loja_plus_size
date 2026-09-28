import 'reflect-metadata';

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { jest } from '@jest/globals';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule, type ApiRuntime } from '../../../../app.module';
import { loadApiConfig } from '../../../../shared/config/api.config';
import type { CatalogHttpService } from '../../../catalog/presentation/http/catalog-http.tokens';

const repositoryRoot = existsSync(resolve(process.cwd(), 'apps/api/src/main.ts'))
  ? process.cwd()
  : resolve(process.cwd(), '../..');
const apiRoot = resolve(repositoryRoot, 'apps/api');

const productionEnvironment = {
  NODE_ENV: 'production',
  DATABASE_URL:
    'postgresql://catalog_app:synthetic@pooler.example.com:5432/postgres?sslmode=require',
  DATABASE_POOL_MAX: '5',
  DATABASE_POOL_CONNECTION_TIMEOUT_MS: '3000',
  DATABASE_POOL_IDLE_TIMEOUT_MS: '10000',
  DATABASE_POOL_MAX_LIFETIME_SECONDS: '300',
  SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_example',
  SUPABASE_STORAGE_BUCKET: 'product-media',
  API_ALLOWED_ORIGINS: 'https://loja-plus-size.vercel.app,https://admin.example.com',
  API_RATE_LIMIT_WINDOW_MS: '60000',
  API_RATE_LIMIT_MAX: '60',
  API_SWAGGER_ENABLED: 'false',
  PORT: '3001',
};

describe('FEATURE-AWS-API-DEPLOY Dia 5 hardening', () => {
  test('AWS-HARD-001 / AC-007 makes the application-side PostgreSQL pool explicit and bounded', async () => {
    const config = loadApiConfig(productionEnvironment);
    const modulePath = '../../../../shared/database/prisma-pg-options';
    const database = (await import(modulePath)) as {
      createPrismaPgOptions: (input: typeof config) => Record<string, unknown>;
    };

    expect(database.createPrismaPgOptions(config)).toEqual({
      connectionString: productionEnvironment.DATABASE_URL,
      connectionTimeoutMillis: 3000,
      idleTimeoutMillis: 10000,
      max: 5,
      maxLifetimeSeconds: 300,
    });
  });

  test('AWS-HARD-002 / AC-016 accepts only explicit HTTPS browser origins in production', () => {
    expect(loadApiConfig(productionEnvironment)).toMatchObject({
      allowedOrigins: [
        'https://loja-plus-size.vercel.app',
        'https://admin.example.com',
      ],
      nodeEnvironment: 'production',
      swaggerEnabled: false,
      rateLimit: {
        windowMs: 60_000,
        limit: 60,
        trustProxyHops: 1,
      },
    });

    for (const API_ALLOWED_ORIGINS of [
      '',
      '*',
      'http://loja-plus-size.vercel.app',
      'https://loja-plus-size.vercel.app/path',
    ]) {
      expect(() =>
        loadApiConfig({ ...productionEnvironment, API_ALLOWED_ORIGINS }),
      ).toThrow('API_CONFIGURATION_INVALID');
    }
  });

  test('AWS-HARD-003 / AC-016 rejects unsafe pool, rate-limit and production Swagger settings', () => {
    const unsafeEnvironments = [
      { DATABASE_POOL_MAX: '0' },
      { DATABASE_POOL_CONNECTION_TIMEOUT_MS: '0' },
      { DATABASE_POOL_IDLE_TIMEOUT_MS: '0' },
      { DATABASE_POOL_MAX_LIFETIME_SECONDS: '0' },
      { API_RATE_LIMIT_WINDOW_MS: '0' },
      { API_RATE_LIMIT_MAX: '0' },
      { API_TRUST_PROXY_HOPS: '0' },
      { API_SWAGGER_ENABLED: 'true' },
    ];

    for (const unsafe of unsafeEnvironments) {
      expect(() => loadApiConfig({ ...productionEnvironment, ...unsafe })).toThrow(
        'API_CONFIGURATION_INVALID',
      );
    }
  });

  test('AWS-HARD-004 / AC-016 applies an allowlist CORS policy', async () => {
    const modulePath = '../../../../shared/security/public-edge-policy';
    const policy = (await import(modulePath)) as {
      createCorsOptions: (allowedOrigins: string[]) => Record<string, unknown>;
    };
    const runtime = createRuntime();
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule.register(runtime)],
    }).compile();
    const app = moduleRef.createNestApplication();
    app.enableCors(
      policy.createCorsOptions(['https://loja-plus-size.vercel.app']),
    );
    await app.init();

    try {
      const allowed = await request(app.getHttpServer())
        .get('/health/live')
        .set('origin', 'https://loja-plus-size.vercel.app');
      const denied = await request(app.getHttpServer())
        .get('/health/live')
        .set('origin', 'https://attacker.example');

      expect(allowed.headers['access-control-allow-origin']).toBe(
        'https://loja-plus-size.vercel.app',
      );
      expect(allowed.headers['access-control-allow-credentials']).toBeUndefined();
      expect(denied.headers['access-control-allow-origin']).toBeUndefined();
    } finally {
      await app.close();
    }
  });

  test('AWS-HARD-005 / AC-016 rate-limits only the public catalog route', async () => {
    const modulePath = '../../../../shared/security/public-edge-policy';
    const policy = (await import(modulePath)) as {
      configureTrustedProxy: (app: unknown, hops: number) => void;
      createPublicCatalogRateLimiter: (options: {
        limit: number;
        windowMs: number;
      }) => (request: unknown, response: unknown, next: () => void) => void;
    };
    const runtime = createRuntime();
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule.register(runtime)],
    }).compile();
    const app = moduleRef.createNestApplication();
    policy.configureTrustedProxy(app, 1);
    app.use(
      '/v1/catalog/products',
      policy.createPublicCatalogRateLimiter({ limit: 2, windowMs: 60_000 }),
    );
    await app.init();

    try {
      const first = await request(app.getHttpServer())
        .get('/v1/catalog/products')
        .set('x-forwarded-for', '203.0.113.10');
      const second = await request(app.getHttpServer())
        .get('/v1/catalog/products')
        .set('x-forwarded-for', '203.0.113.10');
      const limited = await request(app.getHttpServer())
        .get('/v1/catalog/products')
        .set('x-forwarded-for', '203.0.113.10');
      const independentClient = await request(app.getHttpServer())
        .get('/v1/catalog/products')
        .set('x-forwarded-for', '203.0.113.11');
      const health = await request(app.getHttpServer()).get('/health/live');

      expect([first.status, second.status]).toEqual([200, 200]);
      expect(limited.status).toBe(429);
      expect(limited.headers['ratelimit-policy']).toBeDefined();
      expect(independentClient.status).toBe(200);
      expect(health.status).toBe(200);
    } finally {
      await app.close();
    }
  });

  test('AWS-HARD-006 / AC-016 keeps Swagger behind an explicit runtime condition', () => {
    const source = readFileSync(resolve(apiRoot, 'src/main.ts'), 'utf8');

    expect(source).toContain('if (config.swaggerEnabled)');
    expect(source).toContain('createCorsOptions(config.allowedOrigins)');
    expect(source).toContain('createPublicCatalogRateLimiter');
    expect(source).toContain(
      'configureTrustedProxy(app, config.rateLimit.trustProxyHops)',
    );
  });

  test('AWS-HARD-007 / AC-016 keeps the production image smoke compatible with the edge policy', () => {
    const source = readFileSync(
      resolve(repositoryRoot, '.github/workflows/api-deploy.yml'),
      'utf8',
    );

    expect(source).toContain(
      '--env API_ALLOWED_ORIGINS=https://preview.example.com',
    );
    expect(source).toContain('--env API_SWAGGER_ENABLED=false');
  });

  test('AWS-HARD-008 / AC-009, AC-012 and AC-013 defines bounded IAM, cost, rollback and teardown', () => {
    const hardeningPlan = resolve(
      repositoryRoot,
      'docs/infrastructure/aws-hardening.yaml',
    );

    expect(existsSync(hardeningPlan)).toBe(true);
    if (!existsSync(hardeningPlan)) return;
    const source = readFileSync(hardeningPlan, 'utf8');

    expect(source).toContain('remote_creation_authorized: false');
    expect(source).toContain('region: sa-east-1');
    expect(source).toContain('desired_tasks: 1');
    expect(source).toContain('maximum_tasks: 2');
    expect(source).toContain('application_pool_max_per_task: 5');
    expect(source).toContain('network_ingress: alb_security_group_only');
    expect(source).toContain('direct_public_task_ingress: false');
    expect(source).toContain('estimate_status: pending_human_approval');
    expect(source).toContain('deploy_by_image_digest: true');
    expect(source).toContain('last_known_healthy_digest');
    expect(source).toContain('preserve_cloudwatch_evidence: true');
    expect(source).toContain('preserve_supabase: true');
    expect(source).toContain('preserve_vercel: true');
    expect(source).not.toMatch(/(?:actions?|resources?):\s*\[[^\]]*["']?\*["']?/iu);
  });
});

const createRuntime = (): ApiRuntime => {
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
      check: jest.fn<() => Promise<void>>().mockResolvedValue(),
    },
  };
};
