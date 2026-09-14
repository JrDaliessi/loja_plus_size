export class CatalogNotImplementedError extends Error {
  constructor(capability: string) {
    super(`Catalog behavior not implemented: ${capability}`);
    this.name = 'CatalogNotImplementedError';
  }
}

export class CatalogError extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'CatalogError';
  }
}
