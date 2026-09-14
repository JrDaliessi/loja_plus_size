# Product Requirements Document — Plus Store

## Metadata

| Campo | Valor |
|---|---|
| ID | `PRODUCT-PRD` |
| Versão | `0.1-draft` |
| Estado | `REVIEW_REQUIRED` |
| Project state | `FOUNDATION_READY` |
| Capability | `product` |
| Responsável pelo aceite | Humano responsável pelo produto |
| Derived from | `SRC-VISION-001`, `SRC-STACK-001`, `SRC-DESIGN-001`, `project-brief.md` |
| Small release proposta | `SR-MVP-01 — Catálogo e variante/SKU como fonte de verdade` |

Este documento define **o que** o produto deve entregar e **por que**. Ele não autoriza implementação, migrations ou integrações. A arquitetura e as feature specs somente podem ser derivadas após o aceite explícito deste PRD.

## Vision

Construir uma plataforma vertical de moda plus size que ajude cada cliente a encontrar roupas que sirvam, combinem com seu estilo e tenham o caimento esperado, sustentada pelo ciclo:

`medidas → recomendação → disponibilidade → compra → avaliação → troca → dados → melhor recomendação`

A plataforma deve unir experiência de compra assistida e operação comercial centralizada. Ela não é apenas uma vitrine de tamanhos maiores: deve tratar corretamente as particularidades de variantes, corpos, medidas, caimento, disponibilidade, combinações e trocas.

## Problem

Clientes de moda plus size frequentemente não conseguem responder com confiança:

- se uma peça servirá;
- como ela ficará em um corpo semelhante ao seu;
- qual é o caimento, a elasticidade e a composição;
- se o tamanho desejado realmente está disponível;
- quais peças combinam entre si.

Para a operação, cada combinação de cor e tamanho gera um SKU e estoque próprios. Catálogo, pedidos, pagamentos, trocas e canais externos não podem manter verdades divergentes.

## Target Users

### Cliente visitante

Pessoa que deseja descobrir produtos, consultar tamanho e disponibilidade, montar o carrinho e concluir a compra sem criar conta.

### Cliente recorrente

Pessoa que, nas evoluções posteriores ao MVP, poderá manter conta, pedidos, wishlist, avaliações, medidas opcionais e preferências de estilo.

### Equipe operacional

Pessoas responsáveis por catálogo, variantes, estoque, pedidos, atendimento, trocas, conteúdo e campanhas, com acesso compatível com seu papel.

### Gestão

Pessoas que precisam acompanhar vendas, demanda não atendida, estoque, trocas, comportamento por tamanho e desempenho por canal.

### Canais externos

Marketplaces, Google Merchant e Meta serão consumidores graduais do catálogo e do estoque central, nunca fontes paralelas de verdade.

## User Needs

| ID | Necessidade |
|---|---|
| `PRD-UN-001` | Encontrar rapidamente peças disponíveis no tamanho procurado. |
| `PRD-UN-002` | Entender medidas, tecido, elasticidade, comprimento e caimento antes de comprar. |
| `PRD-UN-003` | Ver a peça em fotos fiéis, inclusivas e suficientemente detalhadas. |
| `PRD-UN-004` | Comprar como visitante com preço, frete, pagamento e prazo claros. |
| `PRD-UN-005` | Receber orientação de tamanho explicável, sem promessa falsa de garantia. |
| `PRD-UN-006` | Solicitar troca de maneira simples quando tamanho ou caimento não forem adequados. |
| `PRD-UN-007` | Ser avisada de reposição somente mediante consentimento. |
| `PRD-UN-008` | Ter privacidade sobre medidas corporais, preferências e histórico. |
| `PRD-UN-009` | Operar catálogo e estoque por SKU sem divergência entre canais. |
| `PRD-UN-010` | Aprender com vendas, buscas sem resultado, wishlist, reposição e trocas. |

## Value Proposition

Uma experiência especializada de moda plus size que reduz incerteza de tamanho e caimento, preserva a apresentação real das peças e oferece à operação uma fonte central de catálogo, estoque e pedidos.

## Product Principles

| ID | Princípio |
|---|---|
| `PRD-PP-001` | A pergunta central da experiência é “essa roupa vai ficar boa em mim, no meu corpo e no meu estilo?”. |
| `PRD-PP-002` | Cor + tamanho formam uma variante comercial endereçável por SKU único. |
| `PRD-PP-003` | O estoque é controlado por SKU, nunca somente pelo produto. |
| `PRD-PP-004` | O sistema próprio é a fonte única de catálogo, estoque e pedidos. |
| `PRD-PP-005` | O checkout não exige conta de cliente. |
| `PRD-PP-006` | Medidas e preferências pessoais são opcionais, minimizadas e protegidas. |
| `PRD-PP-007` | Recomendação de tamanho é orientação explicável, não garantia de caimento. |
| `PRD-PP-008` | Regras comerciais e de estoque não ficam hard-coded no frontend. |
| `PRD-PP-009` | A fotografia mantém cores reais, diversidade corporal e protagonismo. |
| `PRD-PP-010` | Canais e integrações entram um por vez, após o commerce core estar estável. |

