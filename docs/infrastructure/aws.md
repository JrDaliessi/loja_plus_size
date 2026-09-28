# AWS Infrastructure — Planned Baseline

Status: `SPEC_READY`; nenhum recurso criado em 2026-09-26.

## Approved Boundary

- conta/alvo AWS: ainda não validado;
- região: `sa-east-1`;
- runtime: ECS Express Mode/Fargate;
- registry: ECR privado;
- segredos: Secrets Manager;
- logs/alarmes: CloudWatch;
- CI/CD: GitHub Actions por OIDC;
- banco/Auth/Storage: permanecem no Supabase;
- AWS MCP: não configurado; começar read-only quando necessário.

## Prohibited Until Explicit Approval

- criar, alterar ou remover recursos AWS;
- aceitar custo sem estimativa e budget;
- usar access key permanente;
- copiar segredo para Git, imagem, build arg ou log;
- conectar staging ao Supabase principal por conveniência;
- executar migrations no startup;
- remover recursos por glob, conta ou região não verificada.

## Pre-deployment Checklist

- [ ] identidade, conta e região confirmadas por chamada read-only;
- [ ] alvo Supabase não produtivo confirmado;
- [ ] estimativa mensal e componentes de custo apresentados;
- [ ] budget/alertas e mínimo/máximo de tasks aprovados;
- [ ] Terraform/CDK/configuração exportável decidida;
- [ ] roles IAM revisadas por menor privilégio;
- [ ] inventário e tags definidos;
- [ ] rollback e teardown revisados;
- [ ] aprovação humana específica para criação remota.

## Supabase Compatibility Note

O runtime receberá `DATABASE_URL` pooled. `DIRECT_URL` é reservado à execução
operacional de migrations e não será injetado na task. A revisão do changelog do
Supabase em 2026-09-26 não encontrou construções afetadas (`ltree`, `pgcrypto`,
`btree_gist` ou operadores customizados) no schema/migrations atuais.

## Resource Inventory

Será preenchido antes da primeira mutação. Cada item deve registrar ARN/ID,
região, ambiente, owner, custo esperado, origem IaC e ordem de teardown.

O contrato local de hardening está em `docs/infrastructure/aws-hardening.yaml`.
Ele limita o primeiro desenho a uma task desejada, máximo de duas tasks e pool
de cinco conexões por task. Esses valores são guardrails de pré-deploy, não
autorização para criar recursos.

## Day 5 Hardening Baseline

- IAM foi separado em identidade read-only, publicação de imagem, deploy,
  execution role e application task role; nenhuma role recebe administração;
- a task de aplicação não precisa chamar APIs AWS no runtime atual;
- imagem será promovida por digest, com tags imutáveis, scan e retenção limitada;
- rollback usa o último digest saudável e não executa migration de banco;
- a task não terá ingresso público direto: somente o security group do ALB
  poderá alcançar a porta da aplicação, preservando a fronteira de proxy;
- teardown exige inventário exato e preserva Supabase, Vercel e evidência de logs;
- estimativa monetária permanece `pending_human_approval`: a AWS Pricing
  Calculator de `sa-east-1`, orçamento e alertas devem ser aprovados antes de
  qualquer criação, sem assumir créditos ou Free Tier;
- o rate limit local é defesa em profundidade por task; enforcement distribuído
  será obrigatório antes de escalar horizontalmente ou abrir operação comercial.

Fontes de preço e componentes variáveis estão registrados no YAML para impedir
que um valor temporal seja tratado como orçamento aprovado.

## Day 4 CI Safety Baseline

`.github/workflows/api-deploy.yml` constrói uma imagem local no runner, executa
smoke com PostgreSQL isolado, bloqueia vulnerabilidades HIGH/CRITICAL corrigíveis
e publica somente o SBOM CycloneDX como artefato temporário. `push: false`, não
há login ECR nem comando ECS.

O job `validate-aws-identity` não é automático. Ele exige:

- `workflow_dispatch` com `validate_aws_identity=true`;
- environment protegido `aws-staging-readonly`;
- variables `AWS_READONLY_ROLE_ARN` e `AWS_ACCOUNT_ID`;
- role com trust policy restrita ao repositório e ao environment;
- autorização humana antes da primeira execução.

Sua única chamada AWS permitida nesta etapa é `sts:GetCallerIdentity`. O job não
foi executado no Dia 4 local.
