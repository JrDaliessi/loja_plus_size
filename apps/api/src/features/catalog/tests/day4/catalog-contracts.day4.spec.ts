import { z } from 'zod';

import {
  catalogPageQuerySchema,
  createProductDraftRequestSchema,
  createProductDraftRequestJsonSchema,
} from '../../presentation/catalog.schemas';

describe('FEATURE-CATALOG Dia 4 transport contracts', () => {
  test('CAT-API-003 accepts and normalizes the approved create-draft payload', () => {
    expect(
      createProductDraftRequestSchema.parse({
        name: '  Vestido Purple Noir  ',
        slug: 'vestido-purple-noir',
        description: '  Vestido midi roxo.  ',
        categoryIds: ['018f0f4d-0000-7000-8000-000000000003'],
        primaryCategoryId: '018f0f4d-0000-7000-8000-000000000003',
      }),
    ).toEqual({
      name: 'Vestido Purple Noir',
      slug: 'vestido-purple-noir',
      description: 'Vestido midi roxo.',
      categoryIds: ['018f0f4d-0000-7000-8000-000000000003'],
      primaryCategoryId: '018f0f4d-0000-7000-8000-000000000003',
    });
  });

  test('CAT-API-004 rejects unknown fields and inconsistent primary category', () => {
    const payload = {
      name: 'Vestido Purple Noir',
      slug: 'vestido-purple-noir',
      description: 'Vestido midi roxo.',
      categoryIds: ['018f0f4d-0000-7000-8000-000000000003'],
      primaryCategoryId: '018f0f4d-0000-7000-8000-000000000099',
      status: 'ACTIVE',
    };

    expect(createProductDraftRequestSchema.safeParse(payload).success).toBe(false);
  });

  test('CAT-API-005 coerces bounded pagination and rejects invalid limits', () => {
    expect(catalogPageQuerySchema.parse({ limit: '20' })).toEqual({ limit: 20 });
    expect(catalogPageQuerySchema.safeParse({ limit: '0' }).success).toBe(false);
    expect(catalogPageQuerySchema.safeParse({ limit: '101' }).success).toBe(false);
  });

  test('CAT-TRACE-002 publishes OpenAPI JSON Schema from the same Zod contract', () => {
    expect(createProductDraftRequestJsonSchema).toEqual(
      z.toJSONSchema(createProductDraftRequestSchema, { target: 'draft-2020-12' }),
    );
    expect(createProductDraftRequestJsonSchema).toMatchObject({
      additionalProperties: false,
      required: ['name', 'slug', 'description', 'categoryIds', 'primaryCategoryId'],
    });
  });
});
