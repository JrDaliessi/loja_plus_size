import 'reflect-metadata';

import { jest } from '@jest/globals';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import request from 'supertest';

import { CatalogController } from '../../presentation/http/catalog.controller';
import {
  CATALOG_HTTP_SERVICE,
  CATALOG_IDENTITY,
  type CatalogHttpService,
  type CatalogIdentity,
} from '../../presentation/http/catalog-http.tokens';

describe('FEATURE-CATALOG Dia 6 API experience', () => {
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
    const moduleRef = await Test.createTestingModule({
      controllers: [CatalogController],
      providers: [
        { provide: CATALOG_IDENTITY, useValue: identity },
        { provide: CATALOG_HTTP_SERVICE, useValue: service },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    SwaggerModule.setup('docs', app, createOpenApiDocument());
    await app.init();
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await app.close();
  });

  const createOpenApiDocument = () =>
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Plus Store Catalog API')
        .setDescription('Versioned catalog contracts for Plus Store')
        .setVersion('1')
        .addBearerAuth()
        .build(),
    );

  test('CAT-EXP-001 marks every admin operation as bearer-protected without securing the public list', () => {
    const document = createOpenApiDocument();
    const paths = document.paths;

    expect(paths['/v1/admin/catalog/products']?.post?.security).toEqual([
      { bearer: [] },
    ]);
    expect(
      paths['/v1/admin/catalog/products/{productId}/activate']?.post?.security,
    ).toEqual([{ bearer: [] }]);
    expect(
      paths['/v1/admin/catalog/products/{productId}/archive']?.post?.security,
    ).toEqual([{ bearer: [] }]);
    expect(paths['/v1/catalog/products']?.get?.security).toBeUndefined();
  });

  test('CAT-EXP-002 documents the public pagination inputs and their limits', () => {
    const operation = createOpenApiDocument().paths['/v1/catalog/products']?.get;

    expect(operation?.parameters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          in: 'query',
          name: 'limit',
          required: false,
          schema: expect.objectContaining({
            default: 20,
            maximum: 50,
            minimum: 1,
            type: 'integer',
          }),
        }),
        expect.objectContaining({
          in: 'query',
          name: 'cursor',
          required: false,
          schema: expect.objectContaining({ type: 'string' }),
        }),
      ]),
    );
  });

  test('CAT-EXP-003 documents success and relevant failure outcomes for every operation', () => {
    const paths = createOpenApiDocument().paths;

    expect(Object.keys(paths['/v1/admin/catalog/products']?.post?.responses ?? {})).toEqual(
      expect.arrayContaining(['201', '401', '403', '409', '422', '503']),
    );
    expect(
      Object.keys(
        paths['/v1/admin/catalog/products/{productId}/activate']?.post?.responses ?? {},
      ),
    ).toEqual(expect.arrayContaining(['200', '401', '403', '404', '409', '422', '503']));
    expect(
      Object.keys(
        paths['/v1/admin/catalog/products/{productId}/archive']?.post?.responses ?? {},
      ),
    ).toEqual(expect.arrayContaining(['200', '401', '403', '404', '422', '503']));
    expect(Object.keys(paths['/v1/catalog/products']?.get?.responses ?? {})).toEqual(
      expect.arrayContaining(['200', '422', '503']),
    );
  });

  test('CAT-EXP-004 serves navigable Swagger UI and a machine-readable OpenAPI document', async () => {
    const ui = await request(app.getHttpServer()).get('/docs/');
    const json = await request(app.getHttpServer()).get('/docs-json');

    expect(ui.status).toBe(200);
    expect(ui.headers['content-type']).toContain('text/html');
    expect(ui.text).toContain('<title>Swagger UI</title>');
    expect(json.status).toBe(200);
    expect(json.body.info).toMatchObject({
      title: 'Plus Store Catalog API',
      version: '1',
    });
    expect(json.body.paths).toHaveProperty('/v1/catalog/products');
  });
});
