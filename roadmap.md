# Roadmap

O roadmap preserva integralmente a visão dos documentos, mas entrega valor em pequenos incrementos verificáveis.

## Fase atual — Fundação

| Marco | Resultado | Estado |
|---|---|---|
| Dia 0 | Governança, contexto, stack, roadmap, backlog, gates e workflows | DONE |
| Emenda Dia 0 | Purple Noir incorporado como fonte e contrato visual | DONE |
| Dia 1 | Product PRD, arquitetura, ADRs e primeira Feature Spec aprovados | DONE |
| Dia 2 | Matriz 20/20, baseline Supabase, sete RED PostgreSQL e migração validada para Prisma 7 estável | DONE — corrigido em 2026-09-15 |
| Dia 3 | Implementação mínima GREEN | DONE — 2026-09-20 |
| Dia 4 | Estados e fluxos auxiliares planejados | DONE — 2026-09-20 |
| Dia 5 | Refactoring e hardening | DONE — 2026-09-20 |
| Dia 6 | Experiência/formato da API validados; UI/SEO/PWA diferidos ao escopo web aplicável | DONE — 2026-09-20 |
| Dia 7 | Gates finais, release candidate e compactação | DONE — `READY_FOR_RELEASE`, 2026-09-20 |

## Evolução do produto

### Preview demonstrativa — Vercel

`SR-WEB-PREVIEW-01` entrega uma única página Purple Noir para revisão visual e
técnica antes da vitrine comercial. Usa conteúdo local explicitamente
ilustrativo, não exibe preço/estoque/compra, não depende do Supabase ou API
remota e só será promovida além de Preview Deployment após aceite humano.

| Gate | Resultado | Estado |
|---|---|---|
| Dia 1 | requisitos, ACs e spec da preview | DONE — `SPEC_READY`, 2026-09-20 |
| Dia 2 | matriz 14/14, fixtures, 19 testes e RED válido | DONE — `VALIDATION_READY`, 2026-09-20 |
| Dia 3 | implementação mínima GREEN e verificação local | DONE — 2026-09-21 |
| Dia 4 | estados acessíveis, contratos de assets e metadata localizados | DONE — 2026-09-21 |
| Dia 5 | WebPs 95,43% menores e headers de segurança | DONE — 2026-09-21 |
| Dia 6 | experiência, acessibilidade e formato final | DONE — `QUALITY_VALIDATION`, 2026-09-21 |
| Dia 7 | gates finais, publicação e compactação | DONE — `RELEASED`, 2026-09-25 |

Produção: `https://loja-plus-size.vercel.app` — deployment
`dpl_jQHa6UPru2CMbYZfXp8Q6kPLL7v4` (`READY`).

### MVP — Commerce Core

Catálogo, categorias, busca inicial, página de produto, variantes cor/tamanho, SKU, estoque, carrinho de visitante, checkout sem conta obrigatória, Mercado Pago, frete, pedido e administração mínima.

Small releases propostas:

1. `SR-MVP-01` — catálogo e variante/SKU como fonte de verdade.
2. `SR-MVP-02` — estoque e movimentações consistentes.
3. `SR-MVP-03` — vitrine, busca, filtros e página de produto.
4. `SR-MVP-04` — carrinho visitante e cálculo de preço.
5. `SR-MVP-05` — checkout, endereço e frete.
6. `SR-MVP-06` — Mercado Pago, pedido, idempotência e confirmação.
7. `SR-MVP-07` — painel administrativo mínimo e release operacional.
8. `SR-MVP-08` — instalabilidade, offline shell e validação PWA sem operações comerciais offline implícitas.

O Design System Purple Noir é uma dependência transversal das releases com interface e será implementado incrementalmente, começando pelos tokens e componentes usados na primeira tela, sem construir uma biblioteca completa antecipadamente.

### V1 — Confiança e relacionamento

Conta, histórico de pedidos, wishlist, avaliações verificadas com percepção de tamanho/caimento, tabelas específicas de medidas e perfil opcional de medidas.

### V2 — Pós-venda e merchandising

Portal de trocas, reserva para troca, analytics de motivos, alertas de reposição, painel de demanda, coleções, cupons e promoções configuráveis.

### V3 — Omnichannel

Primeiro marketplace, segundo marketplace, estoque central sincronizado, Google Merchant e Meta/Instagram.

### V4 — Operação orientada a dados

CRM, segmentação, carrinho abandonado sem abuso, WhatsApp assistido, blog, SEO programático útil, relatórios e oportunidades de busca sem resultado.

### V5 — Diferenciais de moda plus size

Recomendação de tamanho, visualização em corpos diferentes, outfits, cross-sell, preferências de estilo e home personalizada.

### V6 — Assistente de moda com IA

Assistente baseado exclusivamente em catálogo, disponibilidade e preferências autorizadas; sem inventar produto, estoque ou garantia de caimento.

## Critério de avanço

Cada release exige requisitos aprovados, validação antes da implementação, pipeline verde, riscos críticos tratados, documentação atualizada e aprovação humana para avançar.
