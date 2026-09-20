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

const bootstrap = async (): Promise<void> => {
  const config = loadApiConfig(process.env);
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: config.databaseUrl }),
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
  const catalogIdentity = new SupabaseCatalogIdentityAdapter(supabase);
  const app = await NestFactory.create(
    AppModule.register({ catalogIdentity, catalogService }),
  );
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
  app.enableShutdownHooks();

  const shutdown = async (): Promise<void> => {
    await app.close();
    await prisma.$disconnect();
  };
  process.once('SIGINT', () => void shutdown());
  process.once('SIGTERM', () => void shutdown());

  await app.listen(config.port);
};

bootstrap().catch(() => {
  process.stderr.write('API_STARTUP_FAILED\n');
  process.exitCode = 1;
});
