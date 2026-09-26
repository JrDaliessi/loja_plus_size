# Supabase Project

## Identificação

- Project ref: `olkadbgumpiybehslobk`
- Dashboard: `https://supabase.com/dashboard/project/olkadbgumpiybehslobk`
- API base URL: `https://olkadbgumpiybehslobk.supabase.co`
- REST endpoint: `https://olkadbgumpiybehslobk.supabase.co/rest/v1/`
- Papel planejado: PostgreSQL, Auth e Storage.
- Regra de negócio: permanece no NestJS.

## Estado de acesso — 2026-09-14

Acesso MCP confirmado após aceite do convite pela conta conectada. Chamadas
diretas para o project ref, SQL somente leitura, extensions, migrations, Edge
Functions e advisors foram concluídas com sucesso.

Evidência detalhada: `docs/infrastructure/supabase-baseline-2026-09-14.md`.

## Estado operacional

- Schema `public`: vazio; schema `app`: ainda ausente.
- Migrations: nenhuma.
- Grants comerciais `anon`/`authenticated`: nenhum.
- RLS/policies comerciais: nenhuma porque ainda não há tabelas.
- Storage buckets: nenhum.
- Edge Functions: nenhuma.
- Security/performance advisors: zero findings no baseline.
- Chave publishable: fornecida pelo humano, mas não persistida em documentação ou Git.
- Chave anon legada: fornecida, porém não será usada no novo cliente.
- Chaves secret/service role: não fornecidas e não devem ser compartilhadas em conversa ou código cliente.

## Ambiente de testes

Os testes destrutivos de constraints, concorrência e rollback usam o PostgreSQL
17 local `plus_store_day2_test` na porta 55432. O harness rejeita host remoto e
database diferente desse nome. O Supabase principal não é fixture.

Uma branch Supabase foi avaliada, mas não criada: o preço informado era US$
0,01344/h e exigiria confirmação de custo. O cluster local removeu essa
necessidade no Dia 2.

## Conexões Prisma 7

- `DATABASE_URL`: conexão pooled usada pelo runtime NestJS;
- `DIRECT_URL`: conexão direta usada somente por CLI, introspection e migrations;
- ambas são segredos de backend e nunca usam prefixo `NEXT_PUBLIC_`;
- o spike local aceita apenas
  `127.0.0.1:55432/plus_store_day2_prisma7_spike`;
- nenhuma URL PostgreSQL real do Supabase é armazenada no Git ou enviada em
  conversa.

## Política de segurança

- Usar publishable key no cliente; nunca expor secret/service role.
- Manter valores reais somente em arquivos locais ignorados ou no gerenciador de ambiente do deploy.
- Habilitar e testar RLS em toda tabela exposta.
- Não usar `user_metadata` para autorização.
- Manter autorização administrativa em dados controlados pela aplicação.
- Fixar versões de clientes e commitar lockfile.

## Integração local do Dia 4 — 2026-09-20

- `@supabase/supabase-js 2.116.0` foi fixado no lockfile.
- O backend valida bearer tokens com `auth.getClaims(jwt)`; `getSession()` não é
  usado como prova de identidade.
- Permissões de catálogo são lidas somente de `app_metadata`; valores em
  `user_metadata` são ignorados mesmo quando usam nomes de permissão válidos.
- O adapter de Storage aceita apenas JPEG, PNG e WebP até 10 MB, gera path sob
  o namespace do produto e solicita upload assinado com `upsert: false`.
- Bucket, policies, objetos e Auth do projeto principal não foram alterados.
- A validação remota permanece pendente de conexão por secrets, permissões de
  staff aprovadas e resolução do incidente de rejeição de JWT registrado em
  `https://status.supabase.com/` em 2026-09-20.

## Hardening local do Dia 5 — 2026-09-20

- Claims verificadas por `getClaims` também precisam corresponder ao issuer
  `${SUPABASE_URL}/auth/v1`, audiência autenticada e sessão válida.
- Bearer tokens maiores que 8 KiB são negados antes de qualquer chamada ao Auth.
- A autorização continua aceitando somente permissões allowlisted em
  `app_metadata`; `user_metadata` permanece ignorado.
- Exceções lançadas pelo SDK de Storage são normalizadas sem expor endpoint,
  credenciais ou mensagens internas.
- A reconciliação processa no máximo dez verificações de objeto simultâneas e
  continua limitada a cem paths por execução.
- A documentação atual do Supabase foi revalidada para `getClaims`, upload
  assinado, metadata de autorização, conexão pooled e mudanças incompatíveis.
- Nenhuma configuração, identidade, bucket, policy ou objeto remoto foi alterado.

## Gate somente leitura do Dia 7 — 2026-09-20

- O projeto `olkadbgumpiybehslobk` foi confirmado em `sa-east-1`, PostgreSQL 17.
- O status retornado foi `INACTIVE`; leituras de tabelas e migrations expiraram.
- Advisors de segurança e performance retornaram zero findings, mas o resultado
  é inconclusivo para promoção enquanto o banco permanecer inativo.
- Nenhuma tentativa de restore/reativação foi feita, pois isso exige autorização
  externa específica.
- O PostgreSQL 17 local confirmou migrations do zero, idempotência, RLS em 10/10
  tabelas, nenhum grant Data API e nenhuma FK sem índice.
- O projeto principal permaneceu sem mutação.

## Revalidação pós-release — 2026-09-25

- O project ref continua acessível diretamente pela conta conectada.
- O status permanece `INACTIVE`.
- Leituras de migrations e tabelas `public`/`app` terminaram por timeout.
- Advisors retornaram zero findings, mas continuam inconclusivos sem conexão ao
  banco ativo.
- Nenhuma restauração ou mutação foi executada.

Evidência detalhada:
`docs/infrastructure/supabase-revalidation-2026-09-25.md`.

## Revalidação após reativação — 2026-09-26

- O status do projeto passou para `ACTIVE_HEALTHY`.
- O PostgreSQL 17.6 respondeu às consultas somente leitura.
- Não há migrations remotas de aplicação, tabelas ou views em `public`/`app`,
  grants de cliente, policies comerciais, buckets ou Edge Functions.
- Não há funções expostas em `public`/`app`, inclusive `SECURITY DEFINER` ou
  executáveis por `PUBLIC`.
- Advisors de segurança e performance retornaram zero findings.
- O estado vazio não conflita com as duas migrations locais revisadas.
- Nenhuma mutação foi executada; o histórico remoto deverá ser promovido pelo
  Prisma Migrate, sem misturar mecanismos de migration.

Evidência detalhada:
`docs/infrastructure/supabase-revalidation-2026-09-26.md`.
