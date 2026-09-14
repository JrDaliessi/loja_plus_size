---
id: ADR-002
status: accepted
date: 2026-09-14
affects: [database, auth, storage, rls, apps/api, apps/web]
derived_from: [PRODUCT-PRD, PRD-NFR-002, PRD-NFR-005]
---

# ADR-002 — Dados comerciais pelo backend e superfície Supabase mínima

## Context

O Supabase hospedará PostgreSQL, Auth e Storage. A regra central exige que a UI não acesse o banco diretamente e que o NestJS controle autorização e regras comerciais. Ao mesmo tempo, schemas expostos pela Data API exigem grants e RLS corretos; uma policy isolada não substitui controle de acesso ao objeto.

O schema real do projeto `olkadbgumpiybehslobk` ainda não foi inspecionado, portanto nenhuma migration ou suposição de vazio é permitida.

## Decision

Propor as seguintes fronteiras:

1. Tabelas comerciais ficam em schema não exposto, inicialmente denominado `app`, sujeito ao baseline real.
2. `apps/api` usa conexão PostgreSQL secreta com papel de menor privilégio; nunca superuser ou `service_role` como credencial genérica.
3. `apps/web` não consulta tabelas comerciais por REST/GraphQL Supabase.
4. Supabase Auth é usado para identidade; NestJS valida tokens e aplica autorização de aplicação.
5. `user_metadata` não é fonte de autorização. Papéis usam dados controlados ou `app_metadata` com política de atualização.
6. Se uma superfície Data API for necessária, ela será explicitamente exposta com grants mínimos, RLS por tabela, índices das predicates e testes.
7. Storage usa fluxo autorizado/signed; chave secret/service role nunca chega ao cliente.

## Security Invariants

- deny by default para mutações;
- `TO authenticated` sem predicate de escopo não é autorização;
- update protegido exige política de seleção e `USING`/`WITH CHECK` apropriados;
- views expostas usam `security_invoker` quando suportado;
- `SECURITY DEFINER` não é correção automática de permissão e fica fora de schemas expostos;
- grants e RLS são validados separadamente;
- policies de Storage cobrem operações realmente permitidas, inclusive requisitos de upsert.

## Consequences

### Positive

- superfície pública de dados menor;
- regra comercial e autorização centralizadas;
- troca futura de infraestrutura não alcança a UI diretamente;
- RLS permanece proteção obrigatória onde houver exposição.

### Costs

- leituras da vitrine passam pela API NestJS;
- conexão e papel PostgreSQL precisam de configuração cuidadosa;
- SSR/Auth requer transporte seguro da identidade entre web e API;
- acesso direto da Data API só entra mediante decisão explícita.

## Rejected Alternatives

- **Expor todas as tabelas em `public`:** amplia superfície e risco de grants/policies incorretos.
- **Usar `service_role` no browser:** bypassa RLS e é proibido.
- **Confiar apenas em filtro da aplicação:** não protege superfícies expostas por outro caminho.
- **Duplicar autorização somente no Next.js:** não protege consumidores diretos da API.

## Validation Before Acceptance in Code

- baseline read-only do Supabase;
- confirmação de schemas expostos e grants padrão;
- teste de conexão com papel de menor privilégio;
- advisors de segurança/performance;
- testes negativos de acesso e RLS quando aplicável;
- confirmação de backup independente para objetos do Storage.

## Approval

Aceito pelo humano em 2026-09-14. A decisão arquitetural está aprovada; a confirmação técnica após o baseline Supabase permanece um bloqueio antes de schema ou migrations.
