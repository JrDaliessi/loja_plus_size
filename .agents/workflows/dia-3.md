# Dia 3 — Minimum Validated Execution

## Objetivo

Implementar o mínimo necessário para tornar verde o contrato da small release.

## Estados

- Entrada: `VALIDATION_READY` com testes RED.
- Saída: `IN_PROGRESS` com incremento mínimo GREEN.

## Agents e skills

Conductor, Context Router, TDD First e XP Pair Programmer; especialista adicional somente por dependência concreta.

## Context Pack esperado

Spec, testes, arquitetura, módulos afetados, contratos e decisões relacionadas.

## Entradas obrigatórias

Escopo recortado, RED válido e ambiente operacional.

## Saídas obrigatórias

Implementação mínima, evidência GREEN, regressão e atualização de status.

## Contrato de validação

Testes-alvo e regressão aplicável verdes; lint/type-check no escopo.

## Critérios de conclusão

Comportamento do slice funciona sem expansão ou abstração prematura.

## Restrições

Sem item paralelo ou feature fora da spec.

## Próximo passo

Solicitar aprovação do Dia 4.
