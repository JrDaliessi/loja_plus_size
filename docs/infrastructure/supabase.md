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
