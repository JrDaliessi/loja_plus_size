# Catalog Domain Model — SR-MVP-01

## Metadata

| Campo | Valor |
|---|---|
| ID | `DOMAIN-CATALOG-001` |
| Estado | `APPROVED` |
| Derived from | `PRD-FR-CAT-001..003`, `PRD-FR-VAR-001..003`, `PRD-BR-001..004`, `CAT-001`, `VAR-001` |
| Affects | `FEATURE-CATALOG`, `SR-MVP-02`, `SR-MVP-03` |

## Purpose

Definir o vocabulário, limites e invariantes do catálogo antes de persistence e API. O modelo cobre a fonte de verdade de produto e variante/SKU; quantidade de estoque pertence ao módulo `inventory` e está fora desta release.

## Ubiquitous Language

| Termo | Definição |
|---|---|
| Produto | Conceito editorial e comercial compartilhado entre suas variantes. |
| Variante | Combinação vendável de um produto, cor e tamanho. |
| SKU | Identificador comercial único e estável de uma variante. |
| Cor | Opção visual normalizada usada para formar variantes e filtros. |
| Tamanho | Opção ordenável, como G1–G5, usada para formar variantes. |
| Categoria | Classificação navegável do produto. |
| Marca | Fabricante ou marca associada ao produto, quando informada. |
| Coleção | Agrupamento comercial/editorial mínimo; campanhas, banners e agendamento ficam para release posterior. |
| Mídia de produto | Metadado de foto ou vídeo relacionado ao produto e opcionalmente a uma variante/cor. |
| Produto publicável | Produto que satisfaz os critérios mínimos aprovados para exposição pública. |
| Variante ativa | Variante válida para consulta; disponibilidade vendável depende do módulo de estoque. |

## Aggregate Boundaries

### Product aggregate

`Product` é a raiz de consistência para identidade editorial, associações e composição de variantes.

```text
Product
  id
  name
  slug
  description
  status
  categoryIds
  brandId?
  collectionIds
  fashionAttributes
  variants[]
  media[]
  createdAt
  updatedAt
```

O modelo não exige carregar todas as coleções em memória para toda operação; a fronteira é conceitual e os casos de uso podem persistir relações de forma incremental mantendo invariantes.

### Reference entities

- `Category`: identidade, nome, slug, parentId opcional, status e ordem.
- `Brand`: identidade, nome, slug e status.
- `Collection`: identidade, nome, slug e status mínimo.
- `Color`: identidade, nome, slug, valor visual opcional e ordem.
- `Size`: identidade, código, rótulo, ordem e status.

### ProductVariant

```text
ProductVariant
  id
  productId
  colorId
  sizeId
  sku
  barcode?
  price
  status
  createdAt
  updatedAt
```

`ProductVariant` não possui campo de quantidade no catálogo. Saldo, reserva e disponibilidade comercial serão fornecidos pelo módulo `inventory` em `SR-MVP-02`.

### ProductMedia

```text
ProductMedia
  id
  productId
  variantId?
  colorId?
  kind: IMAGE | VIDEO
  role: FRONT | BACK | SIDE | FABRIC | FULL_BODY | LOOK | DETAIL | OTHER
  storagePath
  altText
  position
  width?
  height?
  status
```

Um objeto de Storage e seu metadado devem poder ser reconciliados. URLs temporárias/assinadas não são identidade persistida.

## Value Objects

### `Sku`

- não vazio após trim;
- normalização de comparação definida antes da persistence;
- único globalmente;
- não é derivado novamente após emissão se isso quebrar integrações futuras.

### `Slug`

- não vazio e URL-safe;
- único dentro do tipo de recurso aplicável;
- alterações futuras devem preservar estratégia de redirect quando o recurso já for público.

### `Money`

- quantidade exata e moeda ISO;
- preço da variante deve ser maior que zero para publicação;
- DTO usa decimal serializável, nunca ponto flutuante como autoridade.

### `DisplayOrder`

