# Project Stack

Status: aprovado no Dia 0 em 2026-09-13.  
Derived from: `stack_loja_plus_size_completa.md` e `loja_plus_size_ideia_completa.md`.

## Arquitetura escolhida

```text
Cliente
  ↓
Next.js 16 / React / TypeScript / PWA
  ↓ REST HTTPS / OpenAPI
NestJS / TypeScript — regras de negócio
  ↓ Prisma 8
PostgreSQL / Supabase
  ├─ Supabase Auth
  ├─ Supabase Storage
  └─ Realtime quando necessário

Integrações graduais: Mercado Pago, frete, WhatsApp,
Mercado Livre, Shopee, Google Merchant e Meta.
Filas futuras: Redis + BullMQ.
```

## Stack aprovada

| Camada | Decisão |
|---|---|
| Linguagem | TypeScript ponta a ponta |
| Runtime | Node.js 24 LTS |
| Monorepo | pnpm Workspaces + Turborepo |
| Frontend | Next.js 16.3.x, App Router e React |
| Renderização | Server Components por padrão; Client Components somente para interação |
| UI | Tailwind CSS, shadcn/ui, Radix e Design System Purple Noir |
| Formulários | React Hook Form + Zod |
| Estado local | Zustand apenas para carrinho local, filtros e estado de interface |
| API | NestJS, REST e Swagger/OpenAPI |
| ORM | Prisma 8, atualmente Release Candidate |
| Banco | PostgreSQL hospedado no Supabase |
| Auth | Supabase Auth; JWT validado no NestJS |
| Arquivos | Supabase Storage |
| Pagamento inicial | Mercado Pago; Stripe como provider opcional futuro |
| Frete | Interface `ShippingProvider`; implementação ainda a selecionar |
| Busca inicial | PostgreSQL Full Text Search |
| Busca futura | Typesense ou Meilisearch somente mediante necessidade comprovada |
| Filas futuras | Redis + BullMQ; sem Kafka/RabbitMQ no escopo inicial |
| PWA | Serwist, offline shell, cache estratégico e push quando validados |
| Testes web | Vitest + Testing Library |
| Testes API | Jest + Supertest |
| Testes E2E | Playwright |
| Observabilidade | Sentry + logs estruturados e correlação de fluxo |
| CI/CD | GitHub Actions |
| Deploy web | Vercel |
| Deploy API | Decisão pendente entre Railway, Render, Fly.io ou infraestrutura própria |

## Fronteiras arquiteturais

- `apps/web` entrega experiência, SEO e composição; não acessa banco diretamente.
- `apps/api` contém regras de negócio, orquestração, autorização e integrações.
- `packages/contracts` compartilha schemas Zod e contratos públicos, não regras internas.
- Infraestrutura concreta implementa portas como `PaymentProvider` e `ShippingProvider`.
- Estoque é controlado por variante/SKU e o sistema próprio é a fonte única de verdade.
- Marketplaces são adicionados um por vez: loja própria → primeiro marketplace → segundo marketplace.
- Eventos começam dentro do NestJS; BullMQ entra quando houver carga assíncrona real.
- Tokens visuais devem centralizar Purple Noir; componentes não devem espalhar hexadecimais arbitrários.
- Dark Luxury atende header, hero, conta, admin e campanhas; Light Editorial atende catálogo, produto, busca, blog e páginas extensas.
- Fotografia mantém cor real das peças, diversidade corporal e protagonismo sobre efeitos visuais.

## Restrições do Prisma 8

Em 2026-09-13 o Prisma 8 é RC, ainda sem paridade completa com Prisma 7. A decisão humana é manter Prisma 8 conforme o documento. Antes do scaffold:

1. fixar versões RC exatas e commitar o lockfile;
2. validar se consultas, transações e nested writes necessários ao primeiro slice estão disponíveis;
3. criar ADR caso uma lacuna exija Prisma 7 ou SQL/driver direto;
4. não promover uma mudança de ORM sem aprovação humana.

## Decisões deliberadamente adiadas

- Nome comercial definitivo.
- Hospedagem do NestJS.
- Provedor inicial de frete.
- Adoção de Stripe.
- Primeiro marketplace externo.
- Redis/BullMQ, mecanismo de busca externo e assistente de IA.

Essas decisões não impedem o Dia 0; entram no gate da small release correspondente.
