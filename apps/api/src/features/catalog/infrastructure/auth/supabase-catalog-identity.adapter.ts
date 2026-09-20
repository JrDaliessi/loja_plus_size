import { z } from 'zod';

import type {
  CatalogActor,
  CatalogPermission,
} from '../../application/catalog.ports';
import { CatalogError } from '../../domain/catalog.error';

const allowedPermissions = [
  'catalog:read',
  'catalog:write',
  'catalog:publish',
  'media:write',
] as const satisfies readonly CatalogPermission[];

const claimsSchema = z
  .object({
    sub: z.uuid(),
    role: z.literal('authenticated'),
    is_anonymous: z.literal(false),
    app_metadata: z
      .object({
        permissions: z.array(z.string()).default([]),
      })
      .passthrough()
      .default({ permissions: [] }),
  })
  .passthrough();

interface SupabaseClaimsResult {
  data: { claims?: unknown } | null;
  error: { message: string } | null;
}

export interface SupabaseClaimsClient {
  auth: {
    getClaims(jwt: string): Promise<SupabaseClaimsResult>;
  };
}

const unauthenticated = (): CatalogError =>
  new CatalogError(
    'CATALOG_UNAUTHENTICATED',
    'CATALOG_UNAUTHENTICATED: verified bearer token required',
  );

export class SupabaseCatalogIdentityAdapter {
  constructor(private readonly client: SupabaseClaimsClient) {}

  async authenticate(authorization?: string): Promise<CatalogActor> {
    const match = /^Bearer\s+(\S+)$/i.exec(authorization ?? '');
    const jwt = match?.[1];
    if (!jwt) {
      throw unauthenticated();
    }

    let result: SupabaseClaimsResult;
    try {
      result = await this.client.auth.getClaims(jwt);
    } catch {
      throw unauthenticated();
    }

    if (result.error) {
      throw unauthenticated();
    }
    const parsed = claimsSchema.safeParse(result.data?.claims);
    if (!parsed.success) {
      throw unauthenticated();
    }

    const approved = new Set<CatalogPermission>(allowedPermissions);
    const permissions = parsed.data.app_metadata.permissions.filter(
      (permission): permission is CatalogPermission =>
        approved.has(permission as CatalogPermission),
    );

    return {
      id: parsed.data.sub,
      permissions: [...new Set(permissions)],
    };
  }
}
