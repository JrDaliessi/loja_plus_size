# Quality Gates

## Core Gate

- [x] objetivo do Dia 0 compreendido
- [x] contexto inicial suficiente
- [x] fontes e dependências de fundação verificadas
- [x] critérios de sucesso e riscos iniciais definidos
- [x] rastreabilidade de fontes preservada
- [ ] requisitos centrais do produto aprovados no Dia 1
- [ ] resultado funcional validado
- [x] documentação de fundação atualizada

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
