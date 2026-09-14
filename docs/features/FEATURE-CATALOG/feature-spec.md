---
id: FSPEC-CAT001
feature: FEATURE-CATALOG
small_release: SR-MVP-01
status: spec_review
derived_from:
  - PRODUCT-PRD
  - FEATURE-CATALOG/feature-prd.md
  - DOMAIN-CATALOG-001
  - ARCHITECTURE-001
adrs: [ADR-001, ADR-002, ADR-003]
---

# Feature Spec — Catalog Source of Truth

## Feature Identification

- Feature: `FEATURE-CATALOG`
- Small release: `SR-MVP-01`
- Capability: software/product
- State: `REQUIREMENTS_READY`, aguardando aprovação da spec
- Objective: materializar contratos implementáveis para catálogo e variante/SKU sem executar a implementação.

## Requirements Covered

Esta spec cobre `FPRD-CAT001-RQ-001..018` e `FPRD-CAT001-AC-001..020`.

Rastreabilidade de origem:

```text
PRODUCT-PRD
  -> FEATURE-CATALOG feature-prd
  -> DOMAIN-CATALOG-001
  -> FSPEC-CAT001
  -> Dia 2 test matrix / RED
  -> Dia 3 implementation / GREEN
```

## Architecture Impact

### Components introduced by this slice

- `apps/api/src/modules/catalog/domain`
- `apps/api/src/modules/catalog/application`
- `apps/api/src/modules/catalog/infrastructure`
- `apps/api/src/modules/catalog/presentation`
- `packages/contracts/src/catalog`
- database objects for catalog after baseline approval
- Supabase Storage adapter for product media after access approval

### Components explicitly not introduced

- `apps/web` storefront/admin screens;
- inventory, cart, checkout, order or payment modules;
- Redis/BullMQ;
- search engine or full-text index;
- marketplace adapters;
- recommendation or AI modules.

## Affected Modules

| Module | Change | Boundary |
|---|---|---|
| `catalog` | New | Owns catalog domain and use cases. |
| `auth` | Minimal dependency | Provides verified identity and permissions for protected mutations; no customer account UI. |
| `shared/http` | New minimal contract | Error envelope and correlation ID. |
| `shared/persistence` | New minimal contract | Transaction boundary and Prisma lifecycle, without generic repository base. |
| `contracts/catalog` | New | REST DTO schemas only. |

## Domain Changes

### Entities

- `Product`
- `ProductVariant`
- `ProductMedia`
- `Category`
- `Brand`
- `Collection`
- `Color`
- `Size`

### Value Objects

- `ProductId`, `VariantId` and reference IDs;
- `Sku`;
- `Slug`;
- `Money`;
- `Barcode` optional;
- `DisplayOrder`;
- `AltText`.

### Enums / controlled vocabularies

- Product/Variant status: `DRAFT | ACTIVE | ARCHIVED`.
- Media kind: `IMAGE | VIDEO`.
- Media role: `FRONT | BACK | SIDE | FABRIC | FULL_BODY | LOOK | DETAIL | OTHER`.

Enums may be represented as text plus check constraints to keep migrations explicit. Final persistence representation is validated during the Prisma spike.

### Invariants

All `CAT-INV-001..012` from `docs/domain/catalog.md` are mandatory. Database constraints duplicate invariants that can be expressed safely; domain validation remains responsible for intent and usable errors.

## Use Cases and Application Contracts

### Commands

| Use case | Input | Output | Permission |
|---|---|---|---|
| `CreateProductDraft` | name, slug, description, category IDs, optional brand/collection IDs | `AdminProductDto` | `catalog:write` |
| `UpdateProductDetails` | product ID + patch with explicit fields | `AdminProductDto` | `catalog:write` |
| `CreateCategory` | name, slug, parent ID?, order | `CategoryDto` | `catalog:write` |
| `CreateBrand` | name, slug | `BrandDto` | `catalog:write` |
| `CreateCollection` | name, slug | `CollectionDto` | `catalog:write` |
| `CreateColor` | name, slug, visual value?, order | `ColorDto` | `catalog:write` |
| `CreateSize` | code, label, order | `SizeDto` | `catalog:write` |
| `AddProductVariant` | product ID, color ID, size ID, SKU, price, barcode? | `AdminVariantDto` | `catalog:write` |
| `UpdateProductVariant` | variant ID + allowed patch | `AdminVariantDto` | `catalog:write` |
| `RequestMediaUpload` | product ID, kind, content type, size metadata | upload grant | `media:write` |
| `CompleteProductMedia` | product ID, storage path, role, alt, order, variant/color? | `ProductMediaDto` | `media:write` |
| `ReorderProductMedia` | product ID + ordered media IDs | media list | `media:write` |
| `ActivateProduct` | product ID | `AdminProductDto` or publication issues | `catalog:publish` |
| `ArchiveProduct` | product ID + reason | archived product | `catalog:publish` |