## Goals

### MVP

| ID | Objetivo |
|---|---|
| `PRD-GOAL-001` | Disponibilizar catálogo consultável com produtos, categorias, mídia e variantes de cor/tamanho. |
| `PRD-GOAL-002` | Manter preço e estoque consistentes por SKU. |
| `PRD-GOAL-003` | Permitir carrinho e checkout completos sem conta obrigatória. |
| `PRD-GOAL-004` | Aceitar inicialmente PIX e cartão via Mercado Pago. |
| `PRD-GOAL-005` | Calcular opções de frete por uma integração selecionada antes do respectivo slice. |
| `PRD-GOAL-006` | Gerar pedido rastreável e reconciliado com pagamento e estoque. |
| `PRD-GOAL-007` | Permitir administração mínima de catálogo, variantes, estoque e pedidos. |
| `PRD-GOAL-008` | Entregar experiência web responsiva, indexável e progressivamente instalável. |
| `PRD-GOAL-009` | Aplicar Purple Noir com acessibilidade e fotografia como protagonista. |

### Visão evolutiva

| Etapa | Resultado de produto |
|---|---|
| V1 | Conta, pedidos, wishlist, avaliações verificadas, tabelas de medidas e perfil opcional de medidas. |
| V2 | Trocas, alertas de reposição, demanda não atendida, coleções e promoções/cupons. |
| V3 | Integração gradual com marketplaces, Google Merchant e Meta. |
| V4 | CRM, campanhas consentidas, atendimento, blog, SEO útil e analytics. |
| V5 | Recomendação de tamanho, visualização em corpos diferentes, looks e personalização. |
| V6 | Assistente de moda consultando catálogo, estoque e preferências autorizadas reais. |

## Non-Goals

### Fora do MVP

- integrar todos os marketplaces simultaneamente;
- criar aplicativo móvel nativo;
- implementar recomendação de tamanho com IA;
- construir CRM e automações completas;
- adicionar Redis/BullMQ antes de existir carga assíncrona comprovada;
- adotar busca externa antes de esgotar a busca inicial em PostgreSQL;
- implementar programa de fidelidade ou indicação;
- exigir cadastro de cliente para comprar;
- prometer que uma recomendação garante caimento;
- manter estoque independente por canal;
- construir antecipadamente toda a biblioteca Purple Noir;
- oferecer Stripe sem uma decisão posterior registrada.

## Personas / Actors

| ID | Ator | Responsabilidade ou expectativa |
|---|---|---|
| `ACT-CUSTOMER-GUEST` | Cliente visitante | Descobrir, selecionar variante, comprar e acompanhar confirmação sem conta. |
| `ACT-CUSTOMER` | Cliente autenticada | Usar recursos opcionais de relacionamento nas versões posteriores. |
| `ACT-SUPPORT` | Atendimento | Consultar contexto autorizado e apoiar dúvidas/pós-venda. |
| `ACT-EDITOR` | Editor | Manter conteúdo e apresentação do catálogo conforme permissões. |
| `ACT-STOCK` | Estoque | Registrar entradas, saídas e ajustes auditáveis. |
| `ACT-MANAGER` | Gestão | Gerenciar operação e consultar indicadores autorizados. |
| `ACT-ADMIN` | Administração | Administrar módulos permitidos e configurações. |
| `ACT-SUPER-ADMIN` | Administração superior | Gerenciar papéis e ações de maior privilégio. |
| `ACT-PAYMENT` | Mercado Pago | Criar/confirmar pagamentos por chamadas e webhooks idempotentes. |
| `ACT-SHIPPING` | Provedor de frete | Retornar opções, preço e prazo segundo contrato futuro. |
| `ACT-MARKETPLACE` | Canal externo | Receber catálogo/estoque e devolver pedidos em integrações futuras. |

Os nomes de papéis são um vocabulário inicial derivado da fonte. A matriz final de permissões depende da modelagem de segurança e de aprovação específica.

## User Journeys

### `JRN-MVP-001` — Descoberta até o carrinho

1. A cliente acessa home, categoria, coleção, busca ou URL de produto.
2. Filtra ou pesquisa produtos, inclusive por tamanho disponível.
3. Abre uma página de produto com fotos, preço, atributos e variantes.
4. Escolhe cor e tamanho; o sistema identifica o SKU e informa disponibilidade.
5. Adiciona o SKU ao carrinho.

### `JRN-MVP-002` — Checkout visitante

1. A cliente revisa itens e totais.
2. Informa identificação e entrega sem criar conta.
3. Consulta opções de frete e escolhe uma delas.
4. Seleciona PIX ou cartão.
5. Revisa e confirma.
6. O sistema cria/atualiza o pedido de forma idempotente, reconcilia pagamento e estoque e apresenta confirmação rastreável.
7. A criação de conta pode ser oferecida depois, sem bloquear a compra.

