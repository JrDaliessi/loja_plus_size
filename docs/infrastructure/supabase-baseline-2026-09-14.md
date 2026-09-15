---
id: SUPABASE-BASELINE-2026-09-14
project_ref: olkadbgumpiybehslobk
mode: read_only
status: verified
affects: [ADR-002, FEATURE-CATALOG, SR-MVP-01]
---

# Supabase Baseline — 2026-09-14

## Escopo

Inspeção somente leitura executada via MCP depois que a conta conectada aceitou
o convite para o projeto. Nenhuma migration, função, policy, bucket ou dado foi
criado ou alterado.

## Projeto

- nome: `Loja_plus_size`;
- ref: `olkadbgumpiybehslobk`;
- região: `sa-east-1`;
- estado: `ACTIVE_HEALTHY`;
- PostgreSQL: linha 17;
- API URL: `https://olkadbgumpiybehslobk.supabase.co`.

## Evidências

| Verificação | Resultado |
|---|---|
| Schemas relevantes | `auth`, `public`, `realtime`, `storage`; `app` ausente |
| Relações em `public`/`app` | nenhuma |
| Migrations | nenhuma |
| Grants de tabela para `anon`/`authenticated` | nenhum |
| Policies em `public`/`app`/`storage` | nenhuma |
| Storage buckets | nenhum |
| Edge Functions | nenhuma |
| Security advisors | zero findings |
| Performance advisors | zero findings |

Extensões instaladas relevantes: `plpgsql`, `pgcrypto`, `uuid-ossp`,
`pg_stat_statements` e `supabase_vault`. As demais extensões listadas pelo
serviço estão apenas disponíveis, não instaladas.

## Conclusão arquitetural

O nome `app` está livre e permanece adequado para tabelas comerciais fora da
superfície Data API padrão. O schema `public` não contém legado a preservar.
Qualquer criação futura continuará sujeita a migration revisada, grants mínimos,
testes negativos e advisors após a mudança.

## Pré-requisitos ainda externos

- a conexão PostgreSQL usada pelo backend precisa ser entregue por variável de
  ambiente segura antes de integração/deploy; ela não deve ser enviada em chat;
- Storage ainda não possui bucket ou policy. A criação pertence a uma small
  release autorizada e não ao baseline;
- publishable key pode ir ao cliente; secret/service role permanece proibida.