### Queries

| Use case | Input | Output | Access |
|---|---|---|---|
| `GetAdminProductById` | product ID | complete admin DTO | protected `catalog:read` |
| `ListAdminProducts` | cursor, limit, status?, query? | cursor page | protected `catalog:read` |
| `GetPublicProductBySlug` | slug | public product DTO | public, active only |
| `ListPublicCatalogProducts` | cursor, limit, category/brand/collection? | cursor page | public, active only |

The public list intentionally excludes full storefront filtering and inventory availability, which belong to later releases.

## Types / Schemas

### Serialization rules

- IDs: strings opacas.
- Timestamps: ISO 8601 UTC strings.
- Money: `{ amount: string, currency: "BRL" }`.
- No Prisma models, `Date`, `Map`, classes or bigint values cross REST/RSC boundaries.
- Optional input fields distinguish “absent” from explicit `null` only where the use case allows clearing.

### Core request schemas

```text
CreateProductDraftRequest
  name: non-empty text
  slug: normalized slug
  description: non-empty text
  categoryIds: non-empty unique ID list
  primaryCategoryId: member of categoryIds
  brandId?: ID
  collectionIds?: unique ID list

CreateVariantRequest
  colorId: ID
  sizeId: ID
  sku: canonical SKU
  price: exact decimal string
  currency: BRL
  barcode?: normalized text

CompleteProductMediaRequest
  storagePath: persistent object path
  kind: controlled value
  role: controlled value
  altText: non-empty accessible description
  position: non-negative integer
  variantId?: ID
  colorId?: ID
```

Zod schemas validate transport shape. Domain value objects validate semantic rules. Database constraints protect concurrency and persistence integrity.

## Database / Persistence Design

### Proposed schema

Schema name: `app`, subject to Supabase baseline and ADR-002 approval.

### Proposed relations

| Relation | Purpose | Key constraints |
|---|---|---|
| `app.products` | Product identity/content/status | PK; unique slug; status check |
| `app.categories` | Hierarchical category | PK; unique slug; self FK optional |
| `app.brands` | Optional brand | PK; unique slug |
| `app.collections` | Minimal collection reference | PK; unique slug |
| `app.colors` | Color reference | PK; unique slug; order check |
| `app.sizes` | Size reference | PK; unique code/slug as approved; order check |
| `app.product_categories` | Product-category relation | composite unique; one primary enforced by validated strategy |
| `app.product_collections` | Product-collection relation | composite PK/unique |
| `app.product_variants` | SKU/color/size/price | unique SKU; unique product+color+size; partial unique barcode |
| `app.product_media` | Storage metadata and order | product FK; variant/color optional FKs; position check |

### Column conventions

- SQL identifiers use lowercase `snake_case`.
- IDs use application-generated UUIDv7 if the spike confirms compatible libraries and Prisma mapping without database extension. Otherwise, a new ADR chooses another opaque strategy.
- Timestamps use `timestamptz` with created/updated instants.
- Money uses exact PostgreSQL numeric with scale 2 and positive check; API exposes decimal string.
- Free text uses `text`; artificial varchar limits are added only for a validated business constraint.

### Index plan

- unique indexes for each slug scope;
- unique `product_variants(sku)` using canonical stored SKU;
- unique `(product_id, color_id, size_id)`;
- unique barcode where barcode is not null;
- indexes on every foreign key side;
- `(product_id, status)` for variant lookup;
- `(product_id, position, id)` for stable media order;
- `(status, created_at, id)` or equivalent only after query plan validates admin/public listing.

