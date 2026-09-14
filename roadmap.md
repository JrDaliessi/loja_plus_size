# Roadmap

O roadmap preserva integralmente a visão dos documentos, mas entrega valor em pequenos incrementos verificáveis.

## Fase atual — Fundação

| Marco | Resultado | Estado |
|---|---|---|
| Dia 0 | Governança, contexto, stack, roadmap, backlog, gates e workflows | DONE |
| Emenda Dia 0 | Purple Noir incorporado como fonte e contrato visual | DONE |
| Dia 1 | Product PRD aprovado; arquitetura e primeira feature spec em revisão | IN_PROGRESS |
| Dia 2 | Estratégia de validação e testes RED do primeiro slice | PLANNED |
| Dia 3 | Implementação mínima GREEN | PLANNED |
| Dia 4 | Estados e fluxos auxiliares planejados | PLANNED |
| Dia 5 | Refactoring e hardening | PLANNED |
| Dia 6 | UX, acessibilidade, SEO, responsividade e PWA aplicável | PLANNED |
| Dia 7 | Gates finais, release e compactação | PLANNED |

## Evolução do produto

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
