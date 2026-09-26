-- Prisma keeps its migration history in public even when application models use
-- a private schema. Supabase exposes public through the Data API by default, so
-- protect the history table with deny-by-default RLS and explicit revocations.
ALTER TABLE "public"."_prisma_migrations" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."_prisma_migrations" FROM PUBLIC;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON TABLE "public"."_prisma_migrations" FROM anon;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON TABLE "public"."_prisma_migrations" FROM authenticated;
  END IF;
END
$$;
