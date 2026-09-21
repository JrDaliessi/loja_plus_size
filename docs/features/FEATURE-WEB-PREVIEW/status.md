# FEATURE-WEB-PREVIEW Status

## Current State

- Small release: `SR-WEB-PREVIEW-01`
- Artifact state: `READY_FOR_RELEASE`
- Review status: `DAY_7_COMPLETE_2026-09-21`
- Project state: `OPERATING`
- Phase: Dia 7 concluído; release candidate local aguardando commit/push autorizado

## Completed

- Dia 1: quatorze requisitos, quatorze critérios de aceite, arquitetura e spec
  aprovados.
- Dia 2: 19 testes materializados; 14 RED corretos e 5 guards verdes.
- Aplicação Next.js 16.3.5 e React 19.3.0 criada como uma única rota estática.
- Fluxo aplicação/porta/adapter demo implementado para `ready`, `empty` e
  `error`, sem Supabase, API remota, credenciais ou `fetch`.
- Dark Luxury hero, Light Editorial collection, manifesto and footer usam o
  slice mínimo de tokens Purple Noir em `packages/ui`.
- Disclosure persistente, ausência de preço/estoque/frete/compra e metadata
  `noindex, nofollow` preservados.
- Quatro imagens editoriais originais foram geradas, inspecionadas e registradas
  com SHA-256 em `asset-provenance.md`.
- 19/19 testes web GREEN; lint, type-check e build Next.js verdes.
- Regressão do monorepo verde: 80/80 testes API e 19/19 testes web; PostgreSQL
  isolado foi ligado apenas para o gate e desligado depois.
- Browser local verde em 320, 375, 768, 1280 e 1440 px, sem overflow, overlay
  ou erro de console; grid 1/2/4 colunas e quatro imagens carregadas.
- CTA `#colecao`, skip link, foco visível e transferência de foco ao `main`
  foram validados por teclado.
- Revisão React confirmou Server Components, ausência de hooks/client bundle
  desnecessários e composição proporcional ao recorte.
- Estados vazio e erro foram isolados em componentes de apresentação com
  anúncios acessíveis `status`/`alert` e mensagens atômicas.
- No Dia 4, contratos de asset validaram assinatura PNG, dimensão física
  `1122x1402` e SHA-256; o Dia 5 substituiu esse formato por WebP rastreado.
- Metadata Open Graph agora declara `pt_BR`, preservando `noindex, nofollow`.
- 23/23 testes web e 80/80 testes API passaram (103/103 total), com lint,
  type-check e build integrais verdes.
- A regressão de navegador repetiu os cinco breakpoints sem overflow ou erros.
- Quatro WebPs visualmente revisados substituíram os PNGs, reduzindo o conjunto
  de 6.745.439 para 307.958 bytes (95,43%) sem alterar dimensões ou composição.
- Headers de permissões, referência, MIME e framing foram adicionados e
  `X-Powered-By` foi removido da resposta.
- 25/25 testes web e 80/80 testes API passaram (105/105 total); lint,
  type-check, build e navegador permaneceram verdes.
- O Dia 6 reproduziu em RED e corrigiu a ocultação do link `Início` no mobile;
  os três destinos primários agora permanecem visíveis em todas as larguras.
- Skip link, ordem de teclado, foco no `main`, CTA `#colecao`, landmarks,
  metadados e oito combinações de contraste foram validados no navegador.
- 27/27 testes web e 80/80 testes API passaram (107/107 total); lint,
  type-check, build e os cinco breakpoints permaneceram verdes.
- O gate final repetiu 107/107 testes, lint, type-check e builds com sucesso;
  auditorias completa e de produção não encontraram vulnerabilidades conhecidas.
- A história `/` → caso de uso → adapter demo → apresentação foi verificada no
  código, nos contratos e no navegador, sem integração remota.
- Release readiness, rollback, evidência do Dia 7 e o record
  `SR-WEB-PREVIEW-01-RC1` foram materializados.

## Decisions

1. A primeira entrega web continua sendo preview demonstrativa, não loja.
2. A página inicial é a única rota deste recorte.
3. Dados e imagens são locais, determinísticos e explicitamente ilustrativos.
4. Nenhum claim comercial ou integração remota entra antes do slice previsto.
5. Commit, push, PR, merge, Preview Deployment e promoção de produção permanecem
   operações separadas do gate local do Dia 7.

## Blockers

Não há bloqueio duro para criar e enviar o commit candidato. O Supabase inativo
não afeta esta preview porque banco, Auth, Storage e API remota estão fora do
escopo.

As mudanças dos Dias 5–7 permanecem locais. `RELEASED` continua bloqueado até
um push autorizado, o deployment Vercel `READY` e a inspeção da URL gerada.

`DEBT-WEB-001` foi resolvida com redução de 95,43%, inspeção visual, hashes e
regressão. O critério de deployment continua pendente até validar a URL Preview.

## Evidence

- GREEN: `green-evidence.md`
- Dia 4: `day4-evidence.md`
- Dia 5: `day5-evidence.md`
- Dia 6: `day6-evidence.md`
- Dia 7: `day7-evidence.md`
- readiness: `release-readiness.md`
- rollback: `rollback-plan.md`
- release candidate: `../../releases/SR-WEB-PREVIEW-01-release-candidate.md`
- assets: `asset-provenance.md`
- matriz: `test-matrix.md`
- plano/browser: `browser-verification.md`

## Next Action

Aguardar autorização humana para organizar o commit e push da branch. Depois,
validar a Vercel Preview e `AC-013`. Não fazer merge ou promoção de produção
automaticamente.
