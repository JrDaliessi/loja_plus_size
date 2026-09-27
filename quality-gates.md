# Quality Gates

## Core Gate

- [x] objetivo do Dia 0 compreendido
- [x] contexto inicial suficiente
- [x] fontes e dependências de fundação verificadas
- [x] critérios de sucesso e riscos iniciais definidos
- [x] rastreabilidade de fontes preservada
- [x] requisitos centrais do produto aprovados no Dia 1
- [x] arquitetura e ADRs aprovados no Dia 1
- [x] Feature PRD e Feature Spec da `SR-MVP-01` aprovados
- [x] matriz liga 20/20 critérios de aceite a testes primários
- [x] type-check verde e RED unitário observado pelo motivo correto
- [x] RED PostgreSQL observado no banco local isolado; baseline Supabase concluído sem mutação
- [x] estratégia de validação e testes RED do Dia 2 concluídos
- [x] Prisma 7.10.0 estável pinado; migration/spike/auditoria validados no ambiente isolado
- [x] resultado funcional mínimo do Dia 3 validado localmente por 28/28 contratos GREEN
- [x] expansão controlada do Dia 4 validada por 66/66 contratos e smoke HTTP/Prisma local
- [x] hardening do Dia 5 validado por 76/76 contratos, cobertura mínima e pipeline reproduzível
- [x] experiência da API do Dia 6 validada por 80/80 contratos; gates visuais diferidos sem falso aceite
- [x] gate final do Dia 7 concluído e release candidate registrado sem confundir merge com deploy
- [x] documentação de fundação atualizada

## Evidência da FEATURE-WEB-PREVIEW

### Dia 2 — 2026-09-20

- [x] requisitos e spec da preview aprovados antes dos testes
- [x] matriz liga 14/14 critérios de aceite a validações primárias
- [x] fixtures ready, empty, error, metadata e tokens são determinísticas
- [x] dependências web estáveis e exatas registradas no lockfile
- [x] auditorias de dependências de produção e completa sem vulnerabilidades conhecidas
- [x] type-check web verde com Node.js 24.21.0
- [x] type-check completo do monorepo verde para API e web
- [x] RED observado por ausência de comportamento, não por configuração
- [x] 19 testes executados: 14 RED esperados e 5 guards verdes
- [x] fronteiras proíbem Supabase, Prisma, fetch remoto e Client Component desnecessário
- [x] plano de navegador cobre console, overlay, teclado e cinco larguras
- [x] nenhuma publicação, promoção, secret ou mutação Supabase realizada
- [x] comportamento mínimo GREEN — Dia 3
- [x] lint, regressão completa e build Next.js verdes
- [x] verificação em navegador local
- [x] verificação na Preview Deployment

### Dia 3 — 2026-09-21

- [x] 19/19 testes web GREEN após baseline de 14 RED e 5 guards
- [x] estados ready, empty e error normalizados pela camada de aplicação
- [x] adapter demo local e determinístico, sem campos ou claims comerciais
- [x] quatro assets originais inspecionados e rastreados por SHA-256
- [x] Purple Noir aplicado como Dark Luxury + Light Editorial
- [x] metadata útil com `noindex, nofollow`
- [x] axe sem violações serious/critical no componente
- [x] browser sem overlay ou erros de console
- [x] CTA, skip link, foco visível e transferência de foco validados
- [x] 320, 375, 768, 1280 e 1440 px sem overflow; grade 1/2/4
- [x] web lint, type-check, testes e build Next.js verdes
- [x] monorepo lint, 80/80 API + 19/19 web e build verdes
- [x] PostgreSQL isolado desligado após a regressão
- [x] revisão React: Server Components e zero client boundary desnecessário
- [x] nenhum Supabase, API remota, secret, commit, push, PR ou deployment

### Dia 4 — 2026-09-21

- [x] RED observado em 4/4 contratos novos pelo motivo esperado
- [x] estados vazio e erro extraídos em componentes pequenos e acessíveis
- [x] erro público preserva mensagem normalizada sem detalhes de infraestrutura
- [x] quatro PNGs validados por assinatura, dimensões reais e SHA-256
- [x] Open Graph declara `pt_BR` e `noindex, nofollow` permanece ativo
- [x] 23/23 testes web e 80/80 testes API verdes (103/103 total)
- [x] lint, type-check e build completos verdes
- [x] browser verde em 320, 375, 768, 1280 e 1440 px, sem overflow ou console error
- [x] revisão React preservou Server Components e fronteiras de apresentação
- [x] PostgreSQL isolado encerrado e nenhuma integração remota adicionada
- [x] verificação na Preview Deployment concluída em 2026-09-25 para `AC-013`

