import { loadApiConfig } from '../../../../shared/config/api.config';

const validEnvironment = {
  DATABASE_URL: 'postgresql://catalog_app:secret@pooler.example.com:6543/postgres?pgbouncer=true',
  SUPABASE_URL: 'https://olkadbgumpiybehslobk.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_example',
  SUPABASE_STORAGE_BUCKET: 'product-media',
  PORT: '3001',
};

describe('Plus Store API runtime configuration', () => {
  test('CAT-CFG-001 accepts only the runtime values needed by the composition root', () => {
    expect(loadApiConfig(validEnvironment)).toEqual({
      nodeEnvironment: 'development',
      databaseUrl: validEnvironment.DATABASE_URL,
      databasePool: {
        max: 5,
        connectionTimeoutMs: 3000,
        idleTimeoutMs: 10000,
        maxLifetimeSeconds: 300,
      },
      supabaseUrl: validEnvironment.SUPABASE_URL,
      supabasePublishableKey: validEnvironment.SUPABASE_PUBLISHABLE_KEY,
      storageBucket: validEnvironment.SUPABASE_STORAGE_BUCKET,
      allowedOrigins: ['http://localhost:3000'],
      rateLimit: {
        windowMs: 60000,
        limit: 60,
        trustProxyHops: 1,
      },
      swaggerEnabled: false,
      port: 3001,
    });
  });

  test.each([
    [{ ...validEnvironment, DATABASE_URL: 'https://example.com/database' }],
    [{ ...validEnvironment, SUPABASE_URL: 'http://olkadbgumpiybehslobk.supabase.co' }],
    [{ ...validEnvironment, SUPABASE_PUBLISHABLE_KEY: 'service-role-secret' }],
    [{ ...validEnvironment, SUPABASE_STORAGE_BUCKET: '../escape' }],
  ])('CAT-CFG-002 rejects unsafe or malformed runtime configuration', (environment) => {
    expect(() => loadApiConfig(environment)).toThrow('API_CONFIGURATION_INVALID');
  });
});
