---
id: SR-WEB-PREVIEW-01
feature: FEATURE-WEB-PREVIEW
status: RELEASED
date: 2026-09-25
merge_commit: 5c874f85c4a2f4e8c097610d7dd40fc795636e75
production_deployment: dpl_jQHa6UPru2CMbYZfXp8Q6kPLL7v4
production_url: https://loja-plus-size.vercel.app
derived_from:
  - docs/releases/SR-WEB-PREVIEW-01-release-candidate.md
---

# SR-WEB-PREVIEW-01 — Purple Noir Preview

## Resultado

A página demonstrativa Purple Noir foi aprovada, mesclada e publicada na
produção da Vercel. Ela permanece explicitamente demonstrativa, sem catálogo
real, preços, estoque, carrinho, checkout, Supabase ou API remota.

## Evidência de entrega

- PR #7 mesclou a implementação e os gates dos Dias 1–7;
- PR #8 corrigiu o Root Directory do monorepo e foi mesclado em `main`;
- GitHub Actions do PR #8: sucesso;
- deployment `dpl_jQHa6UPru2CMbYZfXp8Q6kPLL7v4`: `READY`;
- URL canônica: `https://loja-plus-size.vercel.app`;
- HTTP 200, conteúdo esperado e cache Vercel `HIT`;
- HSTS, frame denial e MIME sniffing protection presentes;
- Preview anterior validada em 320 px e 1440 px, sem overflow, overlay ou erro
  de console;
- 28/28 testes web e 80/80 testes API verdes antes da promoção.

## Limites preservados

- `noindex, nofollow` e disclosure demonstrativo permanecem ativos;
- nenhuma credencial, migration, tabela, bucket ou identidade Supabase foi
  criada ou alterada;
- a publicação não representa o storefront comercial do MVP.

## Próximo ciclo

Retomar `FEATURE-CATALOG` (`SR-MVP-01`) e revalidar o Supabase antes de qualquer
promoção remota. Estoque (`SR-MVP-02`) só inicia após a fronteira catálogo,
schema e autorização mínima estar apta para integração.
