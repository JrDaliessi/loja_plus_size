# FEATURE-WEB-PREVIEW Status

## Current State

- Small release: `SR-WEB-PREVIEW-01`
- Artifact state: `IN_PROGRESS`
- Review status: `DAY_4_COMPLETE_2026-09-21`
- Project state: `OPERATING`
- Phase: Dia 4 concluído; aguardando comando/aprovação para Dia 5

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
- Contratos de asset validam assinatura PNG, dimensão física `1122x1402` e
  SHA-256; a divergência documental anterior foi corrigida sem alterar imagens.
- Metadata Open Graph agora declara `pt_BR`, preservando `noindex, nofollow`.
- 23/23 testes web e 80/80 testes API passaram (103/103 total), com lint,
  type-check e build integrais verdes.
- A regressão de navegador repetiu os cinco breakpoints sem overflow ou erros.

## Decisions

1. A primeira entrega web continua sendo preview demonstrativa, não loja.
2. A página inicial é a única rota deste recorte.
3. Dados e imagens são locais, determinísticos e explicitamente ilustrativos.
4. Nenhum claim comercial ou integração remota entra antes do slice previsto.
5. Push da branch foi autorizado; merge e promoção de produção permanecem fora
   do Dia 4.

## Blockers

Não há bloqueio duro para o Dia 5. O Supabase inativo não afeta esta preview
local porque banco, Auth, Storage e API remota seguem fora do escopo.

O deployment de Preview permanece pendente, não bloqueado por código: depende
do pipeline acionado pelo push e da validação da URL gerada.

Risco leve registrado: os quatro PNGs de origem totalizam 6,745,439 bytes.
`next/image` otimiza a entrega e `DEBT-WEB-001` agenda a redução no Dia 5.

## Evidence

- GREEN: `green-evidence.md`
- Dia 4: `day4-evidence.md`
- assets: `asset-provenance.md`
- matriz: `test-matrix.md`
- plano/browser: `browser-verification.md`

## Next Action

Aguardar comando/aprovação humana para o Dia 5 — hardening da preview. Não fazer
merge, PR adicional ou promoção de produção automaticamente.
