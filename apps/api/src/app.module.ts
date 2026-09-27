import { type DynamicModule, Module } from '@nestjs/common';

import { CatalogController } from './features/catalog/presentation/http/catalog.controller';
import {
  CATALOG_HTTP_SERVICE,
  CATALOG_IDENTITY,
  type CatalogHttpService,
  type CatalogIdentity,
} from './features/catalog/presentation/http/catalog-http.tokens';
import {
  READINESS_PROBE,
  type ReadinessProbe,
} from './shared/health/application/readiness-probe';
import { HealthController } from './shared/health/presentation/http/health.controller';

export interface ApiRuntime {
  catalogIdentity: CatalogIdentity;
  catalogService: CatalogHttpService;
  readinessProbe: ReadinessProbe;
}

@Module({})
export class AppModule {
  static register(runtime: ApiRuntime): DynamicModule {
    return {
      module: AppModule,
      controllers: [CatalogController, HealthController],
      providers: [
        { provide: CATALOG_IDENTITY, useValue: runtime.catalogIdentity },
        { provide: CATALOG_HTTP_SERVICE, useValue: runtime.catalogService },
        { provide: READINESS_PROBE, useValue: runtime.readinessProbe },
      ],
    };
  }
}
