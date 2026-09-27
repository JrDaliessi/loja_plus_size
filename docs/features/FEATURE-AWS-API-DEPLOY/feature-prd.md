---
id: FEATURE-AWS-API-DEPLOY
small_release: SR-INFRA-API-01
status: REQUIREMENTS_APPROVED
version: 1.0
date: 2026-09-26
derived_from: [project-brief.md, project-stack.md, architecture.md, ADR-005]
---

# Feature PRD — API NestJS na AWS

## Problem

A API do catálogo existe, mas ainda não possui runtime remoto validado. Sem uma
implantação reproduzível não há URL estável, health check, logs, rollback ou
evidência operacional para integrar a Vercel com segurança.

## User and Value

- **Equipe técnica:** implanta e diagnostica a API com processo repetível.
- **Frontend Vercel:** consome um endpoint HTTPS estável quando a integração for
  autorizada.
- **Operação:** conhece custo, recursos, versão implantada e caminho de rollback.
- **Portfólio profissional:** demonstra AWS com segurança, observabilidade e
  CI/CD reais, não apenas um serviço criado pelo console.

## Expected Outcome

Uma imagem imutável da API, validada localmente e preparada para implantação em
ECS Express Mode/Fargate `sa-east-1`, com contrato de saúde, shutdown, segredos,
observabilidade, custo e rollback. A publicação remota só ocorre depois do gate
de ambiente e de uma autorização específica.

## Scope

- Docker de produção para `apps/api`;
- liveness, readiness e encerramento por `SIGTERM`;
- ECR + ECS Express Mode/Fargate em `sa-east-1`;
- HTTPS/load balancer e health check gerenciados;
- Secrets Manager, IAM mínimo e OIDC para CI/CD;
- logs CloudWatch correlacionados, retenção e alarmes essenciais;
- limites de escala, orçamento, tags, inventário e teardown;
- smoke, canary/rollback e documentação operacional;
- conexão runtime pooled a um Supabase não produtivo aprovado.

## Non-Scope

- migrar PostgreSQL, Auth ou Storage para AWS;
- criar EKS, EC2, RDS, Redis ou filas;
- habilitar Auth/Storage remotos nesta release;
- executar migrations no startup da API;
- integrar a Vercel com a nova URL antes do gate remoto;
- usar dados reais em staging;
- configurar domínio comercial definitivo;
- escolher silenciosamente Terraform, CDK ou outra ferramenta de IaC.

## Requirements

| ID | Requisito |
|---|---|
| `FPRD-AWSAPI001-RQ-001` | A API deve ser empacotada em imagem reproduzível com Node `24.21.0` e pnpm `11.19.0`. |
| `FPRD-AWSAPI001-RQ-002` | O processo deve executar como usuário não-root, sem segredos em imagem, layer ou log. |
| `FPRD-AWSAPI001-RQ-003` | O servidor deve ouvir em `0.0.0.0` e respeitar `PORT`. |
| `FPRD-AWSAPI001-RQ-004` | `/health/live` deve provar vida do processo sem depender de serviço externo. |
| `FPRD-AWSAPI001-RQ-005` | `/health/ready` deve validar prontidão e banco com timeout curto, resposta genérica e sem vazar infraestrutura. |
| `FPRD-AWSAPI001-RQ-006` | `SIGTERM` deve parar novas requisições, fechar Nest/Prisma uma única vez e terminar dentro do grace period. |
| `FPRD-AWSAPI001-RQ-007` | Runtime usa `DATABASE_URL` pooled; `DIRECT_URL` e migrations ficam ausentes do startup. |
| `FPRD-AWSAPI001-RQ-008` | A implantação deve usar ECS Express Mode/Fargate e ECR em `sa-east-1`, por referência imutável da imagem. |
| `FPRD-AWSAPI001-RQ-009` | Segredos devem vir do Secrets Manager e roles IAM distintas devem seguir menor privilégio. |
| `FPRD-AWSAPI001-RQ-010` | CI/CD deve autenticar na AWS com OIDC e não com access keys permanentes. |
| `FPRD-AWSAPI001-RQ-011` | Logs estruturados devem preservar `correlationId`, ocultar segredos e ter retenção limitada. |
| `FPRD-AWSAPI001-RQ-012` | CPU/memória, mínimo/máximo de tarefas, orçamento e alertas precisam ser definidos e aprovados antes da criação remota. |
| `FPRD-AWSAPI001-RQ-013` | Cada deploy deve executar smoke e permitir rollback para a última imagem saudável. |
| `FPRD-AWSAPI001-RQ-014` | Staging não pode compartilhar credenciais/dados do Supabase principal por conveniência. |
| `FPRD-AWSAPI001-RQ-015` | A imagem deve passar por scanner, sem vulnerabilidade crítica/alta não aceita, e produzir inventário/SBOM quando suportado. |
| `FPRD-AWSAPI001-RQ-016` | CORS, rate limit e exposição de Swagger devem ter política explícita antes da URL ser tratada como pública. |
| `FPRD-AWSAPI001-RQ-017` | Toda mutação via AWS MCP/CLI requer alvo identificado, dry-run quando possível e autorização humana proporcional. |

