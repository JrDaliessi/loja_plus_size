---
id: ADR-001
status: proposed
date: 2026-09-14
affects: [apps/web, apps/api, packages/contracts, packages/ui]
derived_from: [PRODUCT-PRD, SRC-STACK-001]
---

# ADR-001 — Monorepo e fronteiras Next.js/NestJS

## Context

O produto precisa de SEO e experiência editorial na loja, mas também terá regras críticas de estoque, checkout, pagamentos, trocas e sincronização de canais. Concentrar todas as responsabilidades no Next.js ou permitir acesso direto da UI ao banco reduziria a clareza das fronteiras e aumentaria o risco operacional.

## Decision

Adotar monorepo pnpm + Turborepo com:

- `apps/web`: Next.js 16 App Router, apresentação, composição, SEO e estado de interface;
- `apps/api`: NestJS, REST/OpenAPI, autorização, aplicação, domínio e integrações;
- `packages/contracts`: contratos públicos serializáveis e schemas Zod;
- `packages/ui`: tokens e componentes Purple Noir sem regra comercial;
- pacotes de configuração somente quando necessários.

Server Components serão o padrão de leitura na web e chamarão a API NestJS. Client Components serão limitados a interação. Server Actions ou Route Handlers, quando usados, serão adapters finos e não formarão um segundo backend.

## Dependency Rules

```text
web presentation -> typed API client -> Nest REST
Nest presentation -> application -> domain
infrastructure -> application/domain ports
domain -> nenhuma tecnologia externa
```

## Consequences

### Positive

- regras comerciais possuem uma única implementação;
- API pode atender web e canais futuros;
- mudanças de framework ficam isoladas;
- OpenAPI e contratos compartilhados reduzem drift;
- testes podem priorizar domínio e aplicação.

### Costs

- dois runtimes/deploys precisam de observabilidade e configuração;
- autenticação e correlação atravessam a fronteira web/API;
- contratos exigem disciplina de compatibilidade.

## Rejected Alternatives

- **Next.js acessando Supabase para toda regra:** conflita com a decisão aprovada de backend dedicado.
- **GraphQL no MVP:** adiciona complexidade sem necessidade comprovada.
- **Microservices desde o início:** aumenta operação e consistência antes de escala real.
- **Pacote `utils` genérico antecipado:** favorece acoplamento e abstração prematura.

## Validation

- nenhum módulo web importa adapter de banco;
- controllers não contêm regras de negócio;
- domínio compila/testa sem NestJS, Prisma, Supabase ou React;
- contratos HTTP possuem teste de compatibilidade.

## Approval

Pendente de aprovação humana no encerramento do Dia 1B.