### `JRN-MVP-003` — Operação de catálogo e estoque

1. Pessoa autorizada cadastra produto e dados editoriais.
2. Cadastra combinações de cor e tamanho com SKU, preço, barcode e mídia aplicável.
3. Registra estoque por SKU por meio de movimentações auditáveis.
4. Publica somente itens válidos e disponíveis conforme regras aprovadas.
5. Consulta e acompanha pedidos sem editar diretamente verdades financeiras ou de estoque.

### `JRN-V1-001` — Confiança sobre tamanho e caimento

1. A cliente consulta tabela específica da peça/fabricante.
2. Opcionalmente salva medidas e preferência de caimento.
3. Recebe orientação explicável e escolhe conscientemente o tamanho.
4. Após compra elegível, avalia tamanho e caimento.

### `JRN-V2-001` — Troca e aprendizado

1. A cliente seleciona item elegível no pedido.
2. Informa motivo estruturado, como pequeno, grande, caimento, cor ou defeito.
3. Solicita troca por outro SKU quando disponível.
4. A operação processa estados e eventual reserva sem romper a consistência do estoque.
5. Os motivos alimentam métricas de produto e recomendações futuras.

## Product Capabilities

| ID | Capacidade | Fase |
|---|---|---|
| `CAP-001` | Catálogo, categorias, marcas, coleções e mídia | MVP |
| `CAP-002` | Variantes de cor/tamanho, SKU, preço e disponibilidade | MVP |
| `CAP-003` | Estoque e movimentações por SKU | MVP |
| `CAP-004` | Vitrine, busca, filtros e página de produto | MVP |
| `CAP-005` | Carrinho visitante, checkout, frete e pagamento | MVP |
| `CAP-006` | Pedidos auditáveis | MVP |
| `CAP-007` | Administração mínima | MVP |
| `CAP-008` | Conta, pedidos, wishlist e avaliações | V1 |
| `CAP-009` | Medidas, perfil opcional e informação de caimento | V1 |
| `CAP-010` | Trocas, reposição e demanda não atendida | V2 |
| `CAP-011` | Coleções, cupons e promoções configuráveis | V2 |
| `CAP-012` | Marketplaces e catálogos externos | V3 |
| `CAP-013` | CRM, campanhas, atendimento, conteúdo e analytics | V4 |
| `CAP-014` | Recomendação, corpos diferentes, looks e personalização | V5 |
| `CAP-015` | Assistente de moda baseado em dados reais | V6 |

## MVP Scope

O MVP é o **Commerce Core** completo, entregue pelas small releases abaixo. Uma release intermediária pode validar domínio ou operação sem ainda permitir venda pública; somente o conjunto do MVP satisfaz `PRD-GOAL-001` a `PRD-GOAL-009`.

| Ordem | ID | Escopo verificável |
|---:|---|---|
| 1 | `SR-MVP-01` | Produto, categoria, mídia, cor, tamanho e variante/SKU única como fonte de verdade. |
| 2 | `SR-MVP-02` | Estoque e movimentações consistentes por SKU. |
| 3 | `SR-MVP-03` | Vitrine, categorias, busca/filtros iniciais e página de produto. |
| 4 | `SR-MVP-04` | Carrinho visitante, persistência local limitada e cálculo autoritativo de preço. |
| 5 | `SR-MVP-05` | Identificação, endereço, opções de frete e revisão do checkout. |
| 6 | `SR-MVP-06` | Mercado Pago, PIX/cartão, pedido, idempotência, estoque e confirmação. |
| 7 | `SR-MVP-07` | Administração mínima, observabilidade e preparação operacional do MVP. |
| 8 | `SR-MVP-08` | Instalabilidade/offline shell e validação PWA, sem prometer operações comerciais offline. |

Purple Noir é dependência transversal: cada release com interface implementa apenas os tokens e componentes necessários ao seu escopo.

## Business Rules

