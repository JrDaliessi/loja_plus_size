---
id: FSPEC-WEBPREVIEW001
feature: FEATURE-WEB-PREVIEW
small_release: SR-WEB-PREVIEW-01
status: spec_ready
derived_from:
  - PRODUCT-PRD
  - FEATURE-WEB-PREVIEW/feature-prd.md
  - ARCHITECTURE-001
adrs: [ADR-001]
---

# Feature Spec — Purple Noir Web Preview

## Feature Identification

- Feature: `FEATURE-WEB-PREVIEW`
- Small release: `SR-WEB-PREVIEW-01`
- Capability: software/product
- State: `SPEC_READY`
- Objective: estabelecer a fundação web e uma única página demonstrativa pronta
  para validação em Preview Deployment da Vercel.

## Requirements Covered

Esta spec cobre `FPRD-WEBPREVIEW001-RQ-001..014` e
`FPRD-WEBPREVIEW001-AC-001..014`.

## Architecture Impact

### Components introduced by this slice

- `apps/web`: Next.js App Router e composição da rota `/`;
- `packages/ui`: somente tokens e primitivas Purple Noir usadas pela página;
- feature `storefront-preview` com presentation, application e adapter demo;
- testes unitários/de componente e verificação de build;
- configuração do workspace para validar e construir a aplicação web.

### Components explicitly not introduced

- client Supabase, credenciais, database adapter ou Storage;
- HTTP client real da API NestJS;
- Route Handlers ou Server Actions;
- estado global, carrinho, autenticação, analytics, CMS ou PWA;
- biblioteca genérica de catálogo ou design system completo.

## Technology Baseline

As versões serão exatas, sem `^`/`~`, e confirmadas novamente na instalação:

| Component | Approved baseline | Evidence checked 2026-09-20 |
|---|---|---|
| Next.js | `16.3.5` stable | `https://www.npmjs.com/package/next` |
| React / React DOM | `19.3.0` stable | `https://www.npmjs.com/package/react-dom` |
| Node.js | `24.21.0` | project toolchain |
| pnpm | `11.19.0` | project toolchain |

Canary, preview e RC são proibidos neste incremento. A documentação oficial do
Next.js recomenda `next@latest react@latest react-dom@latest`, App Router,
TypeScript, ESLint e Turbopack; as versões acima materializam esse baseline de
forma reproduzível.

## Target Structure

```text
apps/web/
├── next.config.ts
├── package.json
├── public/
│   └── preview/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── features/storefront-preview/
│       ├── application/get-preview-collection.ts
│       ├── application/preview-collection-source.ts
│       ├── presentation/preview-home.tsx
│       ├── presentation/preview-empty-state.tsx
│       ├── presentation/preview-error-state.tsx
│       ├── infrastructure/demo-preview-collection-source.ts
│       └── tests/
packages/ui/
├── package.json
└── src/
    ├── tokens.css
    └── index.ts
```

Nomes podem ser ajustados no Dia 3 apenas para compatibilidade real da
toolchain, sem alterar as fronteiras.

## Layer and Dependency Rules

```text
app/page.tsx
  -> presentation/preview-home
  -> application/get-preview-collection
  -> application/preview-collection-source (port)
  <- infrastructure/demo-preview-collection-source (adapter)
```

- `page.tsx` compõe dependências e metadados, sem regra comercial.
- O modelo desta preview é um read model de apresentação, não entidade de
  catálogo comercial.
- Presentation não importa Supabase, Prisma ou `fetch`.
- O adapter demo não finge endpoint HTTP e não cria um backend alternativo.
- Um adapter Nest futuro poderá implementar a porta somente na `SR-MVP-03`,
  após contrato REST e ambiente remoto aprovados.

## Application Contracts

```ts
export type PreviewCollectionItem = Readonly<{
  id: string
  name: string
  category: string
  conceptLabel: 'Conceito visual'
  image: Readonly<{
    src: string
    alt: string
    width: number
    height: number
  }>
}>

export interface PreviewCollectionSource {
  list(): Promise<readonly PreviewCollectionItem[]>
}

export type PreviewCollectionResult =
  | { status: 'ready'; items: readonly PreviewCollectionItem[] }
  | { status: 'empty'; items: readonly [] }
  | { status: 'error'; message: string }
```

`getPreviewCollection` normaliza lista, vazio e falha conhecida. Mensagem de
erro para UI é estável e não contém stack, endpoint ou detalhe interno.

## Page Composition and Content Contract

1. Skip link para o conteúdo principal.
2. Faixa de disclosure: `Prévia demonstrativa — dados e imagens ilustrativos`.
3. Header sem menu hambúrguer nesta release; links âncora permanecem visíveis.
4. Hero Dark Luxury:
   - eyebrow `Moda plus size com presença`;
   - heading editorial sem promessa comercial;
   - texto curto sobre estilo, conforto e expressão;
   - CTA `Conhecer a coleção` apontando para `#colecao`.
5. Coleção Light Editorial:
   - quatro cards conceituais;
   - nome, categoria e label `Conceito visual`;
   - sem preços, estoque, tamanhos ou botões de compra.
6. Rodapé com identificação da prévia e navegação mínima.

O copy final deve preservar o sentido aprovado e pode receber ajuste editorial
sem inserir claims de disponibilidade, exclusividade, conforto garantido ou
resultado corporal.

## Purple Noir Token Slice

Somente os tokens usados pela página serão materializados:

- ink/black: `#0B090D`, `#121015`, `#1A1620`;
- light editorial: `#FAF7FB`, `#F2ECF5`;
- text: `#1A121F`, `#5B5260`, `#F8F5FA`;
- violet accents: `#8B5CF6`, `#A78BFA`, `#C4B5FD`;
- borders/focus com contraste mensurável;
- radius, spacing, type scale and shadow mínimos do documento fonte.

