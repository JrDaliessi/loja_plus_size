# Backlog

Estados válidos: `IDEA`, `DISCOVERY`, `READY`, `IN_PROGRESS`, `DONE`, `BLOCKED`, `DROPPED`.

## Product Backlog

| ID | Tipo | Item / valor | Prioridade | Dependências | Pronto quando | Estado |
|---|---|---|---|---|---|---|
| PROD-001 | Épico | Commerce Core: permitir venda completa sem conta obrigatória | P0 | PRD, arquitetura | pedido pago e rastreável com estoque consistente | DISCOVERY |
| SUPA-001 | Technical Foundation | Vincular e auditar o projeto Supabase existente | P0 | acesso autorizado | projeto, schema, migrations e advisors inspecionados sem mutação | DONE |
| PRISMA-001 | Spike | Validar Prisma 8 RC no primeiro slice | P0 | Node 24.11+, Supabase baseline | CRUD, constraints, transação, erros e migration validados com versões pinadas | DONE |
| PRISMA-002 | Technical Foundation | Substituir Prisma 8 RC por Prisma 7 estável | P0 | PRISMA-001, aprovação humana | versão estável pinada, migration/spike validados e auditoria limpa | DONE |
| DEBT-DEP-001 | Dívida Técnica | Remover `glob@10.5.0` deprecated da árvore de cobertura Jest | P3 | atualização upstream de `test-exclude`/Jest | instalação sem a versão deprecated e regressão verde | READY |
| SEC-BASE-001 | Security Item | Validar identidade Supabase e permissões mínimas de staff | P0 | acesso Supabase, arquitetura aprovada | mutações admin negam por padrão e passam testes de autorização | DISCOVERY |
| DS-001 | UX Improvement | Purple Noir: tokens, Dark Luxury, Light Editorial e componentes acessíveis | P0 | arquitetura, critérios WCAG | componentes do slice aplicam identidade e passam contraste/teclado | DISCOVERY |
| CAT-001 | Feature | Catálogo com produto, mídia, categoria, marca e coleção | P0 | PROD-001 | CRUD e consulta passam nos critérios | READY |
| VAR-001 | Feature | Variante cor+tamanho com SKU, preço, barcode, mídia e disponibilidade | P0 | CAT-001 | cada combinação é endereçável e única | READY |
| INV-001 | Feature | Estoque e movimentos por SKU como fonte única | P0 | VAR-001 | nenhuma operação vende quantidade indisponível | IDEA |
| STO-001 | Feature | Vitrine, categorias e página de produto rica | P0 | CAT-001, VAR-001, DS-001 | produto indexável mostra preço, variantes e conteúdo | IDEA |
| SEA-001 | Feature | Busca e filtros por tamanho, preço, cor, categoria, tecido, caimento e ocasião | P0 | CAT-001, VAR-001 | consultas essenciais retornam resultados corretos | IDEA |
| CART-001 | Feature | Carrinho visitante local com merge após login | P0 | VAR-001, INV-001 | itens e totais persistem e reconciliam com servidor | IDEA |
| CHK-001 | Feature | Checkout sem conta obrigatória | P0 | CART-001 | identificação, entrega, revisão e confirmação funcionam | IDEA |
| SHP-001 | Feature | Cálculo de frete via provider | P0 | CHK-001 | opções, preço e prazo são validados | IDEA |
| PAY-001 | Feature | Mercado Pago com PIX e cartão | P0 | CHK-001, INV-001 | criação e confirmação idempotentes geram pedido correto | IDEA |
| ORD-001 | Feature | Pedidos e itens com estados auditáveis | P0 | PAY-001 | ciclo crítico possui testes e observabilidade | IDEA |
| ADM-001 | Épico | Admin mínimo para catálogo, variantes, estoque e pedidos | P0 | CAT-001, INV-001, ORD-001, DS-001 | papéis autorizados operam os módulos essenciais | IDEA |
| AUTH-001 | Feature | Supabase Auth e RBAC controlado pela aplicação | P1 | arquitetura de segurança | sessão e autorização passam nos testes/RLS | IDEA |
| SIZE-001 | Feature | Tabela de medidas específica por produto/fabricante | P1 | CAT-001 | medidas são exibidas sem tabela universal implícita | IDEA |
| PROF-001 | Feature | Perfil opcional de medidas e preferência de caimento | P1 | AUTH-001, SIZE-001 | consentimento e privacidade validados | IDEA |
| REV-001 | Feature | Avaliações verificadas de tamanho e caimento | P1 | ORD-001 | somente compra elegível avalia; agregados são corretos | IDEA |
| WISH-001 | Feature | Wishlist e indicadores de intenção | P1 | AUTH-001, CAT-001 | cliente salva itens e admin vê agregados permitidos | IDEA |
| EXC-001 | Épico | Portal de trocas por tamanho/caimento/defeito | P1 | ORD-001, INV-001 | solicitação, reserva e estados são consistentes | IDEA |
| REST-001 | Feature | Alerta de reposição por variante | P1 | INV-001 | inscrição e notificação respeitam consentimento | IDEA |
| DEM-001 | Feature | Painel de demanda não atendida | P1 | REST-001, SEA-001 | agrega alertas e buscas zero sem dados inventados | IDEA |
| COL-001 | Feature | Coleções, lançamentos, banners e landing pages | P1 | CAT-001 | coleção programada publica artefatos associados | IDEA |
| PROMO-001 | Épico | Cupons, desconto PIX, promoção de look e frete grátis em regras de servidor | P1 | CART-001, PAY-001 | regras combinam de forma determinística e testada | IDEA |
| MKT-001 | Épico | Integração incremental com marketplaces | P2 | INV-001, ORD-001 | canal sincroniza catálogo, estoque e pedidos idempotentemente | IDEA |
| GM-001 | Feature | Feed Google Merchant | P2 | CAT-001, INV-001 | feed válido contém dados exigidos | IDEA |
| META-001 | Feature | Catálogo Meta/Instagram | P2 | CAT-001, INV-001 | produtos publicados permanecem consistentes | IDEA |
| CRM-001 | Épico | CRM, segmentos e campanhas consentidas | P2 | AUTH-001, ORD-001 | segmentos são auditáveis e obedecem privacidade | IDEA |
| ABAND-001 | Feature | Recuperação moderada de carrinho abandonado | P2 | CART-001, CRM-001 | cadência, opt-out e limite de mensagens são validados | IDEA |
| WAPP-001 | Feature | WhatsApp contextual e atendimento assistido | P2 | CAT-001, CRM-001 | mensagem inclui somente contexto autorizado | IDEA |
| BLOG-001 | Épico | Blog integrado com papéis autor/editor/admin | P2 | AUTH-001 | conteúdo possui revisão, SEO e produto relacionado | IDEA |
| SEO-001 | Feature | SEO programático com páginas úteis, não vazias | P2 | SEA-001, BLOG-001 | páginas satisfazem critério editorial e técnico | IDEA |
| ANA-001 | Épico | Analytics comercial e de moda | P2 | eventos dos módulos | métricas têm definição, origem e reconciliação | IDEA |
| FIT-001 | Feature | Recomendação explicável de tamanho | P2 | SIZE-001, PROF-001, REV-001, EXC-001 | recomenda sem prometer garantia e registra incerteza | IDEA |
| BODY-001 | Feature | Visualização da peça em corpos/tamanhos diferentes | P2 | CAT-001 | mídia correta muda por modelo/tamanho | IDEA |
| LOOK-001 | Épico | Monte o Look, preço conjunto e cross-sell | P2 | CAT-001, PROMO-001 | outfit administrável adiciona SKUs disponíveis | IDEA |
| PERS-001 | Feature | Preferências de estilo e home personalizada | P3 | PROF-001, LOOK-001 | personalização é opcional e explicável | IDEA |
| LOY-001 | Feature | Fidelidade e indicação | P3 | ORD-001, PROMO-001 | pontos e benefícios são auditáveis | IDEA |
| AI-001 | Feature | Assistente de moda baseado no catálogo real | P3 | FIT-001, LOOK-001, INV-001 | respostas não inventam estoque/produtos | IDEA |
| PWA-001 | Feature | Instalabilidade, offline shell e push | P2 | STO-001, REST-001 | comportamento é validado em mobile e offline | IDEA |