| ID | Regra |
|---|---|
| `PRD-BR-001` | Cada combinação comercial de cor e tamanho deve possuir um SKU único. |
| `PRD-BR-002` | Preço, barcode, mídia específica e disponibilidade podem variar por variante. |
| `PRD-BR-003` | Toda quantidade vendável deve ser derivada do estoque da variante/SKU. |
| `PRD-BR-004` | Toda alteração de estoque deve possuir motivo, quantidade, origem e rastreabilidade. |
| `PRD-BR-005` | O sistema deve impedir venda acima da disponibilidade confirmada segundo a política transacional aprovada. |
| `PRD-BR-006` | Preços, descontos, promoções, frete e totais finais são calculados ou validados no servidor. |
| `PRD-BR-007` | O carrinho local é conveniência; produto, preço e estoque devem ser revalidados no backend. |
| `PRD-BR-008` | A compra de visitante não depende da criação de uma conta. |
| `PRD-BR-009` | Confirmações repetidas de checkout, pagamento ou webhook não podem duplicar pedido, cobrança ou baixa de estoque. |
| `PRD-BR-010` | O estado do pedido deve ser auditável e coerente com pagamento, estoque e envio. |
| `PRD-BR-011` | Mercado Pago é o primeiro provedor; Stripe permanece uma possibilidade futura, não uma dependência do MVP. |
| `PRD-BR-012` | O provedor de frete deve ser substituível e será escolhido antes de `SR-MVP-05`. |
| `PRD-BR-013` | A tabela de medidas deve ser específica por produto ou fabricante; não há tabela universal implícita. |
| `PRD-BR-014` | Medidas pessoais e preferência de caimento são opcionais. |
| `PRD-BR-015` | Recomendações devem explicar sua base e declarar que não garantem o caimento. |
| `PRD-BR-016` | Somente uma compra elegível pode originar avaliação verificada. |
| `PRD-BR-017` | Avaliações de moda podem registrar percepção de tamanho e caimento sem exigir medidas pessoais. |
| `PRD-BR-018` | Reposição por e-mail, WhatsApp ou push exige consentimento e opção de saída aplicável. |
| `PRD-BR-019` | Trocas devem registrar motivo e manter reserva/movimentação do novo SKU consistente. |
| `PRD-BR-020` | Marketplaces recebem dados do sistema central; não mantêm um estoque independente. |
| `PRD-BR-021` | Integrações externas devem processar retries e eventos fora de ordem com segurança. |
| `PRD-BR-022` | Páginas SEO programáticas devem ter conteúdo útil; páginas vazias para ranqueamento são proibidas. |
| `PRD-BR-023` | O assistente futuro só pode recomendar produtos e disponibilidade consultados em fontes reais do sistema. |
| `PRD-BR-024` | Papéis administrativos obedecem ao menor privilégio e não usam metadata editável pelo usuário para autorização. |
| `PRD-BR-025` | Dados sensíveis não podem ser usados para segmentação ou atendimento fora do propósito autorizado. |
| `PRD-BR-026` | Dark Luxury e Light Editorial devem ser aplicados nos contextos definidos pelo Purple Noir, sem transformar toda a loja em uma superfície roxa. |

## Functional Requirements — MVP

### Catálogo e variantes

| ID | Requisito | Critério de aceite de produto | Fonte |
|---|---|---|---|
| `PRD-FR-CAT-001` | A operação deve cadastrar e manter produto, descrição, categoria, marca, coleção, atributos de moda e estado de publicação. | Um produto válido pode ser identificado e consultado sem depender de uma variante implícita. | `SRC-VISION-001` |
| `PRD-FR-CAT-002` | O produto deve aceitar mídia de frente, costas, lateral, tecido, corpo inteiro, look e vídeo quando disponíveis. | Mídias preservam ordem, tipo, associação e cor real da peça. | `SRC-VISION-001`, `SRC-DESIGN-001` |
| `PRD-FR-CAT-003` | A operação deve cadastrar cores e tamanhos aplicáveis ao catálogo. | Cor e tamanho são reutilizáveis sem eliminar a identidade da variante. | `SRC-VISION-001` |
| `PRD-FR-VAR-001` | O produto deve possuir variantes formadas por cor e tamanho. | Cada combinação pode ser selecionada e endereçada separadamente. | `SRC-VISION-001` |
| `PRD-FR-VAR-002` | Cada variante deve possuir SKU único e pode possuir preço, barcode e mídia próprios. | Duplicidade de SKU ou combinação inválida é rejeitada com mensagem clara. | `SRC-VISION-001` |
| `PRD-FR-VAR-003` | A consulta pública deve informar disponibilidade da variante escolhida. | Tamanho indisponível é reconhecível e não pode ser comprado como disponível. | `SRC-VISION-001`, `SRC-DESIGN-001` |

### Estoque

| ID | Requisito | Critério de aceite de produto | Fonte |
|---|---|---|---|
| `PRD-FR-INV-001` | O sistema deve controlar estoque por SKU. | Quantidades diferentes de variantes do mesmo produto permanecem independentes. | `SRC-VISION-001` |
| `PRD-FR-INV-002` | Entradas, saídas, reservas, baixas, cancelamentos e ajustes devem gerar movimentações auditáveis. | O saldo pode ser reconciliado a partir das operações registradas. | `SRC-VISION-001` |
| `PRD-FR-INV-003` | Operações concorrentes não podem vender a mesma última unidade mais de uma vez. | O cenário concorrente definido no plano de testes preserva saldo e pedidos válidos. | `SRC-VISION-001` |

### Vitrine, busca e produto

