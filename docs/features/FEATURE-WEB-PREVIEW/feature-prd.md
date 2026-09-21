---
id: FEATURE-WEB-PREVIEW
small_release: SR-WEB-PREVIEW-01
status: requirements_approved
derived_from:
  - PRODUCT-PRD
  - PRD-FR-STO-001
  - PRD-FR-UX-001
  - PRD-FR-UX-002
  - PRD-FR-UX-003
  - PRD-NFR-002
  - PRD-NFR-007
  - PRD-NFR-008
  - PRD-NFR-009
  - PRD-NFR-012
  - PRD-NFR-013
  - PRD-NFR-014
  - PRD-NFR-015
depends_on:
  - ARCHITECTURE-001
  - ADR-001
  - DS-001
affects:
  - SR-MVP-03
  - STO-001
---

# Feature PRD — Purple Noir Web Preview

## Feature / Problem / User / Expected Outcome

### Feature

Primeira vitrine visual da Plus Store em `apps/web`, publicável como Preview
Deployment na Vercel e explicitamente identificada como demonstração.

### Problem

O projeto possui contratos de produto, arquitetura, catálogo e Design System,
mas ainda não possui uma experiência visual que possa ser revisada no navegador.
Antecipar a vitrine comercial completa criaria dependência indevida de estoque,
API remota e dados reais, todos ainda indisponíveis.

### Users

- responsável pelo produto, para aprovar direção visual e conteúdo;
- pessoas convidadas a avaliar a apresentação da marca;
- equipe de implementação, para validar a fundação de `apps/web` e Purple Noir.

### Expected Outcome

Uma página inicial responsiva, acessível e compartilhável por URL de preview,
com Hero Dark Luxury e seleção editorial Light Editorial. A página demonstra a
linguagem da marca sem oferecer compra, disponibilidade ou preço real.

## Value

- torna a visão visual revisável antes da vitrine comercial completa;
- valida Next.js, monorepo e integração Git/Vercel com risco baixo;
- estabelece apenas os tokens e componentes necessários ao primeiro recorte;
- coleta feedback sem bloquear no Supabase ou no deploy do backend.

## Scope

### Included

- rota pública `/` composta como React Server Component;
- aviso persistente de `Prévia demonstrativa — dados ilustrativos`;
- cabeçalho com marca e navegação por âncoras da própria página;
- Hero Dark Luxury com proposta de valor e CTA não transacional;
- seção Light Editorial com quatro peças conceituais;
- cartões com nome editorial, categoria e indicação `conceito visual`, sem preço,
  estoque, tamanho disponível ou promessa comercial;
- assets locais demonstrativos, com dimensão conhecida, texto alternativo e
  tratamento que não altere a percepção de cor da peça;
- metadados básicos e `robots` sem indexação da prévia;
- responsividade de 320 px a 1440 px;
- fundação incremental dos tokens Purple Noir;
- testes de renderização, semântica, disclosure e estados essenciais;
- build reproduzível e Preview Deployment automático pela integração Git/Vercel.

### Non-Scope

- vitrine comercial `SR-MVP-03`, busca, filtros ou página de produto;
- preço real, promoções, estoque, variantes disponíveis ou entrega;
- carrinho, checkout, login, wishlist ou coleta de dados pessoais;
- acesso direto ou indireto ao Supabase;
- chamada para a API NestJS neste incremento;
- criação de banco, migrations, Storage ou secrets na Vercel;
- publicação em produção ou vinculação de domínio comercial;
- PWA, offline, analytics, CMS ou biblioteca completa de componentes.

## Business and Experience Rules

1. A demonstração não pode ser confundida com uma loja apta a vender.
2. Todo dado de peça e toda imagem deste recorte são identificados como
   ilustrativos; nenhum conteúdo é tratado como catálogo oficial.
3. O CTA conduz somente a uma seção da página e não simula compra.
4. Dark Luxury é reservado ao cabeçalho/hero; Light Editorial é usado na
   seleção de peças, conforme o Design System Purple Noir.