### Dia 5 — 2026-09-21

- [x] RED observado para otimização de assets e headers antes da implementação
- [x] RED adicional observado para remoção de `X-Powered-By`
- [x] quatro WebPs preservam 1122x1402, framing e qualidade visual aprovada
- [x] assets reduziram de 6.745.439 para 307.958 bytes (95,43%)
- [x] hashes e proveniência atuais registrados; PNGs preservados no histórico Git
- [x] Permissions, Referrer, MIME e frame protection presentes na resposta HTTP
- [x] header de identificação do framework ausente
- [x] 25/25 testes web e 80/80 testes API verdes (105/105 total)
- [x] lint, type-check e build completos verdes
- [x] cinco breakpoints sem overflow/overlay; quatro imagens carregadas
- [x] console do navegador sem warnings ou errors
- [x] PostgreSQL isolado encerrado após regressão
- [x] verificação na Preview Deployment concluída em 2026-09-25 para `AC-013`

### Dia 6 — 2026-09-21

- [x] RED reproduziu a ocultação indevida do link `Início` no mobile
- [x] os três links primários permanecem visíveis em 320–1440 px
- [x] contrato de movimento reduzido preserva todo o conteúdo
- [x] skip link é o primeiro foco e transfere foco ao `main`
- [x] ordem de teclado alcança marca, navegação, CTA e rodapé
- [x] CTA `#colecao` navega para um destino existente e visível
- [x] oito amostras de contraste WCAG AA passaram (7,01:1–12,24:1)
- [x] landmarks, `h1`, idioma, metadata, robots e textos alternativos validados
- [x] 27/27 testes web e 80/80 testes API verdes (107/107 total)
- [x] lint, type-check, build e cinco breakpoints verdes
- [x] console do navegador sem warnings ou errors
- [x] PostgreSQL isolado encerrado após regressão
- [x] verificação na Preview Deployment concluída em 2026-09-25 para `AC-013`

### Dia 7 — 2026-09-21

- [x] 14/14 requisitos e critérios de aceite continuam rastreados
- [x] 28/28 testes web e 80/80 testes API verdes (108/108 total)
- [x] lint, type-check e builds completos verdes
- [x] auditorias completa e de produção sem vulnerabilidades conhecidas
- [x] fluxo rota → aplicação → adapter demo → apresentação verificado
- [x] browser local retorna HTTP 200 com conteúdo, sem overlay ou console issue
- [x] disclosure, ausência de commerce e `noindex, nofollow` preservados
- [x] fronteiras web sem `fetch`, Supabase, Prisma, secrets ou Client Component
- [x] provenance, readiness, rollback e release candidate registrados
- [x] PostgreSQL isolado encerrado após regressão
- [x] Hot Context compactado e próximo passo definido
- [x] commit, push e merge concluídos com autorização humana
- [x] Vercel Preview `READY` e inspeção remota concluídas para `AC-013`
- [x] produção promovida somente após aprovação explícita e validada `READY`

## Evidência do Dia 3 — 2026-09-20

- [x] domínio e casos de uso mínimos implementados a partir dos testes RED
- [x] autorização negativa acontece antes de qualquer repository access
- [x] projeção pública usa allowlist e não inventa disponibilidade
- [x] schema privado `app`, constraints, índices, RLS e revogações validados localmente
- [x] concorrência de slug/SKU/variante/barcode e rollback transacional verificados
- [x] Prisma generate, validate e migrate status verdes
- [x] lint, type-check, testes e build verdes
- [x] auditorias de produção e completa sem vulnerabilidades conhecidas
- [x] Supabase principal preservado sem mutação
- [x] adapters NestJS/Prisma/Auth/Storage e contratos HTTP/OpenAPI implementados no Dia 4
- [x] migrations remotas e advisors pós-migration validados em 2026-09-26; backend/Auth/Storage continuam separados

## Evidência do Dia 4 — 2026-09-20

- [x] Zod é a origem do JSON Schema publicado no OpenAPI do slice
- [x] endpoints retornam `201/200/401/403/404/409/422` conforme contrato
- [x] correlação é propagada em respostas de sucesso e erro
- [x] repository Prisma usa paginação keyset e transação compartilhada
- [x] identidade usa `getClaims`, rejeita anônimo e ignora permissões de `user_metadata`
- [x] upload assinado usa path controlado pelo servidor, limite de 10 MB e `upsert: false`
- [x] build ESM executável validado em runtime contra PostgreSQL 17 isolado
- [x] 11 suítes, 66 testes; 81,48% statements e 83,11% lines
- [x] lint, type-check, build e auditorias completa/produção verdes
- [x] Supabase principal preservado sem migration, bucket, policy ou escrita