Indexes beyond these contracts require an actual query and `EXPLAIN` evidence; no speculative full-text index in this slice.

### Cross-row consistency

The rule “media variant/color belongs to the same product” is validated in one short transaction by the use case. A trigger is not introduced without evidence that another trusted writer needs database-only enforcement.

### Delete behavior

- Domain operations archive products/variants.
- Reference deletion is restricted when associated.
- Cascades are not used on commercial identity merely for convenience.
- Test data cleanup may use separate test-only lifecycle.

## Migration Strategy

No migration is created in Dia 1B.

Before the first migration:

1. authorize and inspect the real Supabase project read-only;
2. inventory schemas, tables, grants, RLS, extensions and migration history;
3. validate Prisma 8 versions and CLI commands using `--help`/official docs;
4. run the Prisma 8 compatibility spike;
5. generate migration through the approved migration authority;
6. review every operation, constraints and indexes;
7. apply only in an isolated development/preview environment;
8. run schema, security and rollback verification;
9. run Supabase security/performance advisors before promotion.

Prisma migration history will be the proposed schema-change authority because Prisma 8 is the approved ORM. Supabase tooling remains responsible for platform baseline, advisors and validation. If the spike proves incompatible histories, a new ADR is mandatory before proceeding.

## RLS / Privileges

- `app` is not exposed to the Data API by default.
- `anon` and `authenticated` receive no grants on commercial tables by default.
- NestJS database role receives only operations needed by catalog adapters.
- Public reads occur through NestJS public queries, not direct Data API.
- If future requirements expose a relation, add grants and RLS together, index policy predicates and test positive/negative cases.
- No `service_role` or database password appears in web environment variables.

## REST API

All paths are proposed and versioned under `/v1`.

### Administrative commands

```text
POST   /v1/admin/catalog/products
PATCH  /v1/admin/catalog/products/{productId}
POST   /v1/admin/catalog/products/{productId}/variants
PATCH  /v1/admin/catalog/variants/{variantId}
POST   /v1/admin/catalog/products/{productId}/media/upload-request
POST   /v1/admin/catalog/products/{productId}/media/complete
PUT    /v1/admin/catalog/products/{productId}/media/order
POST   /v1/admin/catalog/products/{productId}/activate
POST   /v1/admin/catalog/products/{productId}/archive
POST   /v1/admin/catalog/categories
POST   /v1/admin/catalog/brands
POST   /v1/admin/catalog/collections
POST   /v1/admin/catalog/colors
POST   /v1/admin/catalog/sizes
```

### Administrative queries

```text
GET /v1/admin/catalog/products/{productId}
GET /v1/admin/catalog/products?cursor=&limit=&status=&query=
```

### Public queries

```text
GET /v1/catalog/products/{slug}
GET /v1/catalog/products?cursor=&limit=&category=&brand=&collection=
```

### HTTP behavior

- create returns `201`;
- successful query/update returns `200`;
- missing public item returns `404` without revealing draft existence;
- schema validation returns `400` or `422` according to one documented convention selected in scaffold;
- unauthenticated protected request returns `401`;
- authenticated without permission returns `403`;
- business conflicts return `409` with stable `CATALOG_*` code;
- each response/error includes or propagates correlation ID.

## UI Components / UI States

No user interface is implemented in `SR-MVP-01`. Contracts must nevertheless support later states:

- loading;
- empty catalog;
- draft/incomplete;
- active;
- archived;
- validation error;
- uniqueness conflict;
- media upload pending/failed/reconciled;
- unauthorized/forbidden.

Purple Noir implementation begins when the first UI slice is selected, not in this backend/domain release.

## Validation

Dia 2 must derive a matrix from every acceptance criterion before production code. Required layers:

1. Domain unit tests for value objects, transitions and publication rules.
2. Application tests with in-memory/fake ports for orchestration and permissions.
3. PostgreSQL integration tests for constraints, indexes and concurrent uniqueness.
4. Prisma adapter contract tests, including error mapping without Prisma 7 codes.
5. Storage adapter contract tests for upload request/completion/reconciliation.
6. Controller/OpenAPI tests for status, DTO and error envelope.
7. Security tests for unauthorized, forbidden and public projections.

## Security

