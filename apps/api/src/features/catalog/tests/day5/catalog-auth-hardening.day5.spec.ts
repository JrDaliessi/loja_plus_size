import { jest } from '@jest/globals';

import {
  SupabaseCatalogIdentityAdapter,
  type SupabaseClaimsClient,
} from '../../infrastructure/auth/supabase-catalog-identity.adapter';

const validClaims = {
  sub: '018f0f4d-0000-7000-8000-000000000010',
  iss: 'https://olkadbgumpiybehslobk.supabase.co/auth/v1',
  aud: 'authenticated',
  exp: 1_900_000_000,
  session_id: '018f0f4d-0000-7000-8000-000000000011',
  role: 'authenticated',
  is_anonymous: false,
  app_metadata: { permissions: ['catalog:read'] },
};

describe('FEATURE-CATALOG Dia 5 identity hardening', () => {
  test('CAT-SEC-006 rejects verified claims issued by another Supabase project', async () => {
    const getClaims = jest.fn<SupabaseClaimsClient['auth']['getClaims']>(async () => ({
      data: {
        claims: {
          ...validClaims,
          iss: 'https://another-project.supabase.co/auth/v1',
        },
      },
      error: null,
    }));
    const adapter = new SupabaseCatalogIdentityAdapter(
      { auth: { getClaims } },
      validClaims.iss,
    );

    await expect(adapter.authenticate('Bearer verified-token')).rejects.toMatchObject({
      code: 'CATALOG_UNAUTHENTICATED',
    });
  });

  test('CAT-SEC-007 rejects oversized bearer tokens before provider access', async () => {
    const getClaims = jest.fn<SupabaseClaimsClient['auth']['getClaims']>();
    const adapter = new SupabaseCatalogIdentityAdapter(
      { auth: { getClaims } },
      validClaims.iss,
    );

    await expect(adapter.authenticate(`Bearer ${'a'.repeat(8_193)}`)).rejects.toMatchObject({
      code: 'CATALOG_UNAUTHENTICATED',
    });
    expect(getClaims).not.toHaveBeenCalled();
  });

  test('CAT-SEC-008 requires authenticated audience and session claims', async () => {
    const responses = [
      { ...validClaims, aud: 'anon' },
      { ...validClaims, session_id: undefined },
    ];

    for (const claims of responses) {
      const adapter = new SupabaseCatalogIdentityAdapter(
        {
          auth: {
            getClaims: jest.fn<SupabaseClaimsClient['auth']['getClaims']>(async () => ({
              data: { claims },
              error: null,
            })),
          },
        },
        validClaims.iss,
      );

      await expect(adapter.authenticate('Bearer verified-token')).rejects.toMatchObject({
        code: 'CATALOG_UNAUTHENTICATED',
      });
    }
  });
});