## Evidência do Dia 5 — 2026-09-20

- [x] claims Supabase vinculadas ao issuer configurado e validadas por audiência/sessão
- [x] bearer tokens excessivos são negados antes do acesso ao provedor
- [x] UUIDs de rota e correlation IDs externos são limitados na borda HTTP
- [x] falhas lançadas por Storage e Prisma são convertidas em erros estáveis sem detalhes do provedor
- [x] reconciliação de Storage limitada a dez operações concorrentes
- [x] transações interativas limitadas a 2 s de espera e 5 s de execução
- [x] 15 suítes, 76 testes; 82,65% statements, 67,32% branches, 84,09% functions e 84,19% lines
- [x] thresholds globais de cobertura: 80% statements/lines/functions e 60% branches
- [x] GitHub Actions materializado com actions fixadas por SHA e PostgreSQL 17 isolado
- [x] primeira execução remota do pipeline aprovada na PR #6 em 1m07s
- [x] duas migrations aplicadas do zero em database local vazio antes da regressão final
- [x] `EXPLAIN (ANALYZE, BUFFERS)` executado com 10.000 linhas; índice usado e dívida de cursor profundo registrada
- [x] lint, type-check, build e auditorias completa/produção verdes
- [x] Supabase principal preservado sem mutation remota

## Evidência do Dia 6 — 2026-09-20

- [x] RED observado para autenticação, paginação e outcomes ausentes do OpenAPI
- [x] operações admin declaram bearer auth sem tornar a listagem pública protegida
- [x] paginação pública documenta `limit` 1..50, default 20, e cursor opcional
- [x] Swagger UI e OpenAPI JSON são servidos e cobertos por teste
- [x] 16 suítes, 80 testes; thresholds de cobertura preservados
- [x] lint, type-check, build e auditorias completa/produção verdes
- [x] UI, contraste, responsividade, SEO e PWA classificados como diferidos, não aprovados
- [x] Supabase principal preservado sem mutation remota

## Evidência do Dia 7 — 2026-09-20

- [x] duas migrations aplicadas do zero em PostgreSQL 17 isolado
- [x] segunda execução idempotente e migration status atualizado
- [x] 10/10 tabelas com RLS e zero grants para `PUBLIC`/`anon`/`authenticated`
- [x] zero foreign keys sem índice; 12 FKs, 18 checks e 32 indexes inspecionados
- [x] revisão PostgreSQL cobriu UUIDv7, paginação keyset, índices parciais/compostos e transações curtas
- [x] varredura de arquivos versionados sem JWT ou chave secret Supabase
- [x] release readiness e rollback/recovery documentados
- [x] advisors remotos sem findings, classificados como inconclusivos para promoção com projeto `INACTIVE`
- [x] principal Supabase preservado sem mutation remota
- [x] estado final honesto: `READY_FOR_RELEASE`, não `RELEASED`
- [x] GitHub Actions run `35539866962` verde para o commit candidato `f2f2a16` em 1m00s

## Gate de contexto

- Hot Context conciso e apenas com estado/rotas.
- Context Pack selecionado pela tarefa.
- Dependências descobertas antes de editar comportamento.
- Escalada executada ao encontrar referência ausente.
- Histórico não carregado automaticamente.

## Gate DEPLOY-API-AWS — Dia 1 (2026-09-26)

- [x] decisão AWS aprovada e registrada no ADR-005
- [x] 17 requisitos e 17 critérios de aceite possuem IDs estáveis
- [x] arquitetura Vercel → ECS/Fargate → Supabase está explícita
- [x] `sa-east-1`, ECR e ECS Express Mode estão definidos
- [x] contratos de container, health, readiness e SIGTERM estão definidos
- [x] `DATABASE_URL` pooled e migrations separadas do startup estão definidos
- [x] Secrets Manager, IAM mínimo e GitHub OIDC estão no contrato
- [x] logs, retenção, custo, limites, inventário, rollback e teardown estão no contrato
- [x] ambiente Supabase não produtivo é gate antes de deploy remoto
- [x] AWS MCP começa read-only e mutações permanecem sob aprovação
- [x] changelog Supabase revisado; schema atual não usa extensões/operações afetadas
- [x] nenhum arquivo de código, recurso AWS, credencial ou custo foi criado
- [x] matriz 17/17 e testes RED — Dia 2
- [x] implementação local do container/health — Dia 3
- [ ] deploy remoto — somente após gates e autorização específicos

