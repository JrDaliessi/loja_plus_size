import { jest } from '@jest/globals';

import {
  SupabaseCatalogIdentityAdapter,
  type SupabaseClaimsClient,
} from '../../infrastructure/auth/supabase-catalog-identity.adapter';

const verifiedClaims = {
  sub: '018f0f4d-0000-7000-8000-000000000010',
  iss: 'https://olkadbgumpiybehslobk.supabase.co/auth/v1',
  aud: 'authenticated',
  exp: 1_900_000_000,
  session_id: '018f0f4d-0000-7000-8000-000000000011',
  role: 'authenticated',
  is_anonymous: false,
  app_metadata: {
    permissions: ['catalog:read', 'catalog:write', 'unknown:permission'],
  },
  user_metadata: {
    permissions: ['catalog:publish', 'media:write'],
  },
};

describe('FEATURE-CATALOG Dia 4 Supabase identity adapter', () => {
  test('CAT-SEC-002 verifies the bearer JWT and trusts only app_metadata permissions', async () => {
    const getClaims = jest.fn<SupabaseClaimsClient['auth']['getClaims']>(async () => ({
      data: { claims: verifiedClaims },
      error: null,
    }));
    const adapter = new SupabaseCatalogIdentityAdapter(
      { auth: { getClaims } },
      verifiedClaims.iss,
    );

    await expect(adapter.authenticate('Bearer verified-token')).resolves.toEqual({
      id: verifiedClaims.sub,
      permissions: ['catalog:read', 'catalog:write'],
    });
    expect(getClaims).toHaveBeenCalledWith('verified-token');
  });

  test.each([
    undefined,
    '',
    'Basic abc',
    'Bearer',
  ])('CAT-SEC-003 rejects a missing or malformed authorization header: %p', async (header) => {
    const adapter = new SupabaseCatalogIdentityAdapter(
      {
        auth: {
          getClaims: jest.fn<SupabaseClaimsClient['auth']['getClaims']>(),
        },
      },
      verifiedClaims.iss,
    );

    await expect(adapter.authenticate(header)).rejects.toMatchObject({
      code: 'CATALOG_UNAUTHENTICATED',
    });
  });

  test('CAT-SEC-004 rejects failed, anonymous or non-authenticated claims', async () => {
    const responses = [
      { data: null, error: { message: 'invalid jwt' } },
      { data: { claims: { ...verifiedClaims, is_anonymous: true } }, error: null },
      { data: { claims: { ...verifiedClaims, role: 'anon' } }, error: null },
    ];

    for (const response of responses) {
      const adapter = new SupabaseCatalogIdentityAdapter(
        {
          auth: {
            getClaims: jest.fn<SupabaseClaimsClient['auth']['getClaims']>(async () => response),
          },
        },
        verifiedClaims.iss,
      );
      await expect(adapter.authenticate('Bearer invalid-token')).rejects.toMatchObject({
        code: 'CATALOG_UNAUTHENTICATED',
      });
    }
  });

  test('CAT-SEC-005 converts identity-provider failures into a stable authentication error', async () => {
    const adapter = new SupabaseCatalogIdentityAdapter(
      {
        auth: {
          getClaims: jest.fn<SupabaseClaimsClient['auth']['getClaims']>(async () => {
            throw new Error('network details must not escape');
          }),
        },
      },
      verifiedClaims.iss,
    );

    await expect(adapter.authenticate('Bearer unavailable-token')).rejects.toMatchObject({
      code: 'CATALOG_UNAUTHENTICATED',
    });
  });
});
