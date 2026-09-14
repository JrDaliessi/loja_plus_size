# Engineering Rules — Plus Store

Este projeto segue as Regras IDE v4 fornecidas em `AGENTS.md` e aplica Método Akita, XP, Context Engineering, Validation First, TDD para software e small releases.

## Regras absolutas

- Ler `project-context.md` e `context-map.yaml` antes de executar uma fase.
- Tratar os documentos listados em `docs/sources/source-map.md` como fontes de intenção e tecnologia.
- Não avançar de fase sem comando ou aprovação humana explícita.
- Não implementar item em `IDEA`, ambíguo ou bloqueado.
- Escrever validações essenciais antes de comportamento relevante e observar RED antes de GREEN.
- Preservar separação entre `presentation`, `application`, `domain` e `infrastructure` onde ela trouxer clareza real.
- Manter regras de negócio no backend NestJS; UI não acessa persistência diretamente.
- Operar estoque por variante/SKU, com uma fonte central de verdade.
- Não expor segredos, `service_role` ou chaves privadas ao cliente.
- Não usar `user_metadata` para autorização; usar dados controlados pela aplicação e RLS.
- Registrar requisito, decisão, teste, mudança, risco e validação.
- Não criar todas as features de uma vez; respeitar `roadmap.md` e `backlog.md`.

## Autoridade por assunto

- Processo: `AGENTS.md` e este arquivo.
- Intenção: `project-brief.md` e fontes originais.
- Produto: futuro `docs/product/prd.md` aprovado.
- Arquitetura: futuro `architecture.md` e ADRs ativos.
- Estado atual: `project-context.md`.
- Prioridade: `backlog.md` e `roadmap.md`.
- Validação: testes e `quality-gates.md`.

## Segurança operacional

Aplicar `docs/governance/ai-jail.md` a scripts, serviços externos, banco, autenticação, pagamentos, webhooks, deploys e exclusões.