## Gate DEPLOY-API-AWS — Dia 2 (2026-09-26)

- [x] matriz cobre 17/17 requisitos e critérios de aceite
- [x] fixtures são sintéticas e não apontam para conta/banco real
- [x] suíte isolada possui nove contratos executáveis
- [x] Node.js 24.21.0 executou a suíte
- [x] oito REDs falharam pela ausência correta do comportamento/artefato
- [x] guard contra migration/`DIRECT_URL` no startup permaneceu verde
- [x] type-check da API passou no runtime pinado
- [x] regras de pooling, limites, timeout e prepared statements foram incorporadas
- [x] nenhum Supabase remoto, AWS, imagem, custo ou deployment foi acessado
- [x] container/health/shutdown local GREEN — Dia 3
- [x] workflow AWS/OIDC/scan/SBOM materializado — Dia 4

## Gate DEPLOY-API-AWS — Dia 3 (2026-09-27)

- [x] `AWS-HEALTH-001..004` verdes com falha genérica e timeout limitado
- [x] bind explícito em `0.0.0.0:$PORT`
- [x] shutdown idempotente fecha aplicação e Prisma uma única vez
- [x] Dockerfile fixa Node 24.21.0/pnpm 11.19.0 e usuário não-root
- [x] Dockerfile-specific ignore protege o contexto raiz do monorepo
- [x] build limpa outputs antigos antes de gerar o bundle
- [x] pacote runtime contém somente `dist/main.js`, sourcemap e `package.json`
- [x] 10 contratos locais verdes; `AWS-CI-001` diferido explicitamente
- [x] type-check, lint e build verdes no Node.js 24.21.0
- [x] 81/81 testes existentes da API verdes no PostgreSQL local isolado
- [x] smoke HTTP: live/ready 200, listener `0.0.0.0:3101`, shutdown limpo
- [x] PostgreSQL local encerrado e zero acesso Supabase/AWS remoto
- [x] build/run da imagem e smoke no runner Linux — run `36320602513`
- [x] scan e SBOM no runner; OIDC skipped por design — Dia 4

## Gate DEPLOY-API-AWS — Dia 4 (2026-09-27)

- [x] quatro contratos CI falharam antes da criação do workflow
- [x] dois contratos de observabilidade falharam antes da implementação
- [x] 16/16 contratos locais da feature ficaram GREEN
- [x] 97/97 testes completos da API ficaram GREEN no PostgreSQL isolado
- [x] type-check, lint e build passaram no Node.js 24.21.0
- [x] workflow YAML contém build, smoke, Trivy e CycloneDX
- [x] sete Actions estão fixadas por SHA completo
- [x] nenhum access key, login ECR, push de imagem ou deploy ECS foi definido
- [x] OIDC é manual, protegido por environment e limitado a caller identity
- [x] telemetry usa allowlist sem headers, bodies ou detalhes de erro
- [x] nenhum AWS/Supabase remoto ou custo foi acessado
- [x] workflow executado em runner Linux e evidências anexadas — PR #11,
  run `36320602513`
- [x] CORS/rate limit/Swagger de produção — 8 contratos e bundle smoke no Dia 5

## Gate DEPLOY-API-AWS — Dia 5 (2026-09-27)

- [x] TDD registrou RED válido antes do pool e das políticas de borda
- [x] pool de aplicação explícito: máximo 5 conexões por task e 10 no teto atual
- [x] produção exige origens HTTPS explícitas; wildcard é rejeitado
- [x] CORS sem credenciais permite somente a allowlist configurada
- [x] rate limit do catálogo separa clientes atrás de um proxy confiável
- [x] task futura recebe tráfego somente pelo security group do ALB
- [x] Swagger permanece desabilitado em produção
- [x] IAM, custo, digest, rollback e teardown têm plano legível por máquina
- [x] 8/8 contratos do Dia 5 e 105/105 testes completos da API verdes
- [x] bundle e smoke real verdes no Node.js 24.21.0
- [x] audits de produção e completo sem vulnerabilidades conhecidas
- [x] nenhuma mutação AWS, Supabase ou Vercel foi executada
- [ ] build/smoke/Trivy/SBOM do branch no runner Linux
- [ ] estimativa e budget AWS aprovados antes de qualquer criação remota