| ID | Requisito | Critério de aceite de produto | Fonte |
|---|---|---|---|
| `PRD-FR-STO-001` | A loja deve oferecer home, categorias, coleções aplicáveis, catálogo e página de produto indexáveis. | Conteúdo essencial é navegável, responsivo e possui URL estável. | `SRC-VISION-001`, `SRC-STACK-001` |
| `PRD-FR-STO-002` | A busca inicial deve localizar produtos e permitir filtros essenciais de tamanho, preço, cor, categoria, tecido, caimento, elasticidade, ocasião, comprimento, manga, marca, coleção, disponibilidade e promoção conforme dados existentes. | Filtros ativos alteram resultados de modo determinístico e nunca inventam atributos. | `SRC-VISION-001` |
| `PRD-FR-STO-003` | A página de produto deve apresentar preço, parcelamento aplicável, PIX aplicável, variantes, disponibilidade, fotos e atributos de moda disponíveis. | A cliente distingue claramente produto, variante selecionada, preço e estado de estoque. | `SRC-VISION-001` |
| `PRD-FR-STO-004` | Quando cadastradas, a página deve mostrar medidas da peça/modelo, caimento, elasticidade, comprimento, composição e detalhes construtivos. | Informações ausentes não são inferidas nem exibidas como fatos. | `SRC-VISION-001` |
| `PRD-FR-STO-005` | A cliente deve poder consultar frete por CEP na etapa apropriada, inclusive na página de produto quando suportado. | Opções exibem preço e prazo retornados pelo provedor e são revalidadas no checkout. | `SRC-VISION-001` |

### Carrinho, checkout, pagamento e pedido

| ID | Requisito | Critério de aceite de produto | Fonte |
|---|---|---|---|
| `PRD-FR-CART-001` | Visitantes devem manter um carrinho local limitado a SKUs e preferências necessárias. | Reabrir a experiência preserva itens dentro da política definida, sem transformar estado local em fonte autoritativa. | `SRC-STACK-001` |
| `PRD-FR-CART-002` | O backend deve revalidar SKU, disponibilidade, preço e totais antes da compra. | Divergências são apresentadas antes da confirmação e o cliente não paga um total obsoleto. | `SRC-STACK-001` |
| `PRD-FR-CHK-001` | O checkout deve percorrer identificação, entrega, pagamento, revisão e confirmação sem exigir conta. | Uma pessoa sem conta conclui uma compra válida de ponta a ponta. | `SRC-VISION-001` |
| `PRD-FR-SHP-001` | O checkout deve consultar e registrar uma opção válida de frete. | Preço, prazo e identificador do serviço usado no pedido permanecem rastreáveis. | `SRC-VISION-001`, `SRC-STACK-001` |
| `PRD-FR-PAY-001` | O MVP deve iniciar pagamento por PIX e cartão com Mercado Pago. | A operação válida retorna estado rastreável sem expor dados sensíveis desnecessários. | `SRC-VISION-001`, `SRC-STACK-001` |
| `PRD-FR-PAY-002` | Webhooks e confirmações devem ser autenticados/verificados e idempotentes. | Repetição, atraso ou reordenação não duplica os efeitos comerciais. | `SRC-STACK-001` |
| `PRD-FR-ORD-001` | O sistema deve criar pedido com itens que preservem o SKU e os valores acordados. | O pedido pode ser auditado mesmo que o catálogo mude depois. | `SRC-VISION-001` |
| `PRD-FR-ORD-002` | Estados de pedido, pagamento, estoque e envio devem ser reconciliáveis. | Falha parcial é detectável, observável e possui ação segura de recuperação. | `SRC-VISION-001`, `SRC-STACK-001` |

### Administração

| ID | Requisito | Critério de aceite de produto | Fonte |
|---|---|---|---|
| `PRD-FR-ADM-001` | Usuários autorizados devem administrar produtos, variantes, mídia, preço e publicação. | Cada ação respeita o papel e retorna resultado auditável. | `SRC-VISION-001` |
| `PRD-FR-ADM-002` | Usuários autorizados devem registrar e consultar estoque por SKU. | Nenhum ajuste ocorre sem motivo e rastreabilidade. | `SRC-VISION-001` |
| `PRD-FR-ADM-003` | Usuários autorizados devem consultar pedidos e seus estados. | Dados pessoais e ações disponíveis são limitados por papel. | `SRC-VISION-001` |
| `PRD-FR-ADM-004` | Configurações comerciais previstas, como desconto PIX quando ativado, não devem exigir mudança no frontend. | Alterar uma configuração autorizada modifica o cálculo no servidor e é auditável. | `SRC-VISION-001` |

### Experiência e PWA

| ID | Requisito | Critério de aceite de produto | Fonte |
|---|---|---|---|
| `PRD-FR-UX-001` | A interface deve aplicar Purple Noir com Dark Luxury em header, hero, autenticação, conta/admin e campanhas; Light Editorial em catálogo, produto, busca e conteúdo extenso. | As superfícies seguem seu papel visual e a fotografia continua protagonista. | `SRC-DESIGN-001` |
| `PRD-FR-UX-002` | Seleção de tamanho, indisponibilidade, foco, erro e sucesso devem ser comunicados além da cor. | O fluxo funciona por teclado e possui rótulos/estados compreensíveis. | `SRC-DESIGN-001` |
| `PRD-FR-UX-003` | A aplicação deve ser responsiva e atender contraste aplicável. | A combinação originalmente proposta de branco sobre `#8B5CF6` não é usada para texto normal sem tratamento que passe o gate WCAG. | `SRC-DESIGN-001` |
| `PRD-FR-PWA-001` | A loja deve ser preparada como PWA e validar instalabilidade e offline shell antes de anunciar suporte. | Operações comerciais não são apresentadas como offline sem teste e estratégia explícitos. | `SRC-STACK-001` |

