import { CatalogNotImplementedError } from '../../domain/catalog.error';

export interface PersistenceFailure {
  code?: string;
  constraint?: string;
  message: string;
  meta?: {
    modelName?: string;
    target?: string | string[];
  };
}

export const mapCatalogPersistenceError = (_error: PersistenceFailure): never => {
  throw new CatalogNotImplementedError('mapCatalogPersistenceError');
};