- All admin paths require verified Supabase identity plus application permission.
- `catalog:write`, `catalog:publish` and `media:write` are distinct.
- Public projections whitelist fields; they do not serialize persistence objects.
- Upload request validates content type/size policy before granting access.
- Storage path is server-controlled and cannot escape the product namespace.
- Alt text is required for active visual media.
- Logs redact tokens, signed URLs, connection strings and unnecessary personal data.
- Request body size and rate limit are configured before public deployment.

## Observability / Analytics

### Logs

- use case name;
- result (`success`, stable error code);
- actor ID for protected operations;
- product/variant ID when created;
- correlation ID;
- duration;
- never full request tokens or credentials.

### Metrics

- create/update/activate success and failure counts;
- uniqueness conflict count by type;
- publication rejection count by reason;
- Storage reconciliation failures;
- API latency/error rate by route group.

Domain events remain in-process; no promise of durable delivery until a consumer requires it.

## Test Strategy Preview

The following groups become RED in Dia 2:

- `CAT-DOM-*`: domain/value objects;
- `CAT-APP-*`: use cases and authorization;
- `CAT-DB-*`: database constraints/queries/concurrency;
- `CAT-API-*`: REST/OpenAPI/public projection;
- `CAT-STO-*`: Storage contracts and recovery;
- `CAT-SEC-*`: negative access scenarios;
- `CAT-TRACE-*`: requirement-to-test traceability.

No implementation test will be authored in Dia 1B.

## Release / Rollback

### Release prerequisites

- architecture/ADRs/spec approved;
- Node.js 24.11+;
- Supabase baseline complete;
- Prisma 8 spike green and versions pinned;
- test strategy RED observed for correct reasons;
- migration reviewed in isolated environment;
- admin authorization baseline working;
- required quality gates green.

### Rollback principles

- deploy database changes before code only when backward compatible;
- prefer additive migrations in the first slice;
- do not drop/rename production data in the initial release;
- application rollback must continue to understand the prior schema;
- orphan Storage objects and metadata have a documented reconciliation job/manual procedure;
- failed migration uses verified recovery, never destructive reset.

## Risks

| ID | Risk | Control |
|---|---|---|
| `FSPEC-CAT001-RISK-001` | Prisma 8 RC API/feature gap | ADR-003, spike, adapter boundary. |
| `FSPEC-CAT001-RISK-002` | Unknown Supabase schema | Hard block before migration. |
| `FSPEC-CAT001-RISK-003` | Admin mutation exposed early | Deployment gate and permission tests. |
| `FSPEC-CAT001-RISK-004` | SKU race | Database unique constraint + concurrency test. |
| `FSPEC-CAT001-RISK-005` | Media orphan | Completion protocol and reconciliation. |
| `FSPEC-CAT001-RISK-006` | Scope expands into inventory/storefront | Explicit modules and non-scope. |

## Definition of Done

- [ ] Feature PRD and spec approved.
- [ ] Architecture and ADRs approved.
- [ ] Every `FPRD-CAT001-AC-*` maps to at least one test ID.
- [ ] RED observed for essential tests before implementation.
- [ ] Domain/application compile independently of Prisma/Nest presentation.
- [ ] PostgreSQL constraints and adapter contracts pass.
- [ ] No stock quantity exists in catalog models.
- [ ] Admin mutations are protected.
- [ ] Public DTO reveals only approved fields.
- [ ] OpenAPI and Zod contracts agree.
- [ ] Migration, advisors and rollback checks pass.
- [ ] Lint, type-check, unit, integration and applicable E2E/build are green.
- [ ] Documentation, backlog and context are updated.

## Open Issues Blocking Implementation

1. Node.js must be upgraded from 22.14.0 to at least 24.11 for the current Prisma 8 RC.
2. Supabase management access and read-only baseline are required.
3. Exact Prisma 8 packages/versions must be rechecked and pinned.
4. Architecture, ADRs, domain proposals and this spec require human approval.
5. Authorization baseline must be specified in the Dia 2 validation plan before protected endpoints can be implemented.

## Approval

Status: **PENDENTE DE APROVAÇÃO HUMANA**.

Approval reaches `SPEC_READY` but does not authorize implementation. The next command remains Dia 2, where tests and validation contracts must be created first.
