# FEATURE-CATALOG Test Plan — Dia 2

## Metadata

| Campo | Valor |
|---|---|
| ID | `TESTPLAN-CAT001` |
| Small release | `SR-MVP-01` |
| Estado | `IN_PROGRESS` — RED preservado como evidência e contrato mínimo GREEN no Dia 3 |
| Derived from | `FPRD-CAT001-RQ-001..018`, `FPRD-CAT001-AC-001..020`, `FSPEC-CAT001`, `CAT-INV-001..012` |
| Runtime validado | Node.js `24.21.0` LTS |
| Package manager | pnpm `11.19.0` |

## Objective

Demonstrar, antes da implementação funcional, quais comportamentos faltam e como cada requisito será validado. Uma falha RED aceitável precisa alcançar o contrato testado e falhar por comportamento ausente ou incorreto, não por import quebrado, dependência ausente ou configuração inválida.

## Scope

- value objects, invariantes e transições do catálogo;
- casos de uso com portas falsas/in-memory;
- autorização negativa antes de efeitos persistentes;
- projeção pública sem dados internos ou disponibilidade inventada;
- mapeamento estável de erros de persistência;
- contratos PostgreSQL de unicidade, concorrência, cursor e atomicidade;
- boundary de Storage e reconciliação;
- isolamento das tabelas comerciais da Data API;
- rastreabilidade requisito → critério → teste.

## Test Layers

| Grupo | Camada | Estratégia | Estado de ambiente |
|---|---|---|---|
| `CAT-DOM-*` | Domain | Jest, funções puras e fixtures determinísticas | disponível |
| `CAT-APP-*` | Application | Jest, fake ports e unidade de trabalho observável | disponível |
| `CAT-API-*` | Presentation/contract | Jest sobre projeções; Nest/Supertest após controller existir | parcial |
| `CAT-DB-*` | PostgreSQL/Prisma | banco local isolado, constraints e concorrência real | executável; RED por schema `app` ainda ausente |
| `CAT-STO-*` | Supabase Storage | contract tests e cenários de reconciliação | RED de contrato confirmado; baseline remoto confirma bucket ausente |
| `CAT-SEC-*` | Authorization/Data API | negação por padrão, projeção pública e grants/RLS | RED unitário/local executável; baseline remoto sem grants comerciais |
| `CAT-TRACE-*` | Architecture/traceability | verificação de campos proibidos e matriz completa | disponível |

## RED Contract

1. Criar primeiro o teste com ID estável ligado a um critério de aceite.
2. Executar com Node.js 24.21.0 e dependências pinadas.
3. Aceitar RED somente quando o teste chega ao placeholder e acusa comportamento não implementado ou resultado incompatível.
4. Não aceitar `Cannot find module`, erro de parser, configuração ou credencial ausente como RED funcional.
5. Manter testes de integração impossíveis como `todo` explícito, com bloqueio rastreado; nunca simulá-los como aprovados.
6. No Dia 3, implementar o mínimo para GREEN sem alterar o contrato aprovado.

## Security Cases

- ator sem `catalog:write` não toca repository nem unidade de trabalho;
- `catalog:write`, `catalog:publish` e `media:write` permanecem permissões distintas;
- DTO público usa allowlist e nunca serializa entidade/persistência diretamente;
- `user_metadata` não participa de autorização;
- chave secret/service role nunca entra no cliente, fixture, log ou repositório;
- tabelas internas ficam em schema não exposto ou sem grants de Data API;
- tabelas expostas exigem grants mínimos e RLS testada;
- schema `storage` é somente leitura; upload, move e delete usam Storage API;
- Storage upsert, quando existir, exige cenários `INSERT + SELECT + UPDATE`;
- URL assinada é transitória e nunca substitui `storagePath` persistente.

## Supabase Changelog Impact — 2026-09-14

- Novas tabelas em `public` deixam de ser autoexpostas gradualmente; testes devem verificar grants e não inferir exposição pelo schema.
- A especificação OpenAPI da Data API não pode mais ser obtida com anon key; baseline usa acesso administrativo autorizado, sem promover secret key a ferramenta de cliente.
- Objetos nos schemas `auth`, `storage` e `realtime` possuem restrições de alteração; a aplicação não cria nem altera estruturas internas desses produtos.
- Cliente Supabase atual exige Node.js 22+; o runtime escolhido 24.21.0 satisfaz o requisito.

## Commands

