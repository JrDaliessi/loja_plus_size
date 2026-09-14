---
id: FEATURE-CATALOG
small_release: SR-MVP-01
status: requirements_approved
derived_from:
  - PRODUCT-PRD
  - PRD-FR-CAT-001
  - PRD-FR-CAT-002
  - PRD-FR-CAT-003
  - PRD-FR-VAR-001
  - PRD-FR-VAR-002
  - PRD-FR-VAR-003
depends_on:
  - ARCHITECTURE-001
  - ADR-001
  - ADR-002
  - ADR-003
affects:
  - SR-MVP-02
  - SR-MVP-03
---

# Feature PRD — Catalog Source of Truth

## Feature / Problem / User / Expected Outcome

### Feature

Fonte de verdade para produto, categoria, marca, coleção mínima, cor, tamanho, mídia e variante identificada por SKU.

### Problem

Sem um catálogo normalizado, cor+tamanho pode ser tratado como simples atributo visual, gerando SKU duplicado, preço incorreto, mídia desconectada e impossibilidade de controlar estoque por variante nas próximas releases.

### Users

- equipe de catálogo: cadastra e mantém dados;
- gestão: publica ou arquiva produtos conforme permissão;
- cliente da API pública: consulta somente produtos publicáveis;
- módulos futuros de estoque, vitrine, carrinho, pedido e marketplace: referenciam a mesma variante/SKU.

### Expected Outcome

Ao final da small release, o sistema possui uma fonte de verdade testada para catálogo e variantes, capaz de impedir combinações inválidas e fornecer contratos estáveis às releases seguintes.

Esta release não representa ainda uma loja comprável nem promete disponibilidade de estoque.

## Value

- elimina ambiguidade entre produto e variante;
- habilita estoque por SKU;
- fornece base para vitrine, busca e página de produto;
- reduz divergência futura entre site e marketplaces;
- preserva dados de moda e apresentação fiel da peça.

## Scope

### Included

- produto em estados draft, active e archived;
- categorias hierárquicas simples;
- marca opcional;
- coleção mínima para associação, sem campanhas/agendamento;
- cores e tamanhos ordenáveis;
- variante por produto+cor+tamanho;
- SKU único, barcode opcional e preço exato;
- metadados de mídia e associação opcional à variante/cor;
- regras de publicação;
- consultas administrativas e visão pública somente de itens publicáveis;
- persistence PostgreSQL/Supabase atrás de repository ports;
- integração de mídia por `MediaStoragePort`;
- contratos REST/OpenAPI necessários ao slice;
- autorização mínima obrigatória antes de expor mutações administrativas.

### Non-Scope

- quantidade, reserva ou movimentação de estoque;
- upload visual completo no painel admin;
- carrinho, checkout, pagamento, pedido ou frete;
- tabela de medidas, perfil corporal ou recomendação;
- filtros completos e busca full-text;
- banners, landing pages e agendamento de coleções;
- promoções e cupons;
- reviews, wishlist, troca e reposição;
- marketplaces;
- Redis, BullMQ ou broker;
- biblioteca visual Purple Noir completa.

## Business Rules

| ID | Regra |
|---|---|
| `FPRD-CAT001-BR-001` | Cor+tamanho identifica uma combinação única dentro do produto. |
| `FPRD-CAT001-BR-002` | Cada variante possui SKU globalmente único. |
| `FPRD-CAT001-BR-003` | SKU emitido não é reciclado para outra variante. |
| `FPRD-CAT001-BR-004` | Preço é exato, associado à variante e positivo para publicação. |
| `FPRD-CAT001-BR-005` | Barcode é opcional; quando presente, deve ser normalizado e único. |
| `FPRD-CAT001-BR-006` | Catálogo não mantém quantidade de estoque no produto ou na variante. |
| `FPRD-CAT001-BR-007` | Produto público deve cumprir a política de publicação aprovada. |
| `FPRD-CAT001-BR-008` | Mídia de variante/cor deve pertencer ao mesmo produto. |
| `FPRD-CAT001-BR-009` | URLs temporárias de Storage não são persistidas como identidade. |
| `FPRD-CAT001-BR-010` | Arquivar preserva identidade e referências; não equivale a exclusão física. |
| `FPRD-CAT001-BR-011` | Dados ausentes não são inferidos para permitir publicação. |
| `FPRD-CAT001-BR-012` | Mutações administrativas são deny-by-default e exigem permissão explícita. |

## User Journey

### `FPRD-CAT001-JRN-001` — Criar e publicar produto