## Future Functional Requirements

Estas capacidades preservam a visão completa, mas não autorizam implementação durante o MVP correspondente a outras fases.

| ID | Fase | Requisito de alto nível | Fonte |
|---|---|---|---|
| `PRD-FUT-001` | V1 | Conta opcional, histórico de pedidos e merge seguro do carrinho. | `SRC-VISION-001`, `SRC-STACK-001` |
| `PRD-FUT-002` | V1 | Wishlist e indicadores agregados de intenção. | `SRC-VISION-001` |
| `PRD-FUT-003` | V1 | Avaliações verificadas com percepção de tamanho e caimento. | `SRC-VISION-001` |
| `PRD-FUT-004` | V1 | Tabelas de medidas específicas e perfil opcional de medidas/caimento. | `SRC-VISION-001` |
| `PRD-FUT-005` | V2 | Portal de trocas com motivos estruturados e troca por SKU. | `SRC-VISION-001` |
| `PRD-FUT-006` | V2 | Alertas de reposição consentidos e painel de demanda não atendida. | `SRC-VISION-001` |
| `PRD-FUT-007` | V2 | Coleções, lançamentos, cupons e promoções configuráveis. | `SRC-VISION-001` |
| `PRD-FUT-008` | V3 | Integração incremental com Mercado Livre e Shopee usando estoque central. | `SRC-VISION-001` |
| `PRD-FUT-009` | V3 | Feeds/catálogos para Google Merchant e Meta/Instagram. | `SRC-VISION-001` |
| `PRD-FUT-010` | V4 | CRM, segmentação consentida e recuperação moderada de carrinho. | `SRC-VISION-001` |
| `PRD-FUT-011` | V4 | WhatsApp contextual, atendimento assistido, blog e SEO útil. | `SRC-VISION-001` |
| `PRD-FUT-012` | V4 | Analytics de conversão, margem, demanda, tamanho, troca, coleção e canal. | `SRC-VISION-001` |
| `PRD-FUT-013` | V5 | Recomendação explicável de tamanho e indicação de incerteza. | `SRC-VISION-001` |
| `PRD-FUT-014` | V5 | Visualização da peça em modelos/corpos diferentes. | `SRC-VISION-001` |
| `PRD-FUT-015` | V5 | Outfits administráveis, preço de look, cross-sell e personalização opcional. | `SRC-VISION-001` |
| `PRD-FUT-016` | V6 | Assistente de moda limitado ao catálogo, estoque e preferências autorizadas reais. | `SRC-VISION-001` |
| `PRD-FUT-017` | Futuro | Fidelidade e indicação com benefícios auditáveis. | `SRC-VISION-001` |

## Non-Functional Requirements

| ID | Categoria | Requisito |
|---|---|---|
| `PRD-NFR-001` | Arquitetura | TypeScript ponta a ponta em monorepo pnpm + Turborepo. |
| `PRD-NFR-002` | Fronteiras | Next.js entrega experiência/SEO; NestJS concentra regras comerciais e integrações; a web não acessa o banco diretamente. |
| `PRD-NFR-003` | Contratos | Comunicação web/API via REST documentada por OpenAPI; schemas públicos permanecem sincronizados. |
| `PRD-NFR-004` | Dados | PostgreSQL/Supabase é a persistência relacional; Prisma 8 permanece condicionado ao pin e validação da RC. |
| `PRD-NFR-005` | Segurança | Autenticação usa Supabase Auth e o NestJS valida identidade/autorização antes de operações protegidas. |
| `PRD-NFR-006` | Privacidade | Dados pessoais e medidas seguem minimização, finalidade, consentimento, retenção e exclusão aplicáveis à LGPD. |
| `PRD-NFR-007` | Acessibilidade | Navegação por teclado, foco, rótulos, mensagens e contraste devem atender WCAG aplicável. |
| `PRD-NFR-008` | SEO | Produtos, categorias e conteúdo relevante devem ser indexáveis, com metadata e URLs coerentes. |
| `PRD-NFR-009` | Performance | A experiência deve priorizar carregamento rápido, imagens otimizadas e evitar JavaScript cliente sem necessidade. |
| `PRD-NFR-010` | Resiliência | Pagamento, estoque, pedidos e webhooks devem tolerar retry e falha parcial sem duplicação. |
| `PRD-NFR-011` | Observabilidade | Fluxos críticos devem possuir logs estruturados, correlação e captura de erros suficiente para diagnóstico. |
| `PRD-NFR-012` | Qualidade | Mudanças de comportamento seguem TDD; lint, type-check, testes e build devem permanecer verdes. |
| `PRD-NFR-013` | Dependências | Versões devem ser fixadas e o lockfile versionado; dependências futuras só entram quando a release exigir. |
| `PRD-NFR-014` | Compatibilidade | A experiência deve ser responsiva e validada em navegadores/dispositivos definidos na estratégia do Dia 2/6. |
| `PRD-NFR-015` | Conteúdo visual | Imagens não devem receber tratamento que distorça a cor real das peças. |