5. Roxo é acento, não preenchimento dominante; glow e gradientes excessivos são
   proibidos.
6. Cor não é o único sinal de foco, seleção ou estado.
7. A combinação de CTA deve passar WCAG AA para texto normal. O par documentado
   branco sobre `#8B5CF6` não será usado como padrão, pois mede 4,23:1.
8. Nenhuma credencial ou URL de Supabase deve chegar ao bundle da web.
9. A preview usa dados locais determinísticos atrás de uma porta substituível;
   a futura API NestJS não será simulada por um segundo backend.
10. Merges em `main` e promoção para produção continuam fora do escopo até
    aceite humano da URL de preview.

## User Journey

### `FPRD-WEBPREVIEW001-JRN-001` — Revisar identidade visual

1. A pessoa abre a URL da Vercel.
2. Reconhece imediatamente que se trata de uma prévia demonstrativa.
3. Vê proposta de valor, linguagem Purple Noir e seleção conceitual.
4. Navega por teclado ou ponteiro até a seção editorial.
5. Avalia a experiência sem encontrar ação de compra enganosa.

### `FPRD-WEBPREVIEW001-JRN-002` — Revisar em diferentes telas

1. A pessoa abre a mesma URL em celular, tablet ou desktop.
2. Conteúdo, navegação, foco e imagens permanecem compreensíveis.
3. Não há scroll horizontal, sobreposição ou conteúdo inacessível.

## Requirements

| ID | Requirement |
|---|---|
| `FPRD-WEBPREVIEW001-RQ-001` | A rota `/` deve renderizar cabeçalho, hero e seleção editorial em uma composição Purple Noir. |
| `FPRD-WEBPREVIEW001-RQ-002` | A interface deve exibir disclosure persistente e perceptível de que dados e imagens são demonstrativos. |
| `FPRD-WEBPREVIEW001-RQ-003` | O CTA principal deve apenas navegar para a seleção editorial da mesma página. |
| `FPRD-WEBPREVIEW001-RQ-004` | A seleção deve usar quatro registros locais determinísticos, sem preço, estoque, disponibilidade ou promessa de venda. |
| `FPRD-WEBPREVIEW001-RQ-005` | Dados de apresentação devem ser obtidos por uma porta de aplicação implementada por adapter local, sem acesso a Supabase ou API remota. |
| `FPRD-WEBPREVIEW001-RQ-006` | A experiência deve ser funcional entre 320 px e 1440 px, sem scroll horizontal. |
| `FPRD-WEBPREVIEW001-RQ-007` | Landmarks, hierarquia de headings, links, nomes acessíveis, alt text e foco visível devem ser semanticamente corretos. |
| `FPRD-WEBPREVIEW001-RQ-008` | Texto normal, controles e estados devem atender WCAG 2.2 AA; a CTA não pode usar branco sobre `#8B5CF6` como combinação normal. |
| `FPRD-WEBPREVIEW001-RQ-009` | Imagens devem usar `next/image`, dimensões ou proporção reservada e configuração responsiva adequada. |
| `FPRD-WEBPREVIEW001-RQ-010` | A rota deve possuir title, description e `robots: noindex, nofollow` enquanto usar conteúdo demonstrativo. |
| `FPRD-WEBPREVIEW001-RQ-011` | A implementação deve priorizar Server Components e não enviar JavaScript cliente sem interação necessária. |
| `FPRD-WEBPREVIEW001-RQ-012` | O workspace deve fixar versões exatas aprovadas, atualizar o lockfile e expor lint, type-check, test e build. |
| `FPRD-WEBPREVIEW001-RQ-013` | Push da branch deve gerar Preview Deployment na Vercel sem promover `main` ou produção. |
| `FPRD-WEBPREVIEW001-RQ-014` | A página deve possuir estados testáveis de conteúdo disponível e lista vazia; falha do adapter deve ser representada sem vazar detalhes técnicos. |

## Acceptance Criteria

