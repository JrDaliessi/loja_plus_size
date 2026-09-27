import { z } from 'zod';

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z
    .url()
    .refine((value) => ['postgres:', 'postgresql:'].includes(new URL(value).protocol)),
  DATABASE_POOL_MAX: z.coerce.number().int().min(1).max(20).default(5),
  DATABASE_POOL_CONNECTION_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .min(100)
    .max(30_000)
    .default(3_000),
  DATABASE_POOL_IDLE_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .min(1_000)
    .max(300_000)
    .default(10_000),
  DATABASE_POOL_MAX_LIFETIME_SECONDS: z.coerce
    .number()
    .int()
    .min(30)
    .max(3_600)
    .default(300),
  SUPABASE_URL: z
    .url()
    .refine((value) => new URL(value).protocol === 'https:'),
  SUPABASE_PUBLISHABLE_KEY: z.string().startsWith('sb_publishable_').min(20),
  SUPABASE_STORAGE_BUCKET: z
    .string()
    .regex(/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/)
    .default('product-media'),
  API_ALLOWED_ORIGINS: z.string().min(1).default('http://localhost:3000'),
  API_RATE_LIMIT_WINDOW_MS: z.coerce
    .number()
    .int()
    .min(1_000)
    .max(3_600_000)
    .default(60_000),
  API_RATE_LIMIT_MAX: z.coerce.number().int().min(1).max(10_000).default(60),
  API_TRUST_PROXY_HOPS: z.coerce.number().int().min(1).max(3).default(1),
  API_SWAGGER_ENABLED: z.enum(['true', 'false']).default('false'),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3001),
}).superRefine((environment, context) => {
  const origins = parseOrigins(environment.API_ALLOWED_ORIGINS);
  const originsAreValid = origins.length > 0 && origins.every(isSerializedHttpOrigin);
  const productionOriginsAreSecure =
    environment.NODE_ENV !== 'production' ||
    (originsAreValid &&
      origins.every((origin) => new URL(origin).protocol === 'https:'));

  if (!originsAreValid || !productionOriginsAreSecure) {
    context.addIssue({
      code: 'custom',
      path: ['API_ALLOWED_ORIGINS'],
      message: 'Origins must be explicit serialized browser origins',
    });
  }

  if (
    environment.NODE_ENV === 'production' &&
    environment.API_SWAGGER_ENABLED === 'true'
  ) {
    context.addIssue({
      code: 'custom',
      path: ['API_SWAGGER_ENABLED'],
      message: 'Swagger cannot be public in production',
    });
  }
});

const parseOrigins = (value: string): string[] =>
  [...new Set(value.split(',').map((origin) => origin.trim()).filter(Boolean))];

const isSerializedHttpOrigin = (value: string): boolean => {
  if (value === '*') return false;
  try {
    const url = new URL(value);
    return (
      ['http:', 'https:'].includes(url.protocol) &&
      url.origin === value &&
      url.username === '' &&
      url.password === ''
    );
  } catch {
    return false;
  }
};

export interface ApiConfig {
  nodeEnvironment: 'development' | 'test' | 'production';
  databaseUrl: string;
  databasePool: {
    max: number;
    connectionTimeoutMs: number;
    idleTimeoutMs: number;
    maxLifetimeSeconds: number;
  };
  supabaseUrl: string;
  supabasePublishableKey: string;
  storageBucket: string;
  allowedOrigins: string[];
  rateLimit: {
    windowMs: number;
    limit: number;
    trustProxyHops: number;
  };
  swaggerEnabled: boolean;
  port: number;
}

export const loadApiConfig = (
  environment: Record<string, string | undefined>,
): ApiConfig => {
  const parsed = environmentSchema.safeParse(environment);
  if (!parsed.success) {
    throw new Error('API_CONFIGURATION_INVALID');
  }
  return {
    nodeEnvironment: parsed.data.NODE_ENV,
    databaseUrl: parsed.data.DATABASE_URL,
    databasePool: {
      max: parsed.data.DATABASE_POOL_MAX,
      connectionTimeoutMs: parsed.data.DATABASE_POOL_CONNECTION_TIMEOUT_MS,
      idleTimeoutMs: parsed.data.DATABASE_POOL_IDLE_TIMEOUT_MS,
      maxLifetimeSeconds: parsed.data.DATABASE_POOL_MAX_LIFETIME_SECONDS,
    },
    supabaseUrl: parsed.data.SUPABASE_URL,
    supabasePublishableKey: parsed.data.SUPABASE_PUBLISHABLE_KEY,
    storageBucket: parsed.data.SUPABASE_STORAGE_BUCKET,
    allowedOrigins: parseOrigins(parsed.data.API_ALLOWED_ORIGINS),
    rateLimit: {
      windowMs: parsed.data.API_RATE_LIMIT_WINDOW_MS,
      limit: parsed.data.API_RATE_LIMIT_MAX,
      trustProxyHops: parsed.data.API_TRUST_PROXY_HOPS,
    },
    swaggerEnabled: parsed.data.API_SWAGGER_ENABLED === 'true',
    port: parsed.data.PORT,
  };
};
