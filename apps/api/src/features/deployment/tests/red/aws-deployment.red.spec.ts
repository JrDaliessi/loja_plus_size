import 'reflect-metadata';

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { jest } from '@jest/globals';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule, type ApiRuntime } from '../../../../app.module';
import type { CatalogHttpService } from '../../../catalog/presentation/http/catalog-http.tokens';

const repositoryRoot = existsSync(resolve(process.cwd(), 'apps/api/src/main.ts'))
  ? process.cwd()
  : resolve(process.cwd(), '../..');
const apiRoot = resolve(repositoryRoot, 'apps/api');

describe('FEATURE-AWS-API-DEPLOY RED contracts', () => {
  let app: INestApplication;
  const readinessProbe = {
    check: jest.fn<() => Promise<void>>(),
  };
  const catalogIdentity = {
    authenticate: jest.fn<() => Promise<never>>(),
  };
  const catalogService: CatalogHttpService = {
    createDraft: jest.fn<CatalogHttpService['createDraft']>(),
    activate: jest.fn<CatalogHttpService['activate']>(),
    archive: jest.fn<CatalogHttpService['archive']>(),
    listPublic: jest.fn<CatalogHttpService['listPublic']>(),
  };

  beforeEach(async () => {
    readinessProbe.check.mockResolvedValue();
    const runtime = {
      catalogIdentity,
      catalogService,
      readinessProbe,
    } as unknown as ApiRuntime;
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule.register(runtime)],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  test('AWS-HEALTH-001 / AC-004 exposes liveness without probing PostgreSQL', async () => {
    const response = await request(app.getHttpServer()).get('/health/live');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
    expect(readinessProbe.check).not.toHaveBeenCalled();
  });

  test('AWS-HEALTH-002 / AC-005 exposes readiness after one bounded probe', async () => {
    const response = await request(app.getHttpServer()).get('/health/ready');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ready' });
    expect(readinessProbe.check).toHaveBeenCalledTimes(1);
  });

  test('AWS-HEALTH-003 / AC-005 returns a generic 503 when PostgreSQL is unavailable', async () => {
    readinessProbe.check.mockRejectedValueOnce(
      new Error('postgresql://user:secret@internal.example/database'),
    );

    const response = await request(app.getHttpServer()).get('/health/ready');

    expect(response.status).toBe(503);
    expect(response.body).toEqual({ status: 'unavailable' });
    expect(JSON.stringify(response.body)).not.toContain('postgresql://');
    expect(JSON.stringify(response.body)).not.toContain('secret');
  });

  test('AWS-HEALTH-004 / AC-005 bounds a stalled PostgreSQL probe', async () => {
    const probeModulePath =
      '../../../../shared/health/infrastructure/bounded-readiness.probe';
    const { BoundedReadinessProbe } = (await import(probeModulePath)) as {
      BoundedReadinessProbe: new (
        probe: () => Promise<unknown>,
        timeoutMs: number,
      ) => { check: () => Promise<void> };
    };
    const stalledProbe = new Promise<never>(() => undefined);
    const probe = new BoundedReadinessProbe(() => stalledProbe, 10);

    await expect(probe.check()).rejects.toThrow('DATABASE_READINESS_TIMEOUT');
  });

  test('AWS-NET-001 / AC-003 binds the HTTP server explicitly to all container interfaces', () => {
    const source = readFileSync(resolve(apiRoot, 'src/main.ts'), 'utf8');

    expect(source).toMatch(/app\.listen\(config\.port,\s*['"]0\.0\.0\.0['"]\)/u);
  });

  test('AWS-LIFE-001 / AC-006 provides one idempotent shutdown handler', async () => {
    const lifecycleModulePath = '../../../../shared/runtime/api-lifecycle';
    const lifecycle = (await import(lifecycleModulePath)) as {
      createShutdownHandler: (dependencies: {
        closeApplication: () => Promise<void>;
        disconnectDatabase: () => Promise<void>;
      }) => () => Promise<void>;
    };
    const closeApplication = jest.fn<() => Promise<void>>().mockResolvedValue();
    const disconnectDatabase = jest.fn<() => Promise<void>>().mockResolvedValue();
    const shutdown = lifecycle.createShutdownHandler({
      closeApplication,
      disconnectDatabase,
    });

    await Promise.all([shutdown(), shutdown(), shutdown()]);

    expect(closeApplication).toHaveBeenCalledTimes(1);
    expect(disconnectDatabase).toHaveBeenCalledTimes(1);
  });

  test('AWS-IMG-001 / AC-001 and AC-002 defines a pinned non-root production image', () => {
    const dockerfile = resolve(apiRoot, 'Dockerfile');

    expect(existsSync(dockerfile)).toBe(true);
    if (!existsSync(dockerfile)) return;
    const source = readFileSync(dockerfile, 'utf8');
    expect(source).toContain('24.21.0');
    expect(source).toContain('11.19.0');
    expect(source).toContain('rm -rf /usr/local/lib/node_modules/npm');
    expect(source).toContain('/usr/local/bin/npm');
    expect(source).toContain('/usr/local/bin/npx');
    expect(source).toContain('/usr/local/lib/node_modules/corepack');
    expect(source).toMatch(/^USER\s+(?!root\b).+/mu);
    expect(source).toContain('CMD ["node", "dist/main.js"]');
  });

  test('AWS-IMG-002 / AC-002 excludes secrets and local state from the build context', () => {
    const dockerignore = resolve(apiRoot, 'Dockerfile.dockerignore');

    expect(existsSync(dockerignore)).toBe(true);
    if (!existsSync(dockerignore)) return;
    const source = readFileSync(dockerignore, 'utf8');
    expect(source).toMatch(/^\.env\*$/mu);
    expect(source).toMatch(/^node_modules$/mu);
    expect(source).toMatch(/^\.git$/mu);
    expect(source).toMatch(/^coverage$/mu);
  });

  test('AWS-IMG-003 / AC-001 removes stale output before producing the runtime bundle', () => {
    const source = readFileSync(resolve(apiRoot, 'scripts/build.mjs'), 'utf8');

    expect(source).toContain("await rm('dist', { recursive: true, force: true });");
  });

  test('AWS-CI-001 / AC-010 and AC-015 defines OIDC, scanning and SBOM before deploy', () => {
    const workflow = resolve(repositoryRoot, '.github/workflows/api-deploy.yml');

    expect(existsSync(workflow)).toBe(true);
    if (!existsSync(workflow)) return;
    const source = readFileSync(workflow, 'utf8');
    expect(source).toMatch(/id-token:\s*write/u);
    expect(source).toMatch(/role-to-assume/u);
    expect(source).toMatch(/sbom|syft/u);
    expect(source).toMatch(/trivy|grype|scan/u);
    expect(source).not.toMatch(/AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY/u);
  });

  test('AWS-CI-002 / AC-001 and AC-003 builds and smokes the image without publishing it', () => {
    const workflow = resolve(repositoryRoot, '.github/workflows/api-deploy.yml');

    expect(existsSync(workflow)).toBe(true);
    if (!existsSync(workflow)) return;
    const source = readFileSync(workflow, 'utf8');
    expect(source).toContain('file: apps/api/Dockerfile');
    expect(source).toContain('context: .');
    expect(source).toMatch(/load:\s*true/u);
    expect(source).toMatch(/push:\s*false/u);
    expect(source).toMatch(/docker run[\s\S]*--network host/u);
    expect(source).toContain('/health/live');
    expect(source).toContain('/health/ready');
  });

  test('AWS-CI-003 / AC-010 keeps OIDC read-only, manual and environment-gated', () => {
    const workflow = resolve(repositoryRoot, '.github/workflows/api-deploy.yml');

    expect(existsSync(workflow)).toBe(true);
    if (!existsSync(workflow)) return;
    const source = readFileSync(workflow, 'utf8');
    expect(source).toMatch(/workflow_dispatch:/u);
    expect(source).toMatch(/validate_aws_identity:/u);
    expect(source).toMatch(/environment:\s*aws-staging-readonly/u);
    expect(source).toMatch(/aws sts get-caller-identity/u);
    expect(source).toMatch(/AWS_READONLY_ROLE_ARN/u);
  });

  test('AWS-CI-004 / AC-010 and AC-015 forbids credentials, image push and deployment', () => {
    const workflow = resolve(repositoryRoot, '.github/workflows/api-deploy.yml');

    expect(existsSync(workflow)).toBe(true);
    if (!existsSync(workflow)) return;
    const source = readFileSync(workflow, 'utf8');
    expect(source).not.toMatch(/AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY/u);
    expect(source).not.toMatch(/amazon-ecr-login|ecr get-login-password/u);
    expect(source).not.toMatch(/push:\s*true/u);
    expect(source).not.toMatch(/ecs (?:update-service|deploy)|aws ecs/u);
  });

  test('AWS-OBS-001 / AC-011 emits one allowlisted structured request record', async () => {
    const telemetryModulePath = '../../../../shared/observability/request-telemetry';
    const telemetry = (await import(telemetryModulePath)) as {
      createRequestTelemetry: (options: {
        environment: string;
        now: () => number;
        revision: string;
        service: string;
        write: (record: Record<string, unknown>) => void;
      }) => (
        request: { headers: Record<string, string>; method: string },
        response: {
          once: (event: string, listener: () => void) => void;
          setHeader: (name: string, value: string) => void;
          statusCode: number;
        },
        next: () => void,
      ) => void;
    };
    const records: Record<string, unknown>[] = [];
    const headers: Record<string, string> = {};
    let finish = (): void => undefined;
    const now = jest.fn<() => number>().mockReturnValueOnce(1_000).mockReturnValueOnce(1_012);
    const middleware = telemetry.createRequestTelemetry({
      environment: 'test',
      now,
      revision: 'abc123',
      service: 'plus-store-api',
      write: (record) => records.push(record),
    });
    const next = jest.fn<() => void>();

    middleware(
      {
        headers: {
          authorization: 'Bearer synthetic-secret',
          cookie: 'session=synthetic-secret',
          'x-correlation-id': 'corr-observability-001',
        },
        method: 'GET',
      },
      {
        once: (_event, listener) => {
          finish = listener;
        },
        setHeader: (name, value) => {
          headers[name] = value;
        },
        statusCode: 200,
      },
      next,
    );
    finish();

    expect(next).toHaveBeenCalledTimes(1);
    expect(headers['x-correlation-id']).toBe('corr-observability-001');
    expect(records).toEqual([
      {
        correlationId: 'corr-observability-001',
        durationMs: 12,
        environment: 'test',
        level: 'info',
        message: 'http_request_completed',
        method: 'GET',
        revision: 'abc123',
        service: 'plus-store-api',
        statusCode: 200,
        timestamp: '1970-01-01T00:00:01.012Z',
      },
    ]);
    expect(JSON.stringify(records)).not.toMatch(/authorization|cookie|synthetic-secret/u);
  });

  test('AWS-OBS-002 / AC-011 installs request telemetry at the HTTP entrypoint', () => {
    const source = readFileSync(resolve(apiRoot, 'src/main.ts'), 'utf8');

    expect(source).toContain('createRequestTelemetry');
    expect(source).toContain("service: 'plus-store-api'");
    expect(source).toContain("process.env['APP_REVISION']");
  });

  test('AWS-MIG-001 / AC-007 keeps migrations and DIRECT_URL out of API startup', () => {
    const source = readFileSync(resolve(apiRoot, 'src/main.ts'), 'utf8');

    expect(source).not.toMatch(/DIRECT_URL|prisma\s+migrate|migrate\s+deploy|db\s+push/u);
  });
});
