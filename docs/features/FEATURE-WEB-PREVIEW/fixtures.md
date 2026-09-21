# Fixtures — FEATURE-WEB-PREVIEW

## Principles

- deterministic and local;
- illustrative, never catalog truth;
- no price, stock, size availability, freight or purchase field;
- no copied person, product, copy or metric from the reference dashboards;
- image paths point to generated, inspected and versioned local assets.

## Ready Fixture

| ID | Name | Category | Label | Image contract |
|---|---|---|---|---|
| `concept-01` | Vestido Aurora | Vestidos | Conceito visual | `/preview/vestido-aurora.webp`, 1122x1402, conceptual alt |
| `concept-02` | Conjunto Horizonte | Conjuntos | Conceito visual | `/preview/conjunto-horizonte.webp`, 1122x1402, conceptual alt |
| `concept-03` | Blusa Essência | Blusas | Conceito visual | `/preview/blusa-essencia.webp`, 1122x1402, conceptual alt |
| `concept-04` | Saia Movimento | Saias | Conceito visual | `/preview/saia-movimento.webp`, 1122x1402, conceptual alt |

Canonical executable fixture:
`apps/web/src/features/storefront-preview/tests/fixtures.ts`.

Generation provenance and SHA-256 evidence:
`docs/features/FEATURE-WEB-PREVIEW/asset-provenance.md`.

## Empty Fixture

```text
status: empty
items: []
expected public copy: A seleção conceitual está sendo preparada.
```

The empty state must not invent products or availability.

## Error Fixture

```text
source failure: Error("private provider detail")
public result:
  status: error
  message: Não foi possível carregar esta prévia agora.
```

The private message must never cross to presentation.

## Metadata Fixture

```text
title: Plus Store — Prévia Purple Noir
description: contains "moda plus size"
robots.index: false
robots.follow: false
```

## Purple Noir Token Fixture

```text
--color-ink: #0B090D
--color-surface-editorial: #FAF7FB
--color-text-primary: #1A121F
--color-text-inverse: #F8F5FA
--color-action-primary: #C4B5FD
```

Required contrast checks:

- `#F8F5FA` on `#0B090D` >= 4.5:1;
- `#1A121F` on `#C4B5FD` >= 4.5:1;
- `#FFFFFF` on `#8B5CF6` < 4.5:1 and therefore prohibited for normal CTA text.
