# Asset Provenance — FEATURE-WEB-PREVIEW

## Scope

Four original illustrative assets were generated on 2026-09-21 for
`SR-WEB-PREVIEW-01`. The human-provided dashboard images were used only as
high-level visual references; they were not supplied to the generator and no
brand, person, copy, metric or layout was copied.

## Generation Contract

- tool: OpenAI built-in image generation;
- style: original photorealistic editorial fashion;
- generated source format: PNG, 1122 x 1402 (proporção aproximada de 4:5);
- constraints shared by all prompts: adult plus-size model, authentic
  proportions and skin texture, full outfit, Purple Noir/editorial studio,
  no body reshaping, text, logo, watermark, price, UI, hanger or clutter;
- inspection: all four final files opened and visually checked before use;
- project destination: `apps/web/public/preview/`.

## Generated source record

| File | Prompt-specific direction | SHA-256 |
|---|---|---|
| `vestido-aurora.png` | warm brown-skinned woman; flowing deep-plum midi dress; subtle movement | `2473727C02E66558274ECDDC1B51F894FF83298AD339E0210A2B028518520B7C` |
| `conjunto-horizonte.png` | Black woman; charcoal/aubergine tailored wide-leg suit | `548D34CDCD634AC64559F514B0EC2E5C5CEA26218483880C4BB0F49CFD9D62C6` |
| `blusa-essencia.png` | medium olive-skinned woman; lilac blouse and dark high-waist trousers | `C0CE42E66A8BA9468626CF8798E81462ED543E0C40CD81031D0267B160B9DA57` |
| `saia-movimento.png` | mature woman in her 40s; aubergine pleated skirt and cream blouse | `67C9C2FCC31B19FA91464B354023A36FE207DF2E556D81E7D75C1B6F95B1E563` |

The original PNGs remain recoverable in Git commit `63a9d47`; they are not part
of the current deployment artifact.

## Current optimized assets

Transformation: `sharp 0.35.4`, WebP quality `88`, effort `6`,
`smartSubsample: true`. All files preserve `1122x1402` dimensions and were
opened at original detail before the PNG copies were removed.

| File | Bytes | SHA-256 |
|---|---:|---|
| `vestido-aurora.webp` | 58,920 | `C08948FBD237C17D4309D1F7410705B314DAC92F67A5C66E4C1AC82AF0CAB2E5` |
| `conjunto-horizonte.webp` | 74,974 | `A74D9AC32427E29FCB633CA79081AD0D1967944CBD7FC90625A93870E56016B3` |
| `blusa-essencia.webp` | 89,764 | `27A7B3A25E21F44C37C526FEAD16FFB1FD94000D59B2AD60C631088589DB9640` |
| `saia-movimento.webp` | 84,300 | `A1DD124B54620C7BAF5DC15FAAF100EB95BEA7FF0B613E638794D94583442B73` |

Total: 307,958 bytes, 95.43% below the 6,745,439-byte generated source set.

## Usage Limits

These images are demonstrative preview assets, not evidence of real inventory,
availability, pricing or a commercial catalog. The page preserves a visible
disclosure and `noindex, nofollow` metadata.
