import type {
  CatalogProduct,
  ProductMedia,
  ProductVariant,
} from '../../domain/catalog.types';
import type {
  CatalogUnitOfWork,
  ProductRepository,
} from '../../application/catalog.ports';

export const catalogIds = {
  product: '018f0f4d-0000-7000-8000-000000000001',
  anotherProduct: '018f0f4d-0000-7000-8000-000000000002',
  category: '018f0f4d-0000-7000-8000-000000000003',
  color: '018f0f4d-0000-7000-8000-000000000004',
  anotherColor: '018f0f4d-0000-7000-8000-000000000005',
  size: '018f0f4d-0000-7000-8000-000000000006',
  variant: '018f0f4d-0000-7000-8000-000000000007',
  media: '018f0f4d-0000-7000-8000-000000000008',
} as const;

export const activeVariant = (): ProductVariant => ({
  id: catalogIds.variant,
  productId: catalogIds.product,
  colorId: catalogIds.color,
  sizeId: catalogIds.size,
  sku: 'PN-VESTIDO-001-ROXO-G3',
  price: { amount: '299.90', currency: 'BRL' },
  barcode: '7891234567890',
  status: 'ACTIVE',
});

export const accessibleMedia = (): ProductMedia => ({
  id: catalogIds.media,
  productId: catalogIds.product,
  storagePath: `${catalogIds.product}/front/main.webp`,
  role: 'FRONT',
  altText: 'Vestido roxo visto de frente em modelo plus size',
  position: 0,
});

export const completeDraftProduct = (): CatalogProduct => ({
  id: catalogIds.product,
  name: 'Vestido Purple Noir',
  slug: 'vestido-purple-noir',
  description: 'Vestido midi roxo com caimento evasê.',
  categoryIds: [catalogIds.category],
  primaryCategoryId: catalogIds.category,
  status: 'DRAFT',
  variants: [activeVariant()],
  media: [accessibleMedia()],
});

export const incompleteDraftProduct = (): CatalogProduct => ({
  ...completeDraftProduct(),
  description: '',
  categoryIds: [],
  primaryCategoryId: '',
  variants: [],
  media: [],
});

export class FakeProductRepository implements ProductRepository {
  readonly calls: string[] = [];
  private readonly records = new Map<string, CatalogProduct>();

  constructor(products: CatalogProduct[] = []) {
    for (const product of products) {
      this.records.set(product.id, product);
    }
  }

  async create(product: CatalogProduct): Promise<CatalogProduct> {
    this.calls.push('create');
    this.records.set(product.id, product);
    return product;
  }

  async findById(id: string): Promise<CatalogProduct | null> {
    this.calls.push('findById');
    return this.records.get(id) ?? null;
  }

  async findBySlug(slug: string): Promise<CatalogProduct | null> {
    this.calls.push('findBySlug');
    return [...this.records.values()].find((item) => item.slug === slug) ?? null;
  }

  async save(product: CatalogProduct): Promise<CatalogProduct> {
    this.calls.push('save');
    this.records.set(product.id, product);
    return product;
  }

  async listPublic(input: {
    cursor?: string;
    limit: number;
  }): Promise<{ items: CatalogProduct[]; nextCursor?: string }> {
    this.calls.push('listPublic');
    const records = [...this.records.values()]
      .filter((item) => item.status === 'ACTIVE')
      .sort((left, right) => left.id.localeCompare(right.id));
    const cursorId = input.cursor
      ? Buffer.from(input.cursor, 'base64url').toString('utf8')
      : undefined;
    const start = cursorId
      ? Math.max(0, records.findIndex((item) => item.id === cursorId) + 1)
      : 0;
    const items = records.slice(start, start + input.limit);
    const last = items.at(-1);
    const nextCursor =
      start + items.length < records.length && last
        ? Buffer.from(last.id, 'utf8').toString('base64url')
        : undefined;
    return nextCursor ? { items, nextCursor } : { items };
  }
}

export class FakeCatalogUnitOfWork implements CatalogUnitOfWork {
  runs = 0;

  async run<T>(operation: () => Promise<T>): Promise<T> {
    this.runs += 1;
    return operation();
  }
}
