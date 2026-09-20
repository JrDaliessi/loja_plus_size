import { z } from 'zod';

const environmentSchema = z.object({
  DATABASE_URL: z
    .url()
    .refine((value) => ['postgres:', 'postgresql:'].includes(new URL(value).protocol)),
  SUPABASE_URL: z
    .url()
    .refine((value) => new URL(value).protocol === 'https:'),
  SUPABASE_PUBLISHABLE_KEY: z.string().startsWith('sb_publishable_').min(20),
  SUPABASE_STORAGE_BUCKET: z
    .string()
    .regex(/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/)
    .default('product-media'),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3001),
});

export interface ApiConfig {
  databaseUrl: string;
  supabaseUrl: string;
  supabasePublishableKey: string;
  storageBucket: string;
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
    databaseUrl: parsed.data.DATABASE_URL,
    supabaseUrl: parsed.data.SUPABASE_URL,
    supabasePublishableKey: parsed.data.SUPABASE_PUBLISHABLE_KEY,
    storageBucket: parsed.data.SUPABASE_STORAGE_BUCKET,
    port: parsed.data.PORT,
  };
};
