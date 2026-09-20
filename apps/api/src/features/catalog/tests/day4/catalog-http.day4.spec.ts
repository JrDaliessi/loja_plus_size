import 'reflect-metadata';

import { jest } from '@jest/globals';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

describe('FEATURE-CATALOG Dia 4 NestJS HTTP adapter', () => {
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
      permissions: ['catalog:read', 'catalog:write', 'catalog:publish'],
    });
    service.createDraft.mockResolvedValue(completeDraftProduct());
    service.listPublic.mockResolvedValue({ items: [] });

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

  test('CAT-API-006 returns 401 with a stable envelope when bearer identity is absent', async () => {
    identity.authenticate.mockRejectedValue(
      new CatalogError('CATALOG_UNAUTHENTICATED', 'CATALOG_UNAUTHENTICATED: bearer token required'),
    );

    const response = await request(app.getHttpServer())
      .post('/v1/admin/catalog/products')
      .set('x-correlation-id', 'corr-auth-001')
      .send({});

    expect(response.status).toBe(401);
    expect(response.headers['x-correlation-id']).toBe('corr-auth-001');
    expect(response.body).toEqual({
      error: {
        code: 'CATALOG_UNAUTHENTICATED',
        message: 'Authentication required',
        correlationId: 'corr-auth-001',
      },
    });
  });

  test('CAT-API-007 returns 422 for a request outside the Zod contract', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/admin/catalog/products')
      .set('authorization', 'Bearer verified-token')
      .set('x-correlation-id', 'corr-validation-001')
      .send({ name: '' });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: {
        code: 'CATALOG_VALIDATION_FAILED',
        message: 'Request validation failed',
        correlationId: 'corr-validation-001',
      },
    });
    expect(service.createDraft).not.toHaveBeenCalled();
  });

  test('CAT-API-008 maps a domain conflict to 409 without leaking internals', async () => {
    service.createDraft.mockRejectedValue(
      new CatalogError('CATALOG_SLUG_CONFLICT', 'database constraint products_slug_key'),
    );

    const response = await request(app.getHttpServer())
      .post('/v1/admin/catalog/products')
      .set('authorization', 'Bearer verified-token')
      .send({
        name: 'Vestido Purple Noir',
        slug: 'vestido-purple-noir',
        description: 'Vestido midi roxo.',
        categoryIds: ['018f0f4d-0000-7000-8000-000000000003'],
        primaryCategoryId: '018f0f4d-0000-7000-8000-000000000003',
      });

    expect(response.status).toBe(409);
    expect(response.body.error).toMatchObject({
      code: 'CATALOG_SLUG_CONFLICT',
      message: 'Catalog resource conflict',
    });
    expect(JSON.stringify(response.body)).not.toContain('products_slug_key');
  });

  test('CAT-API-009 creates a draft with 201 and the verified actor', async () => {
    const payload = {
      name: 'Vestido Purple Noir',
      slug: 'vestido-purple-noir',
      description: 'Vestido midi roxo.',
      categoryIds: ['018f0f4d-0000-7000-8000-000000000003'],
      primaryCategoryId: '018f0f4d-0000-7000-8000-000000000003',
    };

    const response = await request(app.getHttpServer())
      .post('/v1/admin/catalog/products')
      .set('authorization', 'Bearer verified-token')
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('DRAFT');
    expect(identity.authenticate).toHaveBeenCalledWith('Bearer verified-token');
    expect(service.createDraft).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'staff-001' }),
      payload,
    );
  });

  test('CAT-API-010 maps authorization denial to 403', async () => {
    service.createDraft.mockRejectedValue(
      new CatalogError('CATALOG_FORBIDDEN', 'CATALOG_FORBIDDEN: denied'),
    );

    const response = await request(app.getHttpServer())
      .post('/v1/admin/catalog/products')
      .set('authorization', 'Bearer verified-token')
      .send({
        name: 'Vestido Purple Noir',
        slug: 'vestido-purple-noir',
        description: 'Vestido midi roxo.',
        categoryIds: ['018f0f4d-0000-7000-8000-000000000003'],
        primaryCategoryId: '018f0f4d-0000-7000-8000-000000000003',
      });

    expect(response.status).toBe(403);
    expect(response.body.error).toMatchObject({
      code: 'CATALOG_FORBIDDEN',
      message: 'Insufficient permission',
    });
  });

  test('CAT-API-011 maps a missing activation target to 404', async () => {
    service.activate.mockRejectedValue(
      new CatalogError('CATALOG_PRODUCT_NOT_FOUND', 'CATALOG_PRODUCT_NOT_FOUND: missing'),
    );

    const response = await request(app.getHttpServer())
      .post('/v1/admin/catalog/products/018f0f4d-0000-7000-8000-000000000001/activate')
      .set('authorization', 'Bearer verified-token');

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('CATALOG_PRODUCT_NOT_FOUND');
  });

  test('CAT-API-012 activates and archives through 200 update responses', async () => {
    const product = completeDraftProduct();
    service.activate.mockResolvedValue({ ...product, status: 'ACTIVE' });
    service.archive.mockResolvedValue({ ...product, status: 'ARCHIVED' });

    const activated = await request(app.getHttpServer())
      .post(`/v1/admin/catalog/products/${product.id}/activate`)
      .set('authorization', 'Bearer verified-token');
    const archived = await request(app.getHttpServer())
      .post(`/v1/admin/catalog/products/${product.id}/archive`)
      .set('authorization', 'Bearer verified-token');

    expect(activated.status).toBe(200);
    expect(activated.body.status).toBe('ACTIVE');
    expect(archived.status).toBe(200);
    expect(archived.body.status).toBe('ARCHIVED');
  });

  test('CAT-API-013 validates and serves the public page query', async () => {
    const invalid = await request(app.getHttpServer()).get('/v1/catalog/products?limit=0');
    const valid = await request(app.getHttpServer()).get('/v1/catalog/products?limit=20');

    expect(invalid.status).toBe(422);
    expect(valid.status).toBe(200);
    expect(valid.body).toEqual({ items: [] });
    expect(service.listPublic).toHaveBeenCalledWith({ limit: 20 });
  });

  test('CAT-TRACE-003 exposes the request schema in generated OpenAPI', () => {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder().setTitle('Plus Store Catalog API').setVersion('1').build(),
    );
    const schema = document.paths['/v1/admin/catalog/products']?.post?.requestBody;

    expect(schema).toMatchObject({
      content: {
        'application/json': {
          schema: {
            additionalProperties: false,
            required: ['name', 'slug', 'description', 'categoryIds', 'primaryCategoryId'],
          },
        },
      },
    });
  });
});