## Security / Privacy

- Chaves secretas e `service_role` nunca podem ser expostas ao navegador ou versionadas.
- O cliente público usará a chave publishable; a chave `anon` legada não é requisito novo.
- Toda tabela exposta pela Data API deverá possuir RLS e políticas testadas.
- `TO authenticated` isoladamente não é autorização de linha.
- Autorização não pode depender de `user_metadata` editável; papéis devem ficar em dados controlados pela aplicação ou metadata apropriada.
- Views e funções privilegiadas exigem revisão específica; `SECURITY DEFINER` não será atalho para falhas de permissão.
- Endereços, histórico de compra, identidade, medidas corporais e preferências terão acesso e retenção proporcionais à finalidade.
- Dados de pagamento brutos não devem ser armazenados quando o provedor oferece tokenização/identificadores seguros.
- Webhooks exigem verificação de origem/assinatura, idempotência, proteção contra replay e observabilidade.
- Administração e ações críticas exigem RBAC, menor privilégio e trilha de auditoria.

## Success Metrics / Analytics

O MVP deve instrumentar definições antes de estabelecer metas numéricas. Baselines serão coletadas após tráfego real; valores não serão inventados.

| ID | Métrica | Definição inicial |
|---|---|---|
| `PRD-MET-001` | Conversão | Pedidos válidos concluídos / sessões elegíveis. |
| `PRD-MET-002` | Conclusão de checkout | Checkouts confirmados / checkouts iniciados. |
| `PRD-MET-003` | Disponibilidade por tamanho | SKUs disponíveis / SKUs publicáveis, segmentados por tamanho. |
| `PRD-MET-004` | Busca sem resultado | Buscas normalizadas com zero resultado / buscas válidas. |
| `PRD-MET-005` | Abandono de carrinho | Carrinhos elegíveis sem checkout dentro da janela aprovada. |
| `PRD-MET-006` | Integridade de estoque | Divergências confirmadas entre saldo e movimentos. Meta operacional: zero divergência não explicada. |
| `PRD-MET-007` | Integridade de pedido/pagamento | Pagamentos confirmados sem pedido coerente ou pedidos duplicados. Meta operacional: zero caso não reconciliado. |
| `PRD-MET-008` | Desempenho web | Core Web Vitals definidos no gate técnico, medidos por página-chave. |
| `PRD-MET-009` | Acessibilidade | Falhas críticas/altas nas jornadas essenciais. Meta de release: zero falha crítica. |
| `PRD-MET-010` | Taxa de troca | Itens trocados / itens elegíveis vendidos, segmentados por produto, SKU e motivo; entra em V2. |
| `PRD-MET-011` | Correspondência de tamanho | Percentual de avaliações verificadas “certo”; entra em V1. |
| `PRD-MET-012` | Demanda não atendida | Alertas de reposição e buscas zero agregados por atributo/SKU; entra em V2/V4. |

## Dependencies

- Node.js 24 LTS antes do scaffold.
- pnpm, Turborepo e repositório Git já preparados no nível de governança.
- Next.js 16.3.x, NestJS, Prisma 8 RC pinado, PostgreSQL/Supabase, Auth e Storage.
- Acesso administrativo autorizado ao projeto Supabase `olkadbgumpiybehslobk` antes de baseline, schema ou migrations.
- Conta e credenciais seguras do Mercado Pago antes de `SR-MVP-06`.
- Provedor de frete escolhido antes de `SR-MVP-05`.
- Hospedagem do NestJS escolhida antes da primeira implantação integrada.
- Conteúdo e fotografia reais antes da validação editorial da vitrine.

## Constraints

- Seguir as fontes preservadas e registrar qualquer divergência como mudança de escopo.
- Entregar por small releases e não construir a visão V1–V6 em um único lote.
- Manter Next.js separado do backend NestJS.
- Manter regras centrais de comércio no backend.
- Usar Mercado Pago primeiro; Stripe é opcional.
- Não exigir conta no checkout.
- Preservar Purple Noir, combinando Dark Luxury e Light Editorial.
- Não usar roxo como fundo dominante nem efeitos que disputem atenção com a fotografia.
- Não selecionar silenciosamente provedor de frete, hospedagem do backend ou primeiro marketplace.

## Risks

