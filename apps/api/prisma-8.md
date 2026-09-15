# Prisma 8 — Spike do Dia 2

> **SPIKE APENAS:** os modelos `User` e `Post` abaixo existem somente para
> validar a RC do Prisma 8 em um PostgreSQL local descartável. Eles não fazem
> parte do domínio da Plus Store, não são migrations de produção e serão
> substituídos pelo contrato de catálogo aprovado somente no Dia 3.

Prisma ORM lets you query your database in simple, easy-to-read TypeScript. Define what your data looks like, and Prisma ORM gives you a fully typed client — with autocomplete for every table, column, and relation.

This project is set up for PostgreSQL. Prisma ORM also supports other databases.

## Requirements

- **PostgreSQL 15 or newer.** Older servers are not supported. Run `SELECT version()` against your server to verify.
- The CLI never connects to your database without explicit consent. Pass `--probe-db` to `pnpm prisma orm init` if you want `init` to verify the server version itself.

## Your data contract

Your data contract is the heart of your application. It lives at [`spikes/prisma8/contract.prisma`](spikes/prisma8/contract.prisma) and describes your models:

```prisma
model User {
  id       Int     @id @default(autoincrement())
  email    String  @unique
  username String?
  name     String?
}
```

Every model you define in your contract can be queried from your app. Your editor will autocomplete the query methods and show you what type each model field is:

```typescript
import { db } from './spikes/prisma8/db';

const user = await db.orm.public.User
  .where({ email: 'alice@example.com' })
  .first();

// Your editor will show the type of user as
// { id: number; email: string; username: string | null; name: string | null; createdAt: Date; posts: Post[] } | null
```

Your contract has two companion files in the same directory:

- **`contract.json`** — this tells your application what models exist, just like `package-lock.json` tells your package manager what dependencies your project has
- **`contract.d.ts`** — this powers autocomplete and type checking in your editor

Commit both files to git. When you change your contract, run `pnpm prisma contract emit` to update them.

If you use a framework like Next.js or Vite, the Prisma ORM plugin will do this for you automatically.

## Configuration

[`prisma.config.ts`](prisma.config.ts) tells the CLI where your contract lives and how to connect to your database. It loads environment variables from `.env` automatically:

```typescript
import 'dotenv/config';
import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';
import { definePrismaConfig } from 'prisma/config';

export default definePrismaConfig({
  orm: ormConfig({
    contract: './spikes/prisma8/contract.prisma',
    db: {
      connection: process.env['DATABASE_URL']!,
    },
  }),
});
```

Notice the `DATABASE_URL` above? It's defined in your [`.env`](./.env) file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

You can customize how your environment variables are loaded by changing or removing the `import 'dotenv/config'` line.

## Quick reference

### Commands

```bash
pnpm prisma contract emit       # Update contract.json and contract.d.ts
pnpm prisma db init             # Create tables in the database
pnpm prisma migration status    # Show migration status
```

### Files

| File | Purpose |
|---|---|
| [`spikes/prisma8/contract.prisma`](spikes/prisma8/contract.prisma) | Your data contract — define your models here |
| [`prisma.config.ts`](prisma.config.ts) | CLI configuration |
| [`spikes/prisma8/db.ts`](spikes/prisma8/db.ts) | Database client — `import { db } from './spikes/prisma8/db'` |
| `spikes/prisma8/contract.json` | Compiled contract (generated) |
| `spikes/prisma8/contract.d.ts` | Contract types (generated) |

### Workflow

1. Edit [`spikes/prisma8/contract.prisma`](spikes/prisma8/contract.prisma) to add or change models.
2. Run `pnpm prisma contract emit` to regenerate the contract.
3. Query your models — your IDE will autocomplete everything.

## Monorepo notes (pnpm workspaces)

If this project lives inside a pnpm workspace, a few things are worth knowing:

- **Catalogs.** When the workspace's `pnpm-workspace.yaml` defines a `catalogs` entry for `prisma` or `@prisma/orm-postgres`, pnpm uses the catalog version everywhere — `init` does too. If you wanted the published `latest` instead, update or remove the catalog entry, then re-run `pnpm install`.
- **`pnpm dlx`.** `pnpm dlx prisma@latest orm init …` works in any directory. Inside a workspace, pnpm still resolves dependencies through the workspace's catalog/overrides rather than the registry; expect the installed Prisma ORM packages to reflect the workspace's catalog rather than `latest`.
- **`pnpm` → `npm` fallback.** If `pnpm` ever fails to install Prisma ORM with a `workspace:*` or `catalog:` resolution error (a leak in a published artefact), `init` falls back to `npm install` and surfaces a warning. Once the offending package republishes a clean version you can switch back with `pnpm install`.
