import 'reflect-metadata';

import { jest } from '@jest/globals';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { CatalogError } from '../../domain/catalog.error';
import { CatalogController } from '../../presentation/http/catalog.controller';
import {
  CATALOG_HTTP_SERVICE,
  CATALOG_IDENTITY,
  type CatalogHttpService,
  type CatalogIdentity,
} from '../../presentation/http/catalog-http.tokens';
import { completeDraftProduct } from '../fixtures/catalog.fixtures';

describe('FEATURE-CATALOG Dia 5 HTTP hardening', () => {
  let app: INestApplication;
  const identity = {
    authenticate: jest.fn<CatalogIdentity['authenticate']>(),
  };
  const service = {
    createDraft: jest.fn<CatalogHttpService['createDraft']>(),
    activate: jest.fn<CatalogHttpService['activate']>(),
    archive: jest.fn<CatalogHttpService['archive']>(),
    listPublic: jest.fn<CatalogHttpService['listPublic']>(),
  };

  beforeEach(async () => {
    identity.authenticate.mockResolvedValue({
      id: 'staff-001',
      permissions: ['catalog:publish'],
    });
    service.activate.mockResolvedValue(completeDraftProduct());

    const moduleRef = await Test.createTestingModule({
      controllers: [CatalogController],
      providers: [
        { provide: CATALOG_IDENTITY, useValue: identity },
        { provide: CATALOG_HTTP_SERVICE, useValue: service },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await app.close();
  });

  test('CAT-API-014 rejects malformed route identifiers before application access', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/admin/catalog/products/not-a-uuid/activate')
      .set('authorization', 'Bearer verified-token');

    expect(response.status).toBe(422);
    expect(response.body.error.code).toBe('CATALOG_VALIDATION_FAILED');
    expect(service.activate).not.toHaveBeenCalled();
  });

  test('CAT-API-015 replaces untrusted correlation identifiers with a bounded UUID', async () => {
    service.activate.mockRejectedValue(
      new CatalogError('CATALOG_PRODUCT_NOT_FOUND', 'sensitive persistence detail'),
    );
    const unsafeCorrelationId = `prefix-${'a'.repeat(200)}`;

    const response = await request(app.getHttpServer())
      .post('/v1/admin/catalog/products/018f0f4d-0000-7000-8000-000000000001/activate')
      .set('authorization', 'Bearer verified-token')
      .set('x-correlation-id', unsafeCorrelationId);

    expect(response.status).toBe(404);
    expect(response.headers['x-correlation-id']).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
    expect(response.body.error.correlationId).toBe(
      response.headers['x-correlation-id'],
    );
    expect(JSON.stringify(response.body)).not.toContain(unsafeCorrelationId);
  });
});