CTA primário recomendado: texto `#1A121F` sobre `#C4B5FD`, com borda/foco de
alto contraste. A confirmação numérica pertence ao Dia 2/Dia 6.

As referências visuais fornecidas pelo humano são analisadas em
`visual-references.md`. Elas informam clima, contraste e acabamento, sem
substituir os tokens Purple Noir ou autorizar cópia de marca, dados e layout.

## Rendering and Next.js Rules

- `layout.tsx`, `page.tsx` e componentes são Server Components por padrão.
- Nenhum `'use client'` entra sem comportamento que o exija.
- Metadata inclui locale `pt-BR`, title, description e robots noindex/nofollow.
- Assets locais são renderizados por `next/image` com `sizes` e proporção fixa.
- Fontes usam `next/font` quando houver fonte selecionada e licenciada; fallback
  não pode bloquear a primeira renderização.
- O HTML deve continuar útil sem JavaScript cliente.
- Nenhum middleware/proxy será criado.

## Accessibility and Responsive Contract

- landmarks `header`, `main`, seções nomeadas e `footer`;
- um único `h1`; headings subsequentes sem salto estrutural;
- skip link, foco de pelo menos 2 px e `:focus-visible` perceptível;
- link/CTA com nome acessível e alvo válido;
- alt descreve a composição visual e declara quando for imagem conceitual;
- disclosure não depende somente de cor;
- `prefers-reduced-motion` respeitado; nenhuma animação é requisito;
- breakpoints validados em 320, 375, 768, 1280 e 1440 px;
- grade de uma coluna no mobile, duas no tablet e até quatro no desktop;
- touch targets de pelo menos 44 x 44 CSS px onde aplicável.

## UI States

| State | Behavior |
|---|---|
| ready | renderiza quatro cards na ordem determinística do adapter |
| empty | apresenta mensagem editorial neutra, sem inventar produtos |
| error | apresenta mensagem recuperável sem detalhe técnico |
| loading | `loading.tsx` é opcional neste recorte estático; não será simulado sem latência real |

## Security and Privacy

- nenhum secret ou variável pública é necessário;
- nenhuma URL/chave Supabase será declarada;
- nenhum formulário, cookie próprio ou coleta de dados pessoais;
- assets devem ser versionados localmente e possuir origem/licença registrável;
- `robots: noindex, nofollow` reduz risco de indexação, mas não é controle de
  acesso; a URL deve ser compartilhada apenas com revisores pretendidos;
- headers de segurança adicionais podem ser propostos no Dia 5 sem expandir
  para autenticação de preview.

## Vercel Delivery Contract

- Projeto existente: `loja-plus-size` (`prj_F7vW8iP7sqyItuyVPbEk3tgFF3Nm`).
- Team: `JrDaliessi's projects` (`team_cHPC6ZPXvRJsgt7H9mROAu9C`).
- Git integration já está ativa no repositório.
- O `vercel.json` atual ignora deploy enquanto `apps/web` não existe; o primeiro
  commit de implementação deve deixar lint, testes e build verdes porque a
  criação do diretório habilitará builds automaticamente.
- Push de branch gera preview; merge em `main` geraria produção e, portanto,
  depende de aceite explícito posterior.
- Não usar variáveis de produção, Supabase ou dados reais na preview.

## Validation Strategy

O Dia 2 materializou antes da implementação:

- matriz `RQ/AC -> teste/gate` 14/14;
- testes RED para disclosure, ausência de claims comerciais, semântica,
  conteúdo ready/empty/error e metadata;
- teste de fronteira que proíba imports Supabase/Prisma na web;
- checagem de tokens/contraste;
- plano de browser verification nas cinco larguras;
- plano de inspeção de console, teclado, accessibility tree e build;
- critério de Preview Deployment `READY` sem alteração da produção.

Evidence: `test-plan.md`, `test-matrix.md`, `fixtures.md`,
`browser-verification.md` and `red-evidence.md`.

## Release and Rollback

### Release prerequisites

- Dia 2 aprovado e RED observado;
- implementação mínima GREEN;
- lint, type-check, tests e build verdes;
- inspeção visual/accessibility concluída;
- branch enviada e deployment de preview `READY`;
- aprovação humana da URL antes de merge/promoção.

### Rollback

- preview: manter o último deployment `READY` ou remover a branch sem afetar
  produção;
- código: reverter somente o commit da feature;
- dados: não há migration, persistência ou recurso remoto a desfazer.

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Conteúdo demo parecer oferta real | disclosure persistente, sem preço/estoque/compra e noindex |
| Primeiro push quebrar build Vercel | executar todos os gates locais antes do push |
| Assets sem origem clara | registrar geração/licença e manter somente arquivos aprovados |
| UI divergir do Design System | tokens rastreados e inspeção visual no Dia 6 |
| Foundation virar arquitetura excessiva | uma rota, uma feature e apenas primitivas utilizadas |
| Supabase inativo bloquear preview | zero dependência de Supabase/API nesta release |

## Definition of Done

- requisitos e ACs permanecem rastreáveis;
- TDD executado RED -> GREEN -> refactor;
- página, estados e assets atendem ao contrato;
- nenhuma credencial ou integração remota adicionada;
- quality gates web verdes;
- preview Vercel `READY`, inspecionada e aprovada;
- produção inalterada até autorização explícita;
- documentação viva e backlog atualizados.

## Approval

- Specification derived from the scope approved by the human on 2026-09-20.
- State: `SPEC_READY`.
- Validation state: `VALIDATION_READY` on 2026-09-20.
- Next phase: Dia 3 — Minimum Validated Execution.
