# Dia 2 — Validation Strategy

## Objetivo

Transformar requisitos aprovados em matriz de testes, cenários, fixtures e testes RED.

## Estados

- Entrada: requisitos aprovados, spec pronta e small release priorizada.
- Saída: artefato `VALIDATION_READY` (`TEST_STRATEGY_READY`).

## Agents e skills

Conductor, Context Router, TDD First; Domain/Security quando o risco exigir. Derivação de cenários, tests first e rastreabilidade.

## Context Pack esperado

PRD/feature PRD, spec, arquitetura, domínio, gates, código/schema/testes afetados se existirem.

## Entradas obrigatórias

Critérios de aceite estáveis e definição do slice.

## Saídas obrigatórias

Matriz requisito→teste, fixtures, contratos, riscos e evidência RED correta.

## Contrato de validação

Cobertura proporcional de domínio, aplicação, infraestrutura crítica, apresentação e E2E.

## Critérios de conclusão

Falhas demonstram ausência do comportamento, não erro de configuração.

## Restrições

Sem implementação funcional relevante.

## Próximo passo

Solicitar aprovação do Dia 3.
