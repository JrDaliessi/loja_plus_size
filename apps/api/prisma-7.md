# Prisma 7 — Spike do Dia 2

> **SPIKE APENAS:** os modelos em `spikes/prisma7/schema.prisma` validam a
> toolchain estável contra um PostgreSQL local descartável. Eles não pertencem
> ao domínio da Plus Store e não são migrations de produção.

## Versões fixadas

- `prisma`: `7.10.0`
- `@prisma/client`: `7.10.0`
- `@prisma/adapter-pg`: `7.10.0`
- `pg`: `8.23.0`

## Conexões

- `DATABASE_URL`: conexão pooled usada pelo runtime;
- `DIRECT_URL`: conexão direta usada exclusivamente pelo Prisma CLI.

No spike local, ambas apontam para
`postgresql://postgres@127.0.0.1:55432/plus_store_day2_prisma7_spike`.
Na ausência das variáveis, somente essa URL local segura é usada como fallback;
o script rejeita qualquer host ou database fora desse alvo.

## Comandos

```text
pnpm db:test:start
pnpm --filter @plus-store/api prisma migrate deploy
pnpm spike:prisma7
pnpm type-check:prisma7-spike
pnpm db:test:stop
```

Os comandos de spike e type-check geram o Client automaticamente. O diretório
`generated/` é derivável e não é versionado.

O schema e a migration deste diretório são evidência do spike. O schema real do
Catálogo será criado somente na implementação autorizada do Dia 3.
