# Project Brief

## Project Name

Plus Store (nome provisório; a marca comercial poderá mudar sem alterar o núcleo do produto).

## Project Type

Produto digital de software: e-commerce vertical de moda plus size, headless, omnichannel e orientado a dados.

## Problem / Need

Clientes de moda plus size enfrentam dificuldade para saber se uma peça servirá, como será o caimento em seu corpo e como combiná-la. A operação também precisa controlar muitas variantes, estoque por SKU, pedidos, pagamentos, logística e trocas sem divergência entre canais.

## Expected Outcome

Construir uma plataforma especializada que ajude a cliente a encontrar roupas que sirvam, combinem com seu estilo e tenham o caimento esperado, sustentada pelo ciclo:

`medidas → recomendação → disponibilidade → compra → avaliação → troca → dados → melhor recomendação`

## Audience

- Clientes de moda plus size no Brasil, incluindo visitantes que desejam comprar sem criar conta.
- Equipe administrativa de catálogo, estoque, pedidos, trocas, conteúdo, atendimento e gestão.
- Futuramente, operadores de marketplaces e campanhas.

## Deliverables

### MVP

- Loja web/PWA com catálogo, categorias, busca e páginas de produto.
- Produtos com variantes de cor e tamanho; cada combinação possui SKU, preço e estoque.
- Carrinho para visitante, checkout sem conta obrigatória, pagamento e frete.
- Backend dedicado e painel administrativo mínimo para catálogo, variantes, estoque e pedidos.
- Interface baseada no Design System Purple Noir, combinando Dark Luxury e Light Editorial.

### Evolução aprovada como visão

- V1: conta, pedidos, wishlist, avaliações e tabelas de medidas.
- V2: trocas, alertas de reposição, coleções e promoções/cupons.
- V3: Mercado Livre, Shopee, Google Merchant e Meta.
- V4: CRM, campanhas, automações, atendimento e analytics.
- V5: recomendação de tamanho, looks e personalização.
- V6: assistente de moda com IA consultando catálogo e estoque reais.

## Success Criteria

- Cliente encontra produtos disponíveis em seu tamanho e entende medidas e caimento.
- Estoque é consistente por SKU e centralizado entre canais.
- Compra pode ser concluída como visitante por PIX ou cartão, com cálculo de frete.
- Operação administra catálogo, estoque, pedidos e configurações sem regras hard-coded no frontend.
- Fluxos críticos de catálogo, estoque, carrinho, checkout, pagamento e pedido possuem testes e observabilidade proporcionais ao risco.
- Acessibilidade, SEO, desempenho, segurança, LGPD e experiência mobile passam pelos gates aplicáveis.
- A identidade Purple Noir é aplicada sem competir com a fotografia nem comprometer contraste e legibilidade.

## Constraints

- Seguir integralmente a visão e a stack das fontes, mas executar por small releases.
- TypeScript ponta a ponta em monorepo pnpm + Turborepo.
- Next.js separado do backend NestJS; comunicação REST/OpenAPI.
- PostgreSQL/Supabase, Supabase Auth e Storage; regra de negócio central no NestJS.
- Mercado Pago como primeiro gateway; Stripe permanece opcional.
- Não obrigar criação de conta no checkout.
- Recomendação de tamanho é orientação, não garantia de caimento.
- Dados de medidas e preferências são opcionais e sensíveis à privacidade.
- Direção visual: Purple Noir, com Dark Luxury em áreas institucionais/sistema e Light Editorial em catálogo e conteúdo.
- Roxo atua como identidade e destaque, não como fundo dominante; fotografia de moda preserva cores reais.

## Risks

- Overrides transitivos de segurança do Prisma 7 precisam ser revalidados em toda atualização.
- Node.js 22.14.0 continua global, mas o projeto seleciona explicitamente Node.js 24.21.0.
- Pagamento, reserva/baixa de estoque, webhooks e sincronização multicanal exigem idempotência e consistência transacional.
- Medidas corporais, perfis, CRM e segmentação exigem minimização de dados e governança LGPD.
- Escopo completo é grande; construir tudo antes de validar vendas aumentaria prazo e risco.
- Integrações de marketplaces, WhatsApp e frete dependem de contas, contratos e APIs externas.

## Dependencies

- Node.js 24 LTS e pnpm.
- Next.js 16.3.x, React, TypeScript, Tailwind CSS e shadcn/ui.
- NestJS, REST/OpenAPI e Prisma 7 estável.
- Projeto Supabase com PostgreSQL, Auth e Storage.
- Projeto Supabase existente: `olkadbgumpiybehslobk`.
- Mercado Pago e provedor de frete a selecionar antes da integração.
- Vercel para web; hospedagem do backend ainda a decidir entre as opções documentadas.

## Sources

Ver `docs/sources/source-map.md`.

## Capabilities Needed

- Core: governança, contexto, documentação viva e quality gates.
- Product: discovery, PRD, priorização e métricas.
- Software: arquitetura, domínio, TDD, segurança, UX, integração e observabilidade.

Capabilities futuras, ativadas somente quando seus entregáveis entrarem em escopo: documents e content.

## Technology Required?

Sim. A decisão tecnológica foi fornecida e confirmada pelo humano em 2026-09-13.

## Toolchain Required?

Sim. Ver `project-stack.md` e `project-toolchain.md`.

## Approval

- Dia 0 aprovado pelo humano em 2026-09-13.
- Diretriz humana: seguir à risca os documentos fornecidos e preservá-los para consulta futura.
- Prisma 8 foi inicialmente mantido conforme a fonte, mas a decisão humana de 2026-09-15 adotou Prisma 7 estável; ver ADR-004.