1. Operador autorizado cria um produto draft.
2. Associa categoria e, opcionalmente, marca/coleção.
3. Cadastra ou escolhe cores e tamanhos.
4. Adiciona variantes com SKU e preço.
5. Registra mídia reconciliada ao Storage e texto alternativo.
6. Solicita ativação.
7. O sistema valida todas as regras e ativa ou retorna erros identificáveis.

### `FPRD-CAT001-JRN-002` — Consultar produto público

1. Consumidor consulta por slug.
2. O sistema retorna somente produto e variantes publicáveis.
3. A resposta não afirma disponibilidade de estoque.
4. Dados internos e objetos não serializáveis não atravessam o contrato.

### `FPRD-CAT001-JRN-003` — Rejeitar duplicidade

1. Operador tenta cadastrar SKU ou combinação já utilizada.
2. O domínio/banco rejeita a operação de forma atômica.
3. O adapter converte o erro para código público estável.
4. O registro existente permanece inalterado.

## Requirements

| ID | Requisito | Derived from |
|---|---|---|
| `FPRD-CAT001-RQ-001` | Criar produto em estado `DRAFT` com nome, slug, descrição e associações válidas. | `PRD-FR-CAT-001` |
| `FPRD-CAT001-RQ-002` | Atualizar conteúdo e associações de um produto sem romper invariantes. | `PRD-FR-CAT-001` |
| `FPRD-CAT001-RQ-003` | Criar e consultar categorias com slug único e parent opcional. | `PRD-FR-CAT-001` |
| `FPRD-CAT001-RQ-004` | Criar e consultar marcas e coleções mínimas. | `PRD-FR-CAT-001` |
| `FPRD-CAT001-RQ-005` | Criar e ordenar cores e tamanhos. | `PRD-FR-CAT-003` |
| `FPRD-CAT001-RQ-006` | Adicionar variante formada por produto, cor e tamanho. | `PRD-FR-VAR-001` |
| `FPRD-CAT001-RQ-007` | Garantir unicidade de SKU e combinação produto+cor+tamanho sob concorrência. | `PRD-BR-001` |
| `FPRD-CAT001-RQ-008` | Manter preço exato e barcode opcional por variante. | `PRD-FR-VAR-002` |
| `FPRD-CAT001-RQ-009` | Registrar mídia com papel, ordem, alt text e associação válida. | `PRD-FR-CAT-002` |
| `FPRD-CAT001-RQ-010` | Ativar produto somente após política de publicação satisfeita. | `PRD-FR-CAT-001`, `PRD-BR-026` |
| `FPRD-CAT001-RQ-011` | Arquivar produto/variante sem reciclar identidade. | `PRD-PP-004` |
| `FPRD-CAT001-RQ-012` | Fornecer visão administrativa completa por ID. | `CAT-001` |
| `FPRD-CAT001-RQ-013` | Fornecer visão pública por slug sem dados internos ou disponibilidade inventada. | `PRD-FR-VAR-003`, `PRD-FR-STO-003` |
| `FPRD-CAT001-RQ-014` | Listar produtos por cursor e filtros limitados ao slice. | `CAT-001` |
| `FPRD-CAT001-RQ-015` | Mapear violações de persistence para erros públicos estáveis sem depender de códigos Prisma 7. | `ADR-003` |
| `FPRD-CAT001-RQ-016` | Proteger mutações administrativas com identidade e permissão mínima antes de exposição. | `PRD-BR-024`, `ADR-002` |
| `FPRD-CAT001-RQ-017` | Manter tabelas comerciais fora da superfície Data API por padrão. | `PRD-NFR-002`, `ADR-002` |
| `FPRD-CAT001-RQ-018` | Emitir eventos internos versionados sem exigir broker. | `SRC-STACK-001` |

## Acceptance Criteria

