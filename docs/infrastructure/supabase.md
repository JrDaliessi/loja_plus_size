# Supabase Project

## Identificação

- Project ref: `olkadbgumpiybehslobk`
- Dashboard: `https://supabase.com/dashboard/project/olkadbgumpiybehslobk`
- API base URL: `https://olkadbgumpiybehslobk.supabase.co`
- REST endpoint: `https://olkadbgumpiybehslobk.supabase.co/rest/v1/`
- Papel planejado: PostgreSQL, Auth e Storage.
- Regra de negócio: permanece no NestJS.

## Estado de acesso — 2026-09-14

A conexão Supabase disponível nesta sessão não possui permissão para esse projeto. A listagem foi repetida no início do Dia 2 e confirmou o mesmo resultado.

Projetos visíveis na conexão atual:

- `agenda_eventos` — `xdgiksuvpuwibwdvmbnw`
- `fin_control` — `nrisvhzlkqwzaphztaxf`

O projeto `olkadbgumpiybehslobk` não apareceu na listagem autorizada. Chamadas de leitura para metadados, URL, tabelas, migrations, Edge Functions e security advisors falharam por falta de permissão.

## Estado operacional

- Schema: desconhecido; não assumir vazio.
- Migrations: desconhecidas.
- RLS/policies: desconhecidas.
- Extensions: desconhecidas.
- Edge Functions: desconhecidas.
- Security/performance advisors: não inspecionados.
- Chave publishable: fornecida pelo humano, mas não persistida em documentação ou Git.
- Chave anon legada: fornecida, porém não será usada no novo cliente.
- Chaves secret/service role: não fornecidas e não devem ser compartilhadas em conversa ou código cliente.

## Ação mínima de desbloqueio

Autorizar/conectar no Codex a conta ou organização Supabase que contém `olkadbgumpiybehslobk`. Depois, repetir somente:

1. dados do projeto e URL;
2. tabelas do schema `public`;
3. migrations;
4. extensions e Edge Functions;
5. advisors de segurança e performance.

Nenhuma migration ou SQL deve ser aplicada durante essa inspeção.

Para os testes destrutivos de constraints, concorrência e rollback, o projeto também precisa de um banco isolado. As opções admissíveis são uma branch Supabase criada após confirmação de custo ou uma instância PostgreSQL local com credencial fornecida por canal seguro. O banco de produção não será usado como fixture.

## Política de segurança

- Usar publishable key no cliente; nunca expor secret/service role.
- Manter valores reais somente em arquivos locais ignorados ou no gerenciador de ambiente do deploy.
- Habilitar e testar RLS em toda tabela exposta.
- Não usar `user_metadata` para autorização.
- Manter autorização administrativa em dados controlados pela aplicação.
- Fixar versões de clientes e commitar lockfile.
