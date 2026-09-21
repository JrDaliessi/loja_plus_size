# Test Plan — FEATURE-WEB-PREVIEW

## Objective

Validar a `SR-WEB-PREVIEW-01` antes da implementação, cobrindo aplicação,
adapter demo, apresentação, metadata, fronteiras arquiteturais, Purple Noir,
acessibilidade, responsividade e entrega em Preview Deployment.

## Validation Principle

Os testes essenciais devem falhar no Dia 2 porque o comportamento ainda não foi
implementado. TypeScript e o runner devem permanecer funcionais. Falha de
import, dependência, configuração ou ambiente não constitui RED válido.

## Test Layers

| Layer | IDs | Tool | Purpose |
|---|---|---|---|
| Application | `WEBPREVIEW-APP-*` | Vitest | normalizar ready, empty e error |
| Demo adapter | `WEBPREVIEW-INFRA-*` | Vitest | fornecer quatro registros ilustrativos sem campos comerciais |
| Presentation | `WEBPREVIEW-UI-*` | Testing Library | conteúdo, semântica, CTA, imagens e estados |
| Accessibility | `WEBPREVIEW-A11Y-*` | axe-core + browser | violações, teclado, foco e nomes acessíveis |
| Metadata | `WEBPREVIEW-META-*` | Vitest | title, description e noindex/nofollow |
| Architecture | `WEBPREVIEW-ARCH-*` | Vitest + source scan | impedir acesso remoto, Supabase, Prisma e Client Component desnecessário |
| Design system | `WEBPREVIEW-DS-*` | Vitest | tokens mínimos e contraste WCAG AA |
| Responsive/E2E | `WEBPREVIEW-E2E-*` | browser/Playwright no Dia 6 | layout e fluxo nas larguras aprovadas |
| Delivery | `WEBPREVIEW-VERCEL-*` | Vercel + browser | deployment READY sem promoção de produção |

## Day 2 Commands

Executar com Node.js 24.21.0 e pnpm 11.19.0:

```text
pnpm --filter @plus-store/web run type-check
pnpm --filter @plus-store/web run test:web:red
```

Expected result:

- type-check: PASS;
- runner: executable;
- behavior suite: RED for missing feature behavior;
- architecture and invariant guards may already pass.

## RED-to-GREEN Order

1. `WEBPREVIEW-APP-001..003` — application result normalization.
2. `WEBPREVIEW-INFRA-001` — deterministic local adapter.
3. `WEBPREVIEW-META-001..002` — safe preview metadata.
4. `WEBPREVIEW-DS-001` — minimal Purple Noir tokens.
5. `WEBPREVIEW-UI-001..008` — minimum page behavior.
6. type-check, lint, full tests and build.
7. browser verification after the dev server starts.

This order keeps the Dia 3 implementation minimal and prevents styling from
hiding missing contracts.

## Browser and Responsive Validation

Browser validation is specified in `browser-verification.md` and becomes
executable only after the home route and dev server exist. Starting a server
without checking meaningful content, error overlay, console and key elements is
not accepted as evidence.

## Assets

The fixtures define semantic intent and target paths, not final images. Assets
must be generated or approved with origin evidence before visual acceptance.
The five dashboard references supplied by the human are never used as product
assets.

## Security and Privacy Checks

- no `@supabase`, `@prisma`, `DATABASE_URL`, `SUPABASE_URL` or `fetch()` inside
  the preview feature;
- no form, cookie, personal data or remote endpoint;
- no secrets or environment variables required;
- no price, stock, freight or purchase language;
- no production promotion before preview approval.

## Completion Criteria

- 14/14 acceptance criteria have primary validation;
- fixtures cover ready, empty and error;
- type-check passes;
- RED is observed for missing behavior rather than setup failure;
- remaining browser/deployment gates are explicitly deferred, not marked green;
- context, backlog and state are updated to `VALIDATION_READY`.
