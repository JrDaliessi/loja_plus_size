---
id: ADR-005
status: accepted
date: 2026-09-26
affects: [apps/api, deployment, ci, observability, security]
derived_from: [project-stack.md, architecture.md, human-decision-2026-09-26]
---

# ADR-005 — NestJS na AWS com ECS Express Mode/Fargate

## Context

A API NestJS precisa de runtime contínuo, health check, encerramento gracioso,
conexão PostgreSQL pooled, logs e rollback. O frontend permanece na Vercel e os
serviços de dados permanecem no Supabase em São Paulo. A escolha também deve
produzir experiência profissional transferível sem introduzir Kubernetes ou
administração manual de servidores antes de existir demanda.

## Decision

1. Hospedar a API em **Amazon ECS Express Mode sobre AWS Fargate**, na região
   `sa-east-1`.
2. Publicar imagens privadas no Amazon ECR e implantar por digest ou tag
   imutável.
3. Usar o HTTPS/load balancer, health checks, autoscaling, logs e rollback
   gerenciados pelo ECS Express Mode.
4. Manter Vercel para `apps/web` e Supabase para PostgreSQL, Auth e Storage;
   AWS não duplicará esses serviços nesta small release.
5. Entregar o container como processo não-root, sem segredos na imagem, ouvindo
   em `0.0.0.0:$PORT` e respondendo liveness/readiness.
6. Fornecer segredos de runtime por AWS Secrets Manager e IAM de menor
   privilégio. CI futura usará OIDC; chaves AWS permanentes no GitHub ficam
   proibidas.
7. Usar apenas `DATABASE_URL` pooled no serviço. `DIRECT_URL` e migrations
   pertencem a um job operacional separado e aprovado; a API nunca executará
   migration no startup.
8. Começar com limites explícitos de tarefas e retenção de logs. Orçamento,
   alertas e custo estimado precisam de aprovação antes da criação remota.
9. Conectar inicialmente a um ambiente Supabase não produtivo. Compartilhar o
   projeto principal por conveniência é bloqueio duro, salvo decisão humana de
   produção acompanhada do gate completo.
10. Configurar o AWS MCP mais tarde em modo somente leitura; comandos de
    mutação continuam sujeitos a aprovação explícita.

## Options Considered

| Opção | Resultado |
|---|---|
| ECS Express Mode/Fargate | Escolhida: container gerenciado, região brasileira, health/rollback e experiência AWS sem operar hosts |
| Railway/Render/Fly.io | Menor esforço inicial, mas menor aderência ao objetivo AWS e/ou região/controle diferentes |
| Lambda | Não escolhida para este slice: exigiria adaptar o processo NestJS e o modelo de conexão antes de haver benefício comprovado |
| EC2 manual | Rejeitada: patching, disponibilidade e segurança operacional desproporcionais |
| EKS | Rejeitada: Kubernetes seria sobre-engenharia para uma API única |
| App Runner | Rejeitada: não aceita novos clientes desde 30/04/2026 |

## Consequences

### Positive

- runtime e banco permanecem na mesma região geográfica;
- deployment containerizado reproduzível e portável;
- HTTPS, health checks, observabilidade e rollback entram no contrato;
- experiência prática com ECR, ECS/Fargate, IAM, Secrets Manager, CloudWatch e
  OIDC pode ser demonstrada com evidências reais.

### Costs and Risks

- Fargate, Application Load Balancer, CloudWatch e tráfego possuem cobrança;
- IAM, rede e segredos aumentam a superfície operacional;
- o acesso externo ao Supabase exige pool, timeouts e monitoramento;
- ambiente não produtivo separado pode ter custo próprio;
- ECS Express Mode abstrai recursos, mas não elimina a obrigação de entender e
  inventariar o que foi criado.

## Validation Required

- testes RED/GREEN para container, endpoints de saúde e SIGTERM;
- varredura da imagem e comprovação de usuário não-root/ausência de segredos;
- smoke do bundle e da imagem em ambiente isolado;
- revisão de IAM, inventário de recursos, orçamento e teardown antes do deploy;
- smoke remoto, logs, alarmes e rollback de uma revisão defeituosa;
- confirmação de ambiente Supabase isolado antes de qualquer integração remota.

## Approval

Aprovado pelo humano em 2026-09-26 após discutir o valor de AWS para o projeto e
para experiência profissional. A aprovação seleciona a arquitetura; não
autoriza criar recursos, custos, credenciais ou fazer deploy.

## Official References

- `https://docs.aws.amazon.com/AmazonECS/latest/developerguide/express-service-overview.html`
- `https://docs.aws.amazon.com/AmazonECS/latest/developerguide/express-service-first-run.html`
- `https://docs.aws.amazon.com/AmazonECS/latest/developerguide/express-service-work.html`
- `https://docs.aws.amazon.com/AmazonECS/latest/developerguide/express-service-best-practices.html`
- `https://docs.aws.amazon.com/pt_br/AmazonECS/latest/developerguide/AWS_Fargate-Regions.html`
- `https://aws.amazon.com/fargate/pricing/`
- `https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-mcp-introduction.html`
