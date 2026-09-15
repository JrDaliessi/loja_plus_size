import { toPublicProduct } from '../../presentation/public-product.projection';
import { completeDraftProduct } from '../fixtures/catalog.fixtures';

describe('FEATURE-CATALOG presentation RED contract', () => {
  test('CAT-API-001 / AC-012 exposes only an active public projection', () => {
    const active = { ...completeDraftProduct(), status: 'ACTIVE' as const };
    const result = toPublicProduct(active);
    expect(result).toMatchObject({
      id: active.id,
      slug: active.slug,
      name: active.name,
    });
    expect(result).not.toHaveProperty('primaryCategoryId');
  });

  test('CAT-API-002 / AC-013 does not invent stock availability', () => {
    const active = { ...completeDraftProduct(), status: 'ACTIVE' as const };
    const result = toPublicProduct(active);
    expect(result).not.toHaveProperty('available');
    expect(result.variants[0]).not.toHaveProperty('availableQuantity');
  });
});