```text
pnpm type-check
pnpm type-check:prisma7-spike
pnpm test:catalog:red
pnpm test:catalog:postgres:red
pnpm spike:prisma7
```

Durante o Dia 2, `test:catalog:red` deve terminar vermelho pelos contratos ainda não implementados. O comando só se torna verde no Dia 3.

## Exit Criteria

- [x] todos os 20 critérios possuem teste primário na matriz;
- [x] fixtures determinísticas foram definidas;
- [x] RED de domínio/aplicação/API confirmado pelo motivo correto;
- [x] testes PostgreSQL essenciais executáveis e RED pelo motivo correto;
- [x] contratos Storage/Data API executáveis e baseline Supabase verificado;
- [x] gate técnico `VALIDATION_READY` concluído; avanço ao Dia 3 depende de aprovação humana.

## Approval

Execução do Dia 2 confirmada pelo humano em 2026-09-14. A conclusão do gate permanece condicionada às evidências RED e ao tratamento formal dos bloqueios de infraestrutura.

## Execution Evidence — 2026-09-14

| Verificação | Resultado |
|---|---|
| Runtime selecionado | Node.js `24.21.0` via `pnpm env` |
| Dependências | versões exatas + `pnpm-lock.yaml` |
| Supply chain | scripts permitidos somente para `@swc/core`, `unrs-resolver`, `prisma` e `@prisma/engines`; demais entradas declaradas permanecem negadas |
| Type-check | PASS — 1 pacote, 1 tarefa |
| Audit | PASS — nenhuma vulnerabilidade conhecida |
| RED | CONFIRMADO — 4 suítes falharam, 21 testes falharam, 7 `todo`, 28 total |
| Causa das falhas | `CatalogNotImplementedError` ou diferença entre erro esperado e placeholder |
| Erros de configuração/import | zero após correção de `moduleResolution: Bundler` |
| Rastreabilidade | PASS — 20/20 critérios presentes na matriz e nos testes |
| Credenciais no repositório | zero tokens detectados |

Essa evidência parcial foi substituída pela execução final abaixo; os sete
`todo` deixaram de existir após o ambiente local isolado ser validado.

## Completion Evidence — corrigida em 2026-09-15

| Verificação | Resultado |
|---|---|
| Supabase baseline | PASS somente leitura; `public` vazio, `app` ausente, zero migrations/buckets/functions/advisors |
| PostgreSQL isolado | PASS — PostgreSQL 17, `plus_store_day2_test`, localhost:55432 |
| Integração RED | CONFIRMADO — 7/7 testes executados e falhando por relações `app.*` ainda ausentes |
| Suíte RED completa | CONFIRMADO — 5 suítes, 28 testes executados, 28 RED, zero `todo` |
| Prisma 7 spike | PASS — migration revisada, generate, CRUD, P2002, rollback e cleanup |
| Type-check | PASS — aplicação e spike |
| Auditoria de produção | PASS — zero vulnerabilidades conhecidas |
| Segurança da toolchain | PASS — auditorias de produção e completa sem vulnerabilidades conhecidas; zero peer conflicts |
| Aviso não vulnerável | `glob@10.5.0` deprecated somente na árvore dev de cobertura Jest; `DEBT-DEP-001` |

Os antigos sete `todo` foram removidos. O teste protege explicitamente contra
hosts remotos e aceita somente o database local `plus_store_day2_test`.

## Dia 3 GREEN Evidence — 2026-09-20

| Verificação | Resultado |
|---|---|
| Suíte completa | PASS — 5 suítes, 28 testes, zero `todo` |
| PostgreSQL | PASS — 7 cenários reais de constraints, concorrência, transação, cursor e privilégios |
| Prisma | PASS — generate, validate, 2 migrations e status local atualizado |
| Cobertura | 81,93% statements; 62,76% branches; 90,32% functions; 80,15% lines |
| Type-check | PASS |
| Lint | PASS — ESLint 10.10.0 e typescript-eslint 8.70.0 pinados |
| Build | PASS |
| Auditorias | PASS — produção e completa sem vulnerabilidades conhecidas |
| Supabase remoto | não alterado; migration restrita aos bancos PostgreSQL locais isolados |

Os nomes `tests/red` e `test:catalog:red` foram preservados como rastreabilidade
do ciclo TDD que originou os contratos. No Dia 3, os mesmos testes passaram GREEN
sem redução das expectativas aprovadas.