## Gate de software

- Requisito e critério de aceite possuem IDs estáveis.
- Teste essencial escrito e falhando pelo motivo correto antes da implementação.
- Implementação mínima torna o teste verde.
- Refatoração preserva comportamento.
- Lint, type-check, unitários, integração, E2E aplicável e build verdes.
- Fronteiras web/API/domain/infrastructure respeitadas.
- Código de rota/composição não contém regra de negócio pesada.
- Contratos REST/OpenAPI e Zod permanecem sincronizados.

## Gate de segurança e dados

- Segredos ausentes do cliente e do repositório.
- Autorização não usa `user_metadata`.
- RLS habilitada e testada em tabelas expostas.
- Policies incluem ownership/escopo; `TO authenticated` isolado não é autorização.
- Operações sensíveis de estoque, pedido, pagamento e webhook são idempotentes.
- Dados de medidas são opcionais, minimizados e protegidos.
- LGPD, retenção, consentimento e exclusão foram considerados.
- Dependências fixadas e lockfile commitado.

## Gate de commerce

- SKU é único e representa cor+tamanho.
- Estoque nunca é controlado apenas no produto.
- Reserva, confirmação, baixa, cancelamento e troca reconciliam movimentos.
- Preço e promoções são calculados no servidor.
- Checkout visitante funciona.
- Webhooks possuem assinatura/verificação, replay seguro e observabilidade.
- Não há venda duplicada por retry ou concorrência.

## Gate de experiência

- Layout responsivo e navegação por teclado.
- Contraste, rótulos, foco e mensagens de erro acessíveis.
- Tokens respeitam Purple Noir e evitam hexadecimais duplicados fora da camada de tema.
- Dark Luxury e Light Editorial são aplicados nos contextos definidos, sem transições visuais arbitrárias.
- `#FFFFFF` sobre `#8B5CF6` não é aprovado automaticamente para texto normal: ajustar fundo, peso/tamanho ou combinação até atender ao critério WCAG aplicável.
- Roxo e glow são usados como identidade/destaque, nunca indiscriminadamente.
- Fotografias preservam cores reais, diversidade de corpos, corpo inteiro e detalhes da peça quando disponíveis.
- Página de produto explicita modelo, medidas, caimento e disponibilidade quando existirem.
- Recomendação de tamanho declara que não é garantia.
- SEO, metadata, imagens otimizadas e conteúdo útil verificados.
- PWA/offline/push só são anunciados após testes reais.

## Gate de release

- Critérios de aceite satisfeitos e evidenciados.
- Pipeline obrigatório verde.
- Migração, rollback e recuperação documentados.
- Logs/Sentry/correlação suficientes para fluxos críticos.
- Dívida e riscos remanescentes classificados.
- Backlog, contexto, release record e rastreabilidade atualizados.
- Aprovação humana registrada.

### Estado de `SR-MVP-01-RC1`

- [x] critérios e regressão do escopo candidato satisfeitos
- [x] pipeline obrigatório verde no PR #6 para o commit candidato `f2f2a16`
- [x] migration local do zero e idempotência validadas
- [x] rollback e recuperação documentados
- [x] dívida e riscos remanescentes classificados
- [x] backlog, contexto, release candidate e rastreabilidade atualizados
- [x] Supabase reativado e conexão direta de migration usada sem persistir segredo no Git
- [x] migrations, RLS, grants e advisors pós-promoção validados no ambiente remoto
- [ ] Auth e Storage validados no ambiente remoto
- [ ] backend implantado e observabilidade pública validada

## Gate de promoção Supabase — 2026-09-26

- [x] autorização humana registrada para as duas migrations do catálogo
- [x] Prisma Migrate aplicou as duas migrations e confirmou o status remoto
- [x] auditoria pós-promoção detectou exposição de `public._prisma_migrations`
- [x] `CAT-SEC-009` falhou pelo motivo correto antes da correção
- [x] autorização humana separada registrada para a migration de hardening
- [x] terceira migration habilitou RLS e removeu CRUD de `anon`/`authenticated`
- [x] 10/10 tabelas comerciais com RLS e zero grants de cliente
- [x] advisors sem finding de segurança `ERROR`; findings `INFO` documentados
- [x] 81 testes API e 28 testes web verdes
- [x] type-check, lint, builds e auditorias completa/produção verdes
- [x] evidência e lesson atualizadas
- [ ] backend, Auth, Storage e observabilidade pública aprovados em releases próprias