- inteiro não negativo;
- ordena tamanhos, mídia e referências sem depender de ordem de criação.

## Product States

```text
DRAFT -> ACTIVE -> ARCHIVED
  ^        |
  +--------+  correção controlada para draft, se não houver conflito operacional
```

- `DRAFT`: editável e não público.
- `ACTIVE`: candidato à consulta pública quando satisfaz critérios de publicação.
- `ARCHIVED`: preservado para rastreabilidade e indisponível para novos usos.

Exclusão física de produto/variante utilizado por pedidos futuros será proibida; a regra completa entra com o módulo de pedidos.

## Variant States

```text
DRAFT -> ACTIVE -> ARCHIVED
```

Estado `ACTIVE` não significa “em estoque”. O módulo de catálogo descreve validade e exposição; o módulo de estoque determina disponibilidade vendável.

## Invariants

| ID | Invariante | Origem |
|---|---|---|
| `CAT-INV-001` | `sku` é único globalmente. | `PRD-BR-001` |
| `CAT-INV-002` | A combinação `(productId, colorId, sizeId)` é única. | `PRD-BR-001`, `PRD-FR-VAR-001` |
| `CAT-INV-003` | Variante sempre pertence exatamente a um produto, uma cor e um tamanho. | `PRD-FR-VAR-001` |
| `CAT-INV-004` | Preço autoritativo é exato, possui moeda e deve ser positivo para variante ativa/publicável. | `PRD-BR-002`, `PRD-BR-006` |
| `CAT-INV-005` | Barcode, quando presente, é normalizado e único conforme política aprovada. | `PRD-BR-002` |
| `CAT-INV-006` | Quantidade de estoque não é mantida em Product ou ProductVariant. | `PRD-BR-003` |
| `CAT-INV-007` | Mídia pertence ao produto; associação a variante ou cor não pode apontar para outro produto. | `PRD-FR-CAT-002` |
| `CAT-INV-008` | `position` da mídia é determinística no seu escopo. | `PRD-FR-CAT-002` |
| `CAT-INV-009` | Slugs ativos não colidem dentro do tipo de recurso. | `PRD-FR-STO-001` |
| `CAT-INV-010` | Informação ausente não é inventada para tornar produto publicável. | `PRD-FR-STO-004` |
| `CAT-INV-011` | Cor real da mídia não é alterada por regra de catálogo ou tema. | `PRD-NFR-015` |
| `CAT-INV-012` | Archiving preserva identidade e referências; não recicla SKU. | Fonte única e integração futura |

## Approved Publication Policy

Esta política foi aprovada no Dia 1B em 2026-09-14.

Um produto pode se tornar `ACTIVE` somente quando possuir:

1. nome, slug e descrição não vazios;
2. ao menos uma categoria ativa;
3. ao menos uma mídia ativa com texto alternativo;
4. ao menos uma variante ativa com SKU, cor, tamanho e preço válido;
5. todas as associações referenciadas ativas;
6. nenhuma violação de unicidade.

Disponibilidade de estoque não faz parte dessa transição. Na vitrine, a política futura decidirá se produto sem saldo permanece visível como esgotado.

## Use Cases — SR-MVP-01

