import type { ApiConfig } from '../config/api.config';

export const createPrismaPgOptions = (
  config: ApiConfig,
): Record<string, unknown> => {
  return {
    connectionString: config.databaseUrl,
    connectionTimeoutMillis: config.databasePool.connectionTimeoutMs,
    idleTimeoutMillis: config.databasePool.idleTimeoutMs,
    max: config.databasePool.max,
    maxLifetimeSeconds: config.databasePool.maxLifetimeSeconds,
  };
};
