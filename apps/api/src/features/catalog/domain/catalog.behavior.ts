import { CatalogNotImplementedError } from './catalog.error';
import type {
  CatalogEvent,
  CatalogProduct,
  Money,
  ProductMedia,
  ProductVariant,
  PublicationResult,
} from './catalog.types';

const missing = (capability: string): never => {
  throw new CatalogNotImplementedError(capability);
};

export const canonicalizeSku = (_value: string): string =>
  missing('canonicalizeSku');

export const createMoney = (_amount: string, _currency: 'BRL'): Money =>
  missing('createMoney');

export const normalizeBarcode = (_value?: string): string | undefined =>
  missing('normalizeBarcode');

export const createOrderedSize = (
  _code: string,
  _label: string,
  _position: number,
): { code: string; label: string; position: number } =>
  missing('createOrderedSize');

export const addVariant = (
  _product: CatalogProduct,
  _variant: ProductVariant,
): CatalogProduct => missing('addVariant');

export const createProductMedia = (
  _product: CatalogProduct,
  _media: ProductMedia,
): ProductMedia => missing('createProductMedia');

export const evaluatePublication = (
  _product: CatalogProduct,
): PublicationResult => missing('evaluatePublication');

export const activateProduct = (_product: CatalogProduct): CatalogProduct =>
  missing('activateProduct');

export const archiveProduct = (_product: CatalogProduct): CatalogProduct =>
  missing('archiveProduct');

export const createCatalogEvent = (
  _eventType: string,
  _aggregateId: string,
  _now: Date,
): CatalogEvent => missing('createCatalogEvent');

export const catalogEntityFieldNames = (): readonly string[] =>
  missing('catalogEntityFieldNames');
