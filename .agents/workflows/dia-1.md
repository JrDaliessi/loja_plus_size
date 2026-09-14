# Dia 1 — Discovery, Requirements e Specification

## Objetivo

Converter a visão em contrato aprovado do produto e da primeira small release.

## Estados

- Entrada: projeto `FOUNDATION_READY`; artefato `DISCOVERY`.
- Saída: projeto `REQUIREMENTS_READY`/`ARCHITECTURE_READY`; artefato `REQUIREMENTS_READY`/`SPEC_READY`.

## Agents e skills

Conductor, Context Router, Product Requirements; Architecture e Domain Modeling após aprovação do PRD. Skills de PRD, validação, domínio, arquitetura, contratos e small releases.

## Context Pack esperado

Hot Context, brief, fontes, stack, roadmap, backlog, gates e decisões humanas.

## Entradas obrigatórias

Dia 0 aprovado, capability ativa e artefato em discovery.

## Saídas obrigatórias

`docs/product/prd.md`, escopo/não escopo, requisitos e ACs com IDs, métricas, riscos, arquitetura/ADR quando aplicável e feature PRD/spec da primeira release.

## Contrato de validação

Cada requisito é claro, testável, rastreável e aprovado; a spec cobre somente requisitos aprovados.

## Critérios de conclusão

Gates `REQUIREMENTS_APPROVED` e `SPEC_READY` quando necessário.

## Restrições

Sem implementação, integração prematura ou domínio não aprovado.

## Próximo passo

Solicitar aprovação do Dia 2.
