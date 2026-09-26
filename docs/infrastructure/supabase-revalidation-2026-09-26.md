---
id: SUPABASE-REVALIDATION-2026-09-26
project_ref: olkadbgumpiybehslobk
mode: read_only
status: ready_for_promotion_decision
derived_from:
  - docs/infrastructure/supabase-revalidation-2026-09-25.md
  - apps/api/prisma/migrations/
affects: [FEATURE-CATALOG, SR-MVP-01, SEC-BASE-001]
---

# Supabase Revalidation — 2026-09-26

## Escopo

Revalidação somente leitura após a reativação feita pelo proprietário. Nenhuma
migration, consulta de dados de negócio, alteração de Auth, grant, policy,
função, bucket, objeto ou Edge Function foi executada.

## Evidências

| Verificação | Resultado |
|---|---|
| Project ref direto | acessível |
| Nome | `Loja_plus_size` |
| Região | `sa-east-1` |
| PostgreSQL | 17 (`17.6.1.166`) |
| Status de gestão | `ACTIVE_HEALTHY` |
| API URL | `https://olkadbgumpiybehslobk.supabase.co` |
| Migrations remotas de aplicação | nenhuma |
| Tabelas em `public`/`app` | nenhuma |
| Views em `public`/`app` | nenhuma |
| Grants `PUBLIC`/`anon`/`authenticated` em `public`/`app` | nenhum |
| Policies em `public`/`app`/`storage` | nenhuma |
| Funções `SECURITY DEFINER` em `public`/`app` | nenhuma |
| Funções executáveis por `PUBLIC` em `public`/`app` | nenhuma |
| Storage buckets | nenhum |
| Edge Functions | nenhuma |
| Security advisors | zero findings |
| Performance advisors | zero findings |

As tabelas internas do schema `storage` estão presentes, com RLS habilitada, e
não contêm buckets ou objetos. As extensões instaladas são as esperadas do
projeto gerenciado; nenhuma extensão de aplicação precisa ser promovida pelo
slice atual.

## Comparação com o contrato local

O remoto continua vazio e não apresenta drift que conflite com as duas
migrations revisadas do catálogo:

1. `20260915052838_catalog_initial` — cria o schema privado `app`, dez tabelas,
   constraints, índices, RLS e revogações;
2. `20260915053138_catalog_updated_at_defaults` — define defaults de
   `updated_at`.

Hashes SHA-256 observados no checkout:

- migration inicial:
  `E1E7F032C151AE578FA6E81EF9DE99251BBB370E0DFEF8C1DEEAFA51B5EF4098`;
- migration de defaults:
  `9EB076E7DC45D4C715035A6CB5526ED1D5FB4633C739CF2C4CB498B52650EBAE`.

O histórico de migrations deve continuar sob responsabilidade do Prisma
Migrate. Por isso, o baseline não aplicou SQL pelo MCP nem criou um segundo
mecanismo de rastreamento remoto.

## Decisão pendente

O bloqueio técnico causado pela inatividade foi resolvido. A promoção continua
pendente de autorização humana explícita e de conexões backend fornecidas por
gerenciador de segredos:

1. aprovar a promoção das duas migrations revisadas para o projeto principal;
2. configurar `DATABASE_URL` pooled e `DIRECT_URL` direta sem persistir segredos
   no Git ou na conversa;
3. executar `prisma migrate deploy` pelo caminho canônico do repositório;
4. repetir inspeção de migrations, tabelas, RLS, grants e advisors;
5. tratar permissões reais de staff/Auth e Storage em releases separadas.

Até essa decisão, `FEATURE-CATALOG` permanece `READY_FOR_RELEASE`, não
`RELEASED`.