| ID | Risco | Impacto | Tratamento |
|---|---|---|---|
| `PRD-RISK-001` | Escopo completo muito amplo | Atraso e validação tardia | Small releases MVP → V6, sem avanço automático. |
| `PRD-RISK-002` | Prisma 8 ainda RC | Mudança de API ou lacuna funcional | Pin exato, spike/teste do primeiro slice e ADR se houver desvio. |
| `PRD-RISK-003` | Ambiente em Node.js 22 | Scaffold incompatível | Atualizar/selecionar Node.js 24 antes de instalar. |
| `PRD-RISK-004` | Supabase ainda sem acesso administrativo | Schema/RLS desconhecidos | Baseline read-only antes de qualquer migration. |
| `PRD-RISK-005` | Concorrência de estoque | Venda acima da disponibilidade | Modelo transacional e testes concorrentes antes do checkout. |
| `PRD-RISK-006` | Retry/falha de pagamento e webhook | Cobrança, pedido ou baixa duplicados | Idempotência, reconciliação e observabilidade. |
| `PRD-RISK-007` | Dados de medidas e CRM | Exposição ou uso fora da finalidade | Recurso opcional, minimização e governança LGPD. |
| `PRD-RISK-008` | Conteúdo/fotos insuficientes | Baixa confiança e fidelidade visual | Critérios editoriais e campos ausentes sem inferência. |
| `PRD-RISK-009` | Contraste do CTA original | Falha de acessibilidade | Ajustar combinação/tamanho/peso e validar antes do componente. |
| `PRD-RISK-010` | Integrações multicanal prematuras | Divergência operacional | Loja própria, primeiro canal e segundo canal em sequência. |

## Open Questions

Estas decisões não bloqueiam o aceite do Product PRD, mas bloqueiam suas releases correspondentes:

| ID | Decisão necessária | Prazo limite |
|---|---|---|
| `PRD-OQ-001` | Nome comercial definitivo e domínio. | Antes da publicação pública/SEO definitivo. |
| `PRD-OQ-002` | Provedor inicial de frete. | Antes de `SR-MVP-05`. |
| `PRD-OQ-003` | Hospedagem do NestJS. | Antes da implantação integrada. |
| `PRD-OQ-004` | Política de reserva e expiração de estoque durante pagamento. | Antes da spec de checkout/pagamento. |
| `PRD-OQ-005` | Política comercial de desconto PIX e parcelamento. | Antes de `SR-MVP-06`. |
| `PRD-OQ-006` | Política de troca, prazos e elegibilidade. | Antes da feature de trocas V2. |
| `PRD-OQ-007` | Primeiro marketplace externo. | Antes da V3. |
| `PRD-OQ-008` | Metas numéricas de negócio após baseline real. | Após instrumentação inicial. |
| `PRD-OQ-009` | Matriz final de papéis administrativos. | Antes do admin operacional. |

## Out of Scope

Além dos non-goals do MVP, este PRD não define:

- nomes de tabelas, colunas ou migrations;
- endpoints finais e payloads REST;
- componentes React ou layout detalhado;
- política transacional exata de reserva de estoque;
- contrato técnico do Mercado Pago ou provedor de frete;
- arquitetura de deploy do NestJS;
- metas comerciais sem baseline;
- conteúdo, preço, estoque ou fotografia fictícios para produção.

Esses assuntos serão tratados por arquitetura, ADR, feature PRD, feature spec e estratégia de validação no momento adequado.

## Roadmap Relationship

```text
PRODUCT-PRD
  → SR-MVP-01 Catálogo e variantes
  → SR-MVP-02 Estoque
  → SR-MVP-03 Vitrine e produto
  → SR-MVP-04 Carrinho
  → SR-MVP-05 Checkout e frete
  → SR-MVP-06 Pagamento e pedido
  → SR-MVP-07 Admin e operação
  → SR-MVP-08 PWA validada
  → V1 Confiança e relacionamento
  → V2 Pós-venda e merchandising
  → V3 Omnichannel
  → V4 Operação orientada a dados
  → V5 Diferenciais de moda plus size
  → V6 Assistente de moda com IA
```

A primeira small release proposta é `SR-MVP-01`, pois estabelece a identidade de produto, variante e SKU necessária para estoque, vitrine, carrinho, pedidos e canais futuros.

## Requirements Approval Checklist

- [ ] Visão e problema representam o produto desejado.
- [ ] Público, necessidades e proposta de valor estão corretos.
- [ ] Escopo do MVP está aprovado.
- [ ] Separação MVP/V1–V6 está aprovada.
- [ ] Regras centrais de variante/SKU e estoque estão aprovadas.
- [ ] Checkout visitante e Mercado Pago como primeiro provedor estão aprovados.
- [ ] Direção Purple Noir está preservada.
- [ ] Requisitos de privacidade, segurança e acessibilidade estão aprovados.
- [ ] `SR-MVP-01` está aprovada como primeira small release.
- [ ] Open questions podem permanecer adiadas nos prazos registrados.

## Approval

Status: **PENDENTE DE REVISÃO HUMANA**.

Para atingir o gate `REQUIREMENTS_APPROVED`, o humano deve aprovar explicitamente este PRD ou solicitar correções. Somente depois disso poderão ser produzidos `architecture.md`, eventuais ADRs e o Feature PRD/Spec de `SR-MVP-01`.
