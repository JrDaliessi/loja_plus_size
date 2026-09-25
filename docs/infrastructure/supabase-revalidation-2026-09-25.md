---
id: SUPABASE-REVALIDATION-2026-09-25
project_ref: olkadbgumpiybehslobk
mode: read_only
status: blocked_inactive
affects: [FEATURE-CATALOG, SR-MVP-01, SEC-BASE-001]
---

# Supabase Revalidation — 2026-09-25

## Escopo

Revalidação somente leitura após a entrega da preview web. Nenhuma restauração,
migration, consulta de dados de negócio, alteração de Auth, policy, função,
bucket ou objeto foi executada.

## Evidências

| Verificação | Resultado |
|---|---|
| Project ref direto | acessível |
| Nome | `Loja_plus_size` |
| Região | `sa-east-1` |
| PostgreSQL | 17 (`17.6.1.166`) |
| Status de gestão | `INACTIVE` |
| API URL | `https://olkadbgumpiybehslobk.supabase.co` |
| Listagem de migrations | timeout de conexão |
| Listagem de tabelas `public`/`app` | timeout de conexão |
| Security advisors | zero findings retornados, inconclusivo com banco inativo |
| Performance advisors | zero findings retornados, inconclusivo com banco inativo |

O projeto não apareceu na listagem principal da conta conectada, mas continuou
acessível diretamente pelo `project_ref`, consistente com acesso por convite a
uma organização externa.

## Bloqueio

MOTIVO DO BLOQUEIO: projeto Supabase inativo.

EVIDÊNCIA DO BLOQUEIO: status `INACTIVE` e timeout nas leituras de schema e
migrations.

IMPACTO: não é seguro promover migrations, Auth, RLS ou Storage da
`SR-MVP-01`; o estado remoto atual não pôde ser comparado ao contrato local.

AÇÃO MÍNIMA DE DESBLOQUEIO: o proprietário deve restaurar/reativar o projeto e
autorizar nova inspeção read-only. Só depois serão comparados schema, migrations,
grants, RLS, policies e advisors antes de qualquer mutação.
