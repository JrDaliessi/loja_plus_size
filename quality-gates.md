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
- [ ] migration remota, advisors pós-migration e rollback de promoção permanecem bloqueados até ambiente autorizado

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
- [ ] Supabase reativado e conexão remota segura disponível
- [ ] migration, Auth, advisors pós-promoção e Storage validados no ambiente remoto
- [ ] backend implantado e observabilidade pública validada
