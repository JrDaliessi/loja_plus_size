# Dia 7 — Quality, Safety, Delivery e Context Finalization

## Objetivo

Executar gates finais, preparar release, registrar evidências e compactar contexto.

## Estados

- Entrada: artefato refinado e riscos críticos tratados.
- Saída: `READY_FOR_RELEASE`, `RELEASED` ou `BLOCKED`.

## Agents e skills

Conductor, Context Router, Quality Gate, Living Documentation e Security conforme risco.

## Context Pack esperado

Requisitos, specs, código/artefato, testes, pipeline, segurança, observabilidade, migrations, rollback, backlog e contexto.

## Entradas obrigatórias

Validações relevantes existentes e entrega candidata.

## Saídas obrigatórias

Gate final, release record, rastreabilidade, backlog/estado atualizados, riscos, dívida e Hot Context compactado.

## Contrato de validação

Todos os gates obrigatórios verdes; desvio somente se não crítico e aceito explicitamente.

## Critérios de conclusão

Entrega verificável, recuperável e aprovada pelo humano.

## Restrições

Sem liberar na confiança, mascarar dívida crítica ou ignorar pipeline vermelho.

## Próximo passo

Selecionar a próxima small release somente após decisão humana.