## Phase Backlog — próximo ciclo

| Ordem | ID | Ação | Gate |
|---:|---|---|---|
| 1 | GOV-001 | Aprovar Dia 0 | DONE |
| 2 | ENV-001 | Selecionar/instalar Node.js 24.11+ | DONE — 24.21.0 |
| 3 | SUPA-001 | Autorizar a conexão atual ao projeto `olkadbgumpiybehslobk` e executar baseline read-only | DONE |
| 4 | PRD-001 | Product PRD criado e aprovado | DONE |
| 5 | ARC-001 | Arquitetura inicial e ADRs aprovados | DONE |
| 6 | FPRD-CAT-001 | Requisitos da primeira small release aprovados | DONE |
| 7 | FSPEC-CAT-001 | Spec da primeira small release aprovada | DONE |
| 8 | TEST-CAT-001 | Matriz 20/20, fixtures e RED unitário | DONE |
| 9 | TEST-CAT-002 | RED PostgreSQL/Supabase de constraints, concorrência e acesso | DONE |
| 10 | PRISMA-001 | Executar spike do Prisma 8 antes de persistence | DONE — riscos RC documentados |
| 11 | PRISMA-002 | Migrar para Prisma 7 estável e repetir gates do Dia 2 | DONE — ADR-004, versão 7.10.0 e auditoria limpa |
| 12 | SEC-BASE-001 | Definir e testar autorização mínima de staff | segurança validada |
| 13 | DS-001 | Derivar tokens e critérios acessíveis quando o primeiro slice de UI entrar | VALIDATION_READY |

## Artifact/Feature Backlog — SR-MVP-01

| ID | Entregável | Dependência | Estado |
|---|---|---|---|
| PRODUCT-PRD | `docs/product/prd.md` | aprovação humana do conteúdo | DONE |
| ARCHITECTURE | `architecture.md` | aprovação humana dos ADRs | DONE |
| FEATURE-CATALOG | `docs/features/FEATURE-CATALOG/` | testes RED completos | VALIDATION_READY |
| TEST-CATALOG | matriz, fixtures e cenários RED | Supabase/PostgreSQL isolado | DONE |

## Política de priorização

Valor → redução de risco → dependência arquitetural → habilitação → tamanho → fase → urgência real.
