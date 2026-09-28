import 'dotenv/config';
import 'reflect-metadata';

import { PrismaPg } from '@prisma/adapter-pg';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createClient } from '@supabase/supabase-js';

import { PrismaClient } from '../prisma/generated/client';
import { AppModule } from './app.module';
import { CatalogApplicationService } from './features/catalog/application/catalog-application.service';
import { SupabaseCatalogIdentityAdapter } from './features/catalog/infrastructure/auth/supabase-catalog-identity.adapter';
import {
  PrismaCatalogTransactionContext,
  PrismaCatalogUnitOfWork,
  type PrismaTransactionalClient,
} from './features/catalog/infrastructure/persistence/prisma-catalog-unit-of-work';
import {
  PrismaProductRepository,
  type PrismaProductClient,
} from './features/catalog/infrastructure/persistence/prisma-product.repository';
import { loadApiConfig } from './shared/config/api.config';
import { createPrismaPgOptions } from './shared/database/prisma-pg-options';
import { BoundedReadinessProbe } from './shared/health/infrastructure/bounded-readiness.probe';
import { createRequestTelemetry } from './shared/observability/request-telemetry';
import { createShutdownHandler } from './shared/runtime/api-lifecycle';
import {
  configureTrustedProxy,
  createCorsOptions,
  createPublicCatalogRateLimiter,
} from './shared/security/public-edge-policy';

const bootstrap = async (): Promise<void> => {
  const config = loadApiConfig(process.env);
  const prisma = new PrismaClient({
    adapter: new PrismaPg(createPrismaPgOptions(config)),
  });
  const persistence = prisma as unknown as PrismaProductClient & PrismaTransactionalClient;
  const transactionContext = new PrismaCatalogTransactionContext();
  const products = new PrismaProductRepository(persistence, transactionContext);
  const unitOfWork = new PrismaCatalogUnitOfWork(persistence, transactionContext);
  const catalogService = new CatalogApplicationService({ products, unitOfWork });
  const supabase = createClient(
    config.supabaseUrl,
    config.supabasePublishableKey,
    {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    },
  );
  const catalogIdentity = new SupabaseCatalogIdentityAdapter(
    supabase,
    `${new URL(config.supabaseUrl).origin}/auth/v1`,
  );
  const readinessProbe = new BoundedReadinessProbe(
    () => prisma.$queryRaw`SELECT 1`,
    1_000,
  );
  const app = await NestFactory.create(
    AppModule.register({ catalogIdentity, catalogService, readinessProbe }),
  );
  configureTrustedProxy(app, config.rateLimit.trustProxyHops);
  app.enableCors(createCorsOptions(config.allowedOrigins));
  app.use(
    createRequestTelemetry({
      environment: process.env['NODE_ENV'] ?? 'development',
      revision: process.env['APP_REVISION'] ?? 'local',
      service: 'plus-store-api',
      write: (record) => process.stdout.write(`${JSON.stringify(record)}\n`),
    }),
  );
  app.use(
    '/v1/catalog/products',
    createPublicCatalogRateLimiter(config.rateLimit),
  );
  if (config.swaggerEnabled) {
    const openApi = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Plus Store Catalog API')
        .setDescription('Versioned catalog contracts for Plus Store')
        .setVersion('1')
        .addBearerAuth()
        .build(),
    );
    SwaggerModule.setup('docs', app, openApi);
  }
  const shutdown = createShutdownHandler({
    closeApplication: () => app.close(),
    disconnectDatabase: () => prisma.$disconnect(),
  });
  process.once('SIGINT', () => void shutdown());
  process.once('SIGTERM', () => void shutdown());

  await app.listen(config.port, '0.0.0.0');
};

bootstrap().catch(() => {
  process.stderr.write('API_STARTUP_FAILED\n');
  process.exitCode = 1;
});
