# FEATURE-CATALOG Fixtures — Dia 2

## Principles

- deterministic IDs and timestamps;
- no production/customer data;
- no real credentials or signed URLs;
- money represented as exact decimal string plus `BRL`;
- inventory quantities deliberately absent;
- public and administrative shapes kept distinct;
- database cleanup isolated from commercial delete/archive behavior.

## Canonical IDs

The executable fixtures use fixed UUID-shaped identifiers under the `018f0f4d-...` namespace. They are test-only and never leave the local test process.

## Product Fixtures

### Complete draft

- name: `Vestido Purple Noir`;
- slug: `vestido-purple-noir`;
- description: non-empty;
- active category and primary category aligned;
- one active variant;
- one accessible front image;
- state: `DRAFT`.

### Incomplete draft

- empty description;
- no categories;
- no variants;
- no media;
- expected publication issues are explicit and unordered.

### Active public product

Derived from the complete draft by the approved transition. Public projection must not contain `primaryCategoryId`, internal state, inventory quantity or invented availability.

## Variant Fixture

- SKU input: ` pn-vestido-001-roxo-g3 `;
- canonical SKU: `PN-VESTIDO-001-ROXO-G3`;
- color and size IDs belong to the same product context;
- price: `{ amount: "299.90", currency: "BRL" }`;
- barcode: `7891234567890`;
- state: `ACTIVE`.

Invalid price partitions:

- zero: `0.00`;
- negative: `-1.00`;
- excess precision: `10.999`;
- malformed and non-BRL cases will be added when the transport schema enters RED.

## Media Fixture

- persistent path: `<productId>/front/main.webp`;
- role: `FRONT`;
- position: `0`;
- non-empty alt text describing garment and view;
- no signed URL stored as identity.

Mismatch fixture changes product/color ownership and expects `CATALOG_MEDIA_PRODUCT_MISMATCH`.

## Actors

- `staff-001`: `catalog:read`, `catalog:write`, `catalog:publish`;
- `customer-001`: no administrative permissions;
- media permission is tested separately from catalog publication in the Storage adapter slice.

## Time

Events use `2026-09-14T12:00:00.000Z` through an injected clock. Tests must not depend on the machine clock.

## Database Fixtures — Pending Environment

When an isolated PostgreSQL target is authorized, fixtures will add:

- two concurrent transactions attempting the same SKU;
- two concurrent transactions attempting the same product+color+size;
- null and duplicate non-null barcodes;
- cursor ties on `(created_at, id)`;
- rollback after publication validation failure;
- grants proving `anon`/`authenticated` cannot reach internal commercial tables.