| ID | Acceptance criterion |
|---|---|
| `FPRD-WEBPREVIEW001-AC-001` | Ao abrir `/`, a marca, o aviso de prévia, o hero e quatro cartões conceituais são visíveis. |
| `FPRD-WEBPREVIEW001-AC-002` | Nenhuma string de preço, compra, estoque disponível ou frete aparece na página. |
| `FPRD-WEBPREVIEW001-AC-003` | O CTA recebe foco por teclado e move a navegação para a seção editorial. |
| `FPRD-WEBPREVIEW001-AC-004` | Os quatro registros são carregados pelo contrato de aplicação; a página não importa o adapter de persistência comercial nem um client Supabase. |
| `FPRD-WEBPREVIEW001-AC-005` | Em 320, 375, 768, 1280 e 1440 px não há scroll horizontal nem sobreposição de conteúdo essencial. |
| `FPRD-WEBPREVIEW001-AC-006` | Auditoria automatizada não encontra violação crítica de acessibilidade e o fluxo completo é utilizável por teclado. |
| `FPRD-WEBPREVIEW001-AC-007` | Contrastes registrados para texto normal e controles passam AA; foco possui indicador não dependente somente de cor. |
| `FPRD-WEBPREVIEW001-AC-008` | Todas as imagens possuem alt útil, dimensões reservadas e `sizes` coerente com a grade. |
| `FPRD-WEBPREVIEW001-AC-009` | O HTML entregue contém title, description e diretivas `noindex, nofollow`. |
| `FPRD-WEBPREVIEW001-AC-010` | A renderização inicial da rota não exige Client Component. |
| `FPRD-WEBPREVIEW001-AC-011` | Os estados com quatro itens, lista vazia e falha da fonte possuem testes determinísticos. |
| `FPRD-WEBPREVIEW001-AC-012` | Lint, type-check, testes e `next build` passam com Node.js 24.21.0, pnpm 11.19.0 e dependências exatas. |
| `FPRD-WEBPREVIEW001-AC-013` | A branch/PR recebe uma URL de Preview Deployment `READY` e a produção permanece inalterada. |
| `FPRD-WEBPREVIEW001-AC-014` | Inspeção do bundle/configuração confirma ausência de chaves, URLs ou clients Supabase. |

## Metrics

- 14/14 critérios de aceite cobertos por validação rastreável;
- zero violação crítica de acessibilidade na rota principal;
- zero erro de console no fluxo principal;
- pipeline web verde para lint, type-check, testes e build;
- Preview Deployment `READY` e revisável sem promover produção.

## Dependencies

- `architecture.md` e ADR-001;
- Product PRD 1.0;
- Design System Purple Noir;
- Node.js 24.21.0 e pnpm 11.19.0 já aprovados;
- projeto Vercel `loja-plus-size` já conectado ao repositório GitHub.

Não depende do Supabase, de migration, Storage, API remota ou domínio próprio.

## Risks

- imagens conceituais serem interpretadas como produtos reais;
- conteúdo demonstrativo ser indexado por buscadores;
- excesso de roxo/glow descaracterizar o sistema visual;
- layout visual aprovado antes de ser testado com dados reais;
- o `ignoreCommand` atual da Vercel passar a executar builds assim que
  `apps/web` existir, exigindo que o primeiro push de implementação já compile.

## Approved Decisions

1. Esta é a release demonstrativa `SR-WEB-PREVIEW-01`, não `SR-MVP-03`.
2. Dados e imagens serão locais, determinísticos e rotulados como ilustrativos.
3. A preview não exibirá preço ou disponibilidade.
4. A rota inicial será `/`; outras rotas comerciais permanecem fora do escopo.
5. Preview Deployment será avaliado antes de qualquer promoção para produção.

## Approval

- Scope approved by the human: 2026-09-20.
- Requirements status: `REQUIREMENTS_APPROVED`.
- Validation gate: completed on 2026-09-20 with 14/14 ACs mapped and valid RED.
- Next gate: Dia 3 — minimum GREEN implementation.
