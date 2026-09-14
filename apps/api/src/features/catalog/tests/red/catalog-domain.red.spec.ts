import {
  activateProduct,
  addVariant,
  archiveProduct,
  canonicalizeSku,
  catalogEntityFieldNames,
  createCatalogEvent,
  createMoney,
  createOrderedSize,
  createProductMedia,
  evaluatePublication,
  normalizeBarcode,
} from '../../domain/catalog.behavior';
import {
  accessibleMedia,
  activeVariant,
  catalogIds,
  completeDraftProduct,
  incompleteDraftProduct,
} from '../fixtures/catalog.fixtures';

describe('FEATURE-CATALOG domain RED contract', () => {
  test('CAT-DOM-001 / AC-003 keeps explicit size ordering', () => {
    expect(createOrderedSize('G3', 'G3', 30)).toEqual({
      code: 'G3',
      label: 'G3',
      position: 30,
    });
  });

  test('CAT-DOM-002 / AC-004 rejects duplicate product+color+size', () => {
    const product = completeDraftProduct();
    expect(() => addVariant(product, activeVariant())).toThrow(
      'CATALOG_VARIANT_CONFLICT',
    );
  });

  test('CAT-DOM-003 / AC-005 canonicalizes SKU to uppercase', () => {
    expect(canonicalizeSku(' pn-vestido-001-roxo-g3 ')).toBe(
      'PN-VESTIDO-001-ROXO-G3',
    );
  });

  test('CAT-DOM-004 / AC-006 rejects zero, negative and imprecise prices', () => {
    expect(() => createMoney('0.00', 'BRL')).toThrow('CATALOG_INVALID_PRICE');
    expect(() => createMoney('-1.00', 'BRL')).toThrow('CATALOG_INVALID_PRICE');
    expect(() => createMoney('10.999', 'BRL')).toThrow('CATALOG_INVALID_PRICE');
  });

  test('CAT-DOM-005 / AC-007 accepts absent barcode and normalizes a present value', () => {
    expect(normalizeBarcode()).toBeUndefined();
    expect(normalizeBarcode(' 7891234567890 ')).toBe('7891234567890');
  });

  test('CAT-STO-001 / AC-008 preserves a persistent Storage path', () => {
    const product = completeDraftProduct();
    const media = accessibleMedia();
    expect(createProductMedia(product, media)).toMatchObject({
      storagePath: `${catalogIds.product}/front/main.webp`,
      role: 'FRONT',
      position: 0,
    });
  });

  test('CAT-STO-002 / AC-009 rejects media bound to another product context', () => {
    const product = completeDraftProduct();
    const invalidMedia = {
      ...accessibleMedia(),
      productId: catalogIds.anotherProduct,
      colorId: catalogIds.anotherColor,
    };
    expect(() => createProductMedia(product, invalidMedia)).toThrow(
      'CATALOG_MEDIA_PRODUCT_MISMATCH',
    );
  });

  test('CAT-DOM-006 / AC-010 reports every publication issue', () => {
    expect(evaluatePublication(incompleteDraftProduct())).toEqual({
      canActivate: false,
      issues: expect.arrayContaining([
        'DESCRIPTION_REQUIRED',
        'ACTIVE_CATEGORY_REQUIRED',
        'ACTIVE_MEDIA_REQUIRED',
        'ACTIVE_VARIANT_REQUIRED',
      ]),
    });
  });

  test('CAT-DOM-007 / AC-011 activates a complete product', () => {
    expect(activateProduct(completeDraftProduct()).status).toBe('ACTIVE');
  });

  test('CAT-DOM-008 / AC-019 archives without recycling identity or SKU', () => {
    const product = completeDraftProduct();
    const archived = archiveProduct(product);
    expect(archived).toMatchObject({
      id: product.id,
      status: 'ARCHIVED',
    });
    expect(archived.variants[0]?.sku).toBe(product.variants[0]?.sku);
  });

  test('CAT-APP-005 / AC-018 emits a versioned UTC event envelope', () => {
    const event = createCatalogEvent(
      'ProductDraftCreated',
      catalogIds.product,
      new Date('2026-09-14T12:00:00.000Z'),
    );
    expect(event).toMatchObject({
      eventType: 'ProductDraftCreated',
      eventVersion: 1,
      aggregateId: catalogIds.product,
      occurredAt: '2026-09-14T12:00:00.000Z',
    });
    expect(event.eventId).toBeTruthy();
  });

  test('CAT-TRACE-001 / AC-020 excludes inventory quantities from catalog entities', () => {
    const forbidden = ['stock', 'quantity', 'availableQuantity', 'reservedQuantity'];
    expect(catalogEntityFieldNames()).not.toEqual(
      expect.arrayContaining(forbidden),
    );
  });
});