## Acceptance Criteria

| ID | Critério de aceite |
|---|---|
| `FPRD-AWSAPI001-AC-001` | Build limpo produz duas imagens equivalentes e identifica Node/pnpm esperados. |
| `FPRD-AWSAPI001-AC-002` | Inspeção da imagem confirma usuário não-root e varredura não encontra segredo conhecido. |
| `FPRD-AWSAPI001-AC-003` | Container iniciado em porta arbitrária responde por `0.0.0.0`. |
| `FPRD-AWSAPI001-AC-004` | Liveness permanece saudável sem consultar banco. |
| `FPRD-AWSAPI001-AC-005` | Readiness fica saudável com banco e falha de modo estável/limitado quando a conexão cai. |
| `FPRD-AWSAPI001-AC-006` | Teste de `SIGTERM` termina no prazo, sem nova aceitação de tráfego nem duplo disconnect. |
| `FPRD-AWSAPI001-AC-007` | Startup não contém `prisma migrate`, não exige `DIRECT_URL` e usa somente pool runtime. |
| `FPRD-AWSAPI001-AC-008` | Plano remoto aponta ECR/ECS Express em `sa-east-1` e digest imutável. |
| `FPRD-AWSAPI001-AC-009` | Matriz de IAM/segredos comprova acesso mínimo e nenhum valor sensível versionado. |
| `FPRD-AWSAPI001-AC-010` | Workflow aprovado usa GitHub OIDC; busca no repositório não encontra AWS access key. |
| `FPRD-AWSAPI001-AC-011` | Smoke correlacionado aparece no CloudWatch sem token, URL de banco ou PII. |
| `FPRD-AWSAPI001-AC-012` | Estimativa mensal, orçamento, alarmes, tags e teto de escala recebem aceite antes do deploy. |
| `FPRD-AWSAPI001-AC-013` | Uma revisão defeituosa é detectada e o rollback restaura a última revisão saudável. |
| `FPRD-AWSAPI001-AC-014` | Alvo Supabase não produtivo e credenciais próprias são evidenciados antes da integração remota. |
| `FPRD-AWSAPI001-AC-015` | Scanner e SBOM não deixam finding crítico/alto sem exceção registrada. |
| `FPRD-AWSAPI001-AC-016` | Contratos automatizados verificam CORS/rate limit/Swagger conforme política aprovada. |
| `FPRD-AWSAPI001-AC-017` | Log de execução registra identidade, região, conta, ação, resultado e rollback das mutações autorizadas. |

## Success Metrics

- 17/17 critérios rastreados;
- pipeline local de imagem reproduzível e verde;
- zero segredo ou chave AWS permanente no repositório;
- zero finding crítico/alto sem aceite;
- health, shutdown, smoke e rollback comprovados;
- custo máximo mensal e teto de escala aprovados antes da criação;
- nenhum dado real usado em staging.

## Risks and Dependencies

- conta/perfil AWS e AWS MCP ainda não configurados;
- ambiente Supabase não produtivo ainda não selecionado;
- ALB pode representar parcela relevante do custo inicial;
- IaC permanece decisão aberta e não bloqueia os testes locais do container;
- exposição pública antes de Auth/rate limit amplia risco de abuso.

## Approval

Requisitos aprovados pelo humano em 2026-09-26 ao confirmar o início desta
small release. A aprovação não autoriza infraestrutura remota ou cobrança.
