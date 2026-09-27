---
id: AI-003
date: 2026-09-27
status: active
affects: [FEATURE-AWS-API-DEPLOY, container-tests, Dockerfile]
---

# AI-003 — O ignore deve acompanhar o contexto real do build

## Cause

O teste RED inicial assumiu `apps/api/.dockerignore` porque o Dockerfile fica em
`apps/api`. Porém o build precisa da raiz do monorepo para acessar lockfile,
workspace, configuração TypeScript e fontes da API.

## Impact

Um `.dockerignore` dentro de `apps/api` não protege `docker build -f
apps/api/Dockerfile .`. O teste poderia ficar verde sem excluir segredos e
estado local do contexto efetivamente enviado ao daemon.

## Prevention

- declarar o diretório de contexto junto ao Dockerfile;
- para Dockerfile fora da raiz, preferir `<Dockerfile>.dockerignore` ao lado do
  Dockerfile quando o builder suportar o contrato do BuildKit;
- testar o arquivo que o comando de build realmente consome;
- validar o contexto com scanner/inspeção antes de publicar imagem.

## Resolution

O contrato foi corrigido para `apps/api/Dockerfile.dockerignore` e a spec passou
a declarar a raiz do monorepo como contexto. Nenhuma implementação foi alterada
antes dessa correção.