| ID | Caso de uso | Resultado |
|---|---|---|
| `CAT-UC-001` | CreateProductDraft | Cria produto em draft com identidade e conteúdo básico válidos. |
| `CAT-UC-002` | UpdateProductDetails | Atualiza conteúdo sem violar identidade ou publicação. |
| `CAT-UC-003` | CreateCategory | Cria categoria navegável com slug único. |
| `CAT-UC-004` | CreateBrand | Cria marca opcional reutilizável. |
| `CAT-UC-005` | CreateCollection | Cria agrupamento mínimo sem campanha/agendamento. |
| `CAT-UC-006` | CreateColor | Cria opção de cor normalizada. |
| `CAT-UC-007` | CreateSize | Cria opção de tamanho com ordenação explícita. |
| `CAT-UC-008` | AddProductVariant | Adiciona combinação cor+tamanho com SKU e preço. |
| `CAT-UC-009` | UpdateProductVariant | Altera dados permitidos sem reciclar identidade/SKU silenciosamente. |
| `CAT-UC-010` | AttachProductMedia | Registra mídia reconciliada ao Storage. |
| `CAT-UC-011` | ReorderProductMedia | Atualiza ordem de forma determinística. |
| `CAT-UC-012` | ActivateProduct | Valida política e publica o produto. |
| `CAT-UC-013` | ArchiveProduct | Retira produto de novos usos preservando rastreabilidade. |
| `CAT-UC-014` | GetProductById | Retorna visão administrativa do agregado. |
| `CAT-UC-015` | GetProductBySlug | Retorna visão publicável, sem dados internos. |
| `CAT-UC-016` | ListCatalogProducts | Lista produtos por cursor e filtros aprovados do slice. |

## Domain Events

Eventos são contratos internos simples no início; não implicam BullMQ ou broker.

- `ProductDraftCreated`
- `ProductDetailsUpdated`
- `ProductVariantAdded`
- `ProductVariantUpdated`
- `ProductMediaAttached`
- `ProductActivated`
- `ProductArchived`

Cada evento possui `eventId`, `occurredAt`, `aggregateId`, `eventType`, versão e payload mínimo. Persistência/outbox só será adicionada quando um consumidor real exigir garantia assíncrona.

## Repository Ports

- `ProductRepository`
- `CategoryRepository`
- `BrandRepository`
- `CollectionRepository`
- `ColorRepository`
- `SizeRepository`
- `MediaStoragePort`
- `CatalogUnitOfWork` somente se a transação do caso de uso exigir coordenação.

As interfaces pertencem à application/domain. Implementações Prisma/Supabase ficam em infrastructure.

## Error Vocabulary

| Código | Significado |
|---|---|
| `CATALOG_PRODUCT_NOT_FOUND` | Produto inexistente ou não visível no contexto. |
| `CATALOG_SLUG_CONFLICT` | Slug já utilizado. |
| `CATALOG_SKU_CONFLICT` | SKU já utilizado. |
| `CATALOG_VARIANT_CONFLICT` | Combinação cor+tamanho já existe. |
| `CATALOG_INVALID_PRICE` | Valor monetário inválido. |
| `CATALOG_REFERENCE_INACTIVE` | Categoria/cor/tamanho/etc. inválido ou inativo. |
| `CATALOG_PUBLICATION_INCOMPLETE` | Produto não atende à política de publicação. |
| `CATALOG_MEDIA_NOT_RECONCILED` | Objeto e metadado de mídia não estão consistentes. |

O adapter Prisma 7 traduz `P2002` em erro de domínio usando também o campo ou
constraint afetada. Tipos Prisma não atravessam a fronteira de infrastructure.

## Out of Scope

- saldo, reserva e movimentos de estoque;
- carrinho, checkout, pedido e pagamento;
- tabela de medidas e recomendação de tamanho;
- avaliações, wishlist e trocas;
- upload UI do admin;
- busca full-text e filtros completos da vitrine;
- campanhas e conteúdo completo de coleções;
- exclusão física de registros referenciados;
- integração com marketplaces.

## Approved and Deferred Decisions

1. SKU é armazenado em formato canônico maiúsculo e comparado sem distinção de caixa.
2. Barcode é opcional, normalizado e único quando informado; validadores GTIN/EAN serão adicionados quando o padrão comercial real for definido.
3. Produto pode pertencer a múltiplas categorias, com exatamente uma categoria principal para navegação/SEO.
4. SKU só pode mudar em `DRAFT`; após ativação, deve-se criar nova variante e arquivar a anterior.
5. A visibilidade pública de produto esgotado permanece deliberadamente adiada para `SR-MVP-03`, após o contrato de inventory.

## Approval

Status: **APROVADO EM 2026-09-14**. O aceite humano confirma vocabulário, invariantes e política de publicação.
