import { CatalogNotImplementedError } from '../../domain/catalog.error';

export interface PersistenceFailure {
  constraint?: string;
  message: string;
}

export const mapCatalogPersistenceError = (_error: PersistenceFailure): never => {
  throw new CatalogNotImplementedError('mapCatalogPersistenceError');
};