| ID | Critério | Covers |
|---|---|---|
| `FPRD-CAT001-AC-001` | Produto válido é criado como draft e retornado por ID. | RQ-001, RQ-012 |
| `FPRD-CAT001-AC-002` | Slug duplicado é rejeitado sem alterar o produto existente. | RQ-001, RQ-003 |
| `FPRD-CAT001-AC-003` | Tamanho possui ordem explícita e não depende da ordem de criação. | RQ-005 |
| `FPRD-CAT001-AC-004` | Duas variantes do mesmo produto não podem repetir cor+tamanho, inclusive em tentativa concorrente. | RQ-006, RQ-007 |
| `FPRD-CAT001-AC-005` | Um SKU não pode identificar variantes diferentes. | RQ-007 |
| `FPRD-CAT001-AC-006` | Preço zero, negativo ou impreciso é rejeitado para variante ativa. | RQ-008 |
| `FPRD-CAT001-AC-007` | Barcode ausente é aceito; duplicado é rejeitado quando informado. | RQ-008 |
| `FPRD-CAT001-AC-008` | Mídia registra path persistente, role, posição e alt text, nunca URL temporária como identidade. | RQ-009 |
| `FPRD-CAT001-AC-009` | Mídia ligada a variante/cor de outro produto é rejeitada. | RQ-009 |
| `FPRD-CAT001-AC-010` | Produto incompleto não pode ser ativado e retorna lista de pendências. | RQ-010 |
| `FPRD-CAT001-AC-011` | Produto completo pode ser ativado atomicamente. | RQ-010 |
| `FPRD-CAT001-AC-012` | Visão pública retorna apenas produto ativo e campos publicáveis. | RQ-013 |
| `FPRD-CAT001-AC-013` | Resposta pública distingue variante ativa de disponibilidade de estoque ainda desconhecida. | RQ-013 |
| `FPRD-CAT001-AC-014` | Listagem é estável por cursor, sem duplicar ou omitir itens entre páginas no cenário testado. | RQ-014 |
| `FPRD-CAT001-AC-015` | Erros de uniqueness do banco são convertidos em códigos `CATALOG_*` estáveis. | RQ-015 |
| `FPRD-CAT001-AC-016` | Requisição sem permissão não executa mutação e não revela dados administrativos. | RQ-016 |
| `FPRD-CAT001-AC-017` | Cliente público não acessa diretamente tabelas comerciais pela Data API. | RQ-017 |
| `FPRD-CAT001-AC-018` | Eventos internos contêm ID, tipo, versão, aggregate ID e instante UTC. | RQ-018 |
| `FPRD-CAT001-AC-019` | Arquivamento retira item de novas consultas públicas e preserva identidade. | RQ-011, RQ-013 |
| `FPRD-CAT001-AC-020` | Nenhuma tabela/entidade do catálogo contém saldo de estoque. | RQ-006, `PRD-BR-003` |

## Metrics

| ID | Métrica de qualidade do slice |
|---|---|
| `FPRD-CAT001-MET-001` | Zero SKU duplicado aceito nos cenários unitário, integração e concorrente. |
| `FPRD-CAT001-MET-002` | Zero combinação produto+cor+tamanho duplicada aceita. |
| `FPRD-CAT001-MET-003` | Zero produto incompleto retornado como publicável. |
| `FPRD-CAT001-MET-004` | 100% dos requisitos da feature ligados a pelo menos um critério/teste no Dia 2. |
| `FPRD-CAT001-MET-005` | Zero endpoint administrativo implantável sem guard de identidade e permissão. |

## Dependencies

- arquitetura e ADRs deste Dia 1B aprovados;
- Node.js 24.11+ antes do scaffold Prisma 8;
- versões Prisma 8 verificadas e pinadas;
- acesso administrativo/read-only ao Supabase antes de definir migrations;
- baseline de schemas, grants, RLS, extensions e Storage;
- autorização mínima de staff antes de expor mutações;

## Risks

| ID | Risco | Tratamento |
|---|---|---|
| `FPRD-CAT001-RISK-001` | Schema Supabase existente conflitar com `app` | Baseline e ADR antes de migration. |
| `FPRD-CAT001-RISK-002` | Prisma 8 não cobrir operação necessária | Spike, adapter e decisão explícita. |
| `FPRD-CAT001-RISK-003` | Confundir variante ativa com estoque disponível | Contratos sem `available` até inventory. |
| `FPRD-CAT001-RISK-004` | Upload deixar objeto órfão ou metadado quebrado | Reconciliação e recuperação testadas. |
| `FPRD-CAT001-RISK-005` | Endpoint admin sem autorização suficiente | Gate bloqueia exposição/deploy. |
| `FPRD-CAT001-RISK-006` | Scope creep para vitrine/admin completo | Non-scope e backlog preservados. |

## Approved Decisions

1. SKU canônico em maiúsculas e comparação case-insensitive.
2. Barcode opcional e único quando informado; validação GTIN/EAN posterior ao padrão comercial real.
3. Produto admite múltiplas categorias e uma categoria principal.
4. SKU só pode mudar enquanto a variante estiver draft.
5. Política mínima de publicação descrita em `docs/domain/catalog.md`.
6. Mutações REST entram no contrato, mas não podem ser implantadas sem autorização mínima de staff.

## Approval

Status: **APROVADO PELO HUMANO EM 2026-09-14**.

O gate `REQUIREMENTS_APPROVED` desta feature está concluído. Este aceite não autoriza implementação; o Dia 2 deve primeiro derivar a estratégia de validação e os testes RED.
