# Software Architecture — Plus Store

## Metadata

| Campo | Valor |
|---|---|
| ID | `ARCHITECTURE-001` |
| Versão | `1.0` |
| Estado | `APPROVED` |
| Fase | Dia 1B |
| Derived from | `PRODUCT-PRD 1.0`, `project-stack.md`, `SRC-STACK-001` |
| Primeiro slice | `SR-MVP-01 / FEATURE-CATALOG` |

Este documento define a arquitetura inicial proporcional ao MVP. As decisões desta versão foram aprovadas pelo humano em 2026-09-14. Ele não autoriza scaffold, instalação de dependências, schema ou migrations.

## Architecture Drivers

1. Produto e variante/SKU devem ser fontes centrais e consistentes.
2. Checkout visitante, pagamento e estoque exigirão regras transacionais e idempotentes.
3. A vitrine precisa de SEO, desempenho, acessibilidade e fotografia fiel.
4. Regras comerciais devem permanecer fora da UI e de integrações concretas.
5. Supabase fornece PostgreSQL, Auth e Storage; NestJS continua sendo o cérebro comercial.
6. A visão completa deve crescer por small releases, sem infraestrutura futura antecipada.
7. Segurança, LGPD e rastreabilidade são requisitos de arquitetura, não acabamento.

## System Context

```text
Cliente / Operação
        |
        v
Next.js 16 / React
        |
        | REST HTTPS / OpenAPI
        v
NestJS / Application + Domain
        |
        +--> Prisma 8 --> PostgreSQL / Supabase
        +--> Supabase Auth (identidade)
        +--> Supabase Storage (mídia)
        +--> Mercado Pago / frete / canais (releases futuras)
```

## Container Boundaries

### `apps/web`

- Next.js 16.3.x App Router.
- Server Components por padrão para páginas e leitura de dados.
- Client Components apenas para interação, estado efêmero e APIs do navegador.
- Comunicação comercial exclusivamente com a API NestJS; nenhum acesso direto a tabelas.
- Cliente Supabase permitido somente para fluxos de Auth explicitamente aprovados.
- Purple Noir centralizado em tokens de `packages/ui` quando a primeira interface entrar em escopo.
- Node.js runtime por padrão; Edge não será adotado sem requisito mensurável.
- `proxy.ts` será usado como último recurso para roteamento/redirects, nunca como lugar de regra de negócio ou autorização final.

### `apps/api`

- NestJS expõe REST versionado e OpenAPI.
- Controllers apenas adaptam HTTP, validação e identidade para casos de uso.
- Casos de uso coordenam domínio e portas; não dependem de HTTP, Prisma ou Supabase.
- Domínio contém invariantes puras.
- Infrastructure implementa persistência, Auth, Storage, pagamento, frete e canais.
- Toda autorização protegida é validada no backend, independentemente de controles da web.

### `packages/contracts`

- DTOs públicos e schemas Zod compartilháveis.
- Tipos serializáveis e independentes de Prisma/Nest/React.
- Contrato OpenAPI da API permanece a fonte HTTP; geração ou checagem evitará drift.
- Não contém entidades de domínio nem regras internas.

### `packages/ui`

- Tokens e componentes visuais reutilizáveis do Purple Noir.
- Sem consulta de dados, regra comercial ou dependência do domínio.
- Criado incrementalmente quando uma release exigir UI.

### Demais pacotes planejados

`config`, `eslint-config`, `tsconfig` e `testing` podem centralizar configuração necessária. Um pacote `utils` genérico não será criado antecipadamente; utilidades permanecem próximas da feature até existir reutilização real.

## Monorepo Target

```text
apps/
  web/
    src/
      app/
      features/
      shared/
      infrastructure/
  api/
    src/
      modules/
      shared/
      infrastructure/
packages/
  contracts/
  ui/
  config/
  eslint-config/
  tsconfig/
  testing/
```

Somente diretórios necessários ao primeiro slice serão materializados no scaffold.

## Feature-Based Clean Architecture

Cada módulo relevante segue, pragmaticamente:

```text
<feature>/
  presentation/     # controller, presenter ou UI
  application/      # casos de uso, comandos, queries e portas
  domain/           # entidades, value objects, regras e contratos puros
  infrastructure/   # Prisma, Supabase e integrações concretas
  tests/            # testes próximos ao comportamento
```

Regras de dependência:

```text
presentation --> application --> domain
infrastructure --> application/domain contracts
domain --> nenhuma camada externa
```

- Domain não importa NestJS, Prisma, Supabase, React ou Zod de transporte.
- Application depende de interfaces/ports, não de adapters concretos.
- Presentation não chama persistência.
- Infrastructure não define regra de negócio.
- Dependências cross-feature passam por contratos de aplicação ou eventos aprovados.

## Initial Bounded Modules

| Módulo | Responsabilidade | Entrada planejada |
|---|---|---|
| `catalog` | Produto, categoria, marca, coleção mínima, cor, tamanho, variante e mídia | `SR-MVP-01` |
| `inventory` | Saldo, reserva e movimentos por SKU | `SR-MVP-02` |
| `storefront` | Vitrine, busca, filtros e página de produto | `SR-MVP-03` |
| `cart` | Carrinho visitante e reconciliação | `SR-MVP-04` |
| `checkout` | Identificação, endereço, revisão e orquestração | `SR-MVP-05` |
| `shipping` | Porta e adapters de frete | `SR-MVP-05` |
| `orders` | Pedido e estados auditáveis | `SR-MVP-06` |
| `payments` | Porta Mercado Pago, webhooks e reconciliação | `SR-MVP-06` |
| `auth` | Identidade Supabase e autorização de aplicação | habilitação mínima quando endpoint protegido entrar |
| `admin` | Experiência operacional autorizada | `SR-MVP-07` |

Módulos futuros somente entram quando sua release for selecionada.

## Web Architecture

### Routing

- Route groups poderão separar `(store)`, `(account)` e `(admin)` sem alterar URLs.
- `page.tsx` e `layout.tsx` são composição, sem regra comercial.
- `loading.tsx`, `error.tsx` e `not-found.tsx` serão definidos por jornada relevante.
- Parâmetros, cookies e headers serão tratados pelas APIs assíncronas do Next.js 16.

### Data flow

```text
Server Component
  -> typed Nest API client
  -> REST/OpenAPI
  -> Nest controller
  -> use case
  -> repository port
```

- Leituras iniciais serão iniciadas em paralelo quando independentes e poderão usar Suspense.
- Dados enviados a Client Components devem ser DTOs serializáveis; `Date`, `Map`, classes e objetos Prisma não atravessam a fronteira.
- Client Components nunca serão funções `async`.
- Server Actions, quando usadas, serão adapters finos para a API NestJS; não duplicarão regras comerciais.
- Route Handlers não formarão um segundo backend. Só entram para necessidades específicas da plataforma web.

### Caching

- Nenhum cache de catálogo será ativado até o contrato de invalidação estar definido na release de storefront.
- Dados de preço e estoque terão política mais restrita que conteúdo editorial.
- Cache Components/PPR são opções posteriores e exigem teste de atualização e invalidação.

## API Architecture

- Prefixo planejado: `/v1`.
- Erros públicos usarão envelope estável com `code`, `message`, `details?` e `correlationId`.
- IDs públicos serão opacos.
- Paginação será por cursor quando o volume justificar; contratos iniciais não assumirão offset ilimitado.
- Commands aceitam idempotency key quando a operação puder ser repetida com efeito comercial.
- DTOs de dinheiro usam representação decimal serializável e moeda ISO; nunca `number` de ponto flutuante como autoridade.
- Datas públicas usam ISO 8601 UTC.

## Data Architecture

### Estratégia de schema

Proposta: tabelas comerciais em schema PostgreSQL não exposto, inicialmente `app`, acessado pelo NestJS com um papel de banco de menor privilégio. O schema `public` não será tratado automaticamente como API.

Essa proposta depende do baseline do projeto Supabase. Se o schema existente impedir a adoção sem risco, um ADR revisará a decisão antes de migrations.

### Regras de modelagem

- Identificadores SQL em `snake_case` minúsculo.
- Chaves primárias opacas e ordenáveis quando suportadas sem extensão não auditada.
- `timestamptz` para instantes.
- Valores monetários exatos; sem `float`.
- Constraints preservam invariantes simples no banco.
- Toda foreign key consultada recebe índice apropriado.
- Índices compostos derivam de queries reais; igualdade antes de intervalo.
- Toda migration deve ter rollback/recuperação e validação.
- Transações mantêm locks pelo menor tempo possível e nunca aguardam APIs externas.

### Prisma 8

Prisma 8 permanece a decisão aprovada, mas está em Release Candidate. A arquitetura não dependerá de recursos ainda ausentes, incluindo a maioria dos nested writes, atomic `increment`, configuração de isolation level e códigos de erro no estilo `P2002`, até validação.

- CLI e biblioteca PostgreSQL terão versões exatas fixadas no scaffold.
- `@prisma/client` não será assumido como runtime do Prisma 8.
- A persistência será encapsulada em adapters para limitar impacto de mudança da RC.
- Operações críticas poderão exigir SQL explícito ou revisão da decisão, sempre por ADR e aprovação humana.

## Supabase Boundaries

### PostgreSQL

- Conexão direta somente no NestJS e ferramentas autorizadas.
- Credenciais ficam em ambiente seguro, nunca em `NEXT_PUBLIC_*`.
- Aplicação não usa superuser nem `service_role` como conexão genérica.

### Auth

- Supabase Auth emite identidade; NestJS valida o token e aplica autorização.
- `user_metadata` não participa de decisão de acesso.
- Papéis ficam em dados controlados pela aplicação ou `app_metadata` com estratégia de atualização de sessão.
- A autorização final permanece no backend e, quando houver Data API, também em grants/RLS.

### Data API e RLS

- Frontend não consulta tabelas comerciais diretamente.
- Schemas expostos terão grants mínimos e RLS habilitada/testada em cada tabela.
- Grants controlam acesso ao objeto; RLS controla linhas. Ambos serão validados.
- Views expostas exigem `security_invoker` quando aplicável.
- Funções `SECURITY DEFINER` ficam fora de schemas expostos, incluem verificação explícita e privilégios revogados por padrão.

### Storage

- Objetos de produto usam paths não sensíveis e metadados catalogados.
- Upload administrativo será autorizado por fluxo controlado; nenhuma chave secreta chega ao navegador.
- Upsert só será habilitado com policies completas de `INSERT`, `SELECT` e `UPDATE`.
- Backup de banco não será considerado backup dos objetos do Storage.

## Security Architecture

- Deny by default para mutações administrativas.
- Permissões de catálogo propostas: `catalog:read`, `catalog:write`, `catalog:publish` e `media:write`.
- Endpoints públicos retornam apenas produtos publicáveis.
- Endpoints administrativos não podem ser implantados sem identidade e autorização verificadas.
- Logs não registram tokens, segredos nem dados corporais desnecessários.
- Inputs são validados na borda e invariantes são novamente protegidas no domínio/banco.
- Rate limiting e WAF serão definidos antes da exposição pública conforme risco do endpoint.

## Media Architecture

```text
Admin client -> NestJS authorization -> upload grant/signed flow
             -> Supabase Storage object
             -> ProductMedia metadata in PostgreSQL
```

O banco guarda identidade, path, tipo, ordem, texto alternativo, dimensões quando conhecidas e associação opcional à variante/cor. O objeto não é considerado cadastrado até metadados e Storage poderem ser reconciliados.

## Observability

- `correlationId` acompanha web, API e adapters.
- Logs estruturados registram caso de uso, resultado e identificadores não sensíveis.
- Sentry será habilitado antes de fluxos críticos públicos.
- Métricas de domínio entram junto às releases que as definem.
- Falhas parciais de Storage/persistência devem ser identificáveis e recuperáveis.

## Deployment Architecture

- Web: Vercel, conforme decisão aprovada.
- API: provider permanece `OPEN` entre Railway, Render, Fly.io ou infraestrutura própria.
- Banco/Auth/Storage: Supabase projeto `olkadbgumpiybehslobk`.
- Ambientes de desenvolvimento, preview e produção não compartilharão credenciais ou dados reais por conveniência.
- Deploy do backend exige migrations verificadas, health checks e plano de rollback.

## Architecture Decisions

| ADR | Decisão | Estado |
|---|---|---|
| `ADR-001` | Monorepo e fronteiras Next.js/NestJS | `ACCEPTED` |
| `ADR-002` | Backend-only para dados comerciais e schema não exposto no Supabase | `ACCEPTED` |
| `ADR-003` | Adoção condicionada do Prisma 8 RC | `ACCEPTED` |

## Explicitly Deferred

- provider de hospedagem da API;
- provider de frete;
- Redis/BullMQ;
- estratégia de cache da vitrine;
- mecanismos de busca externos;
- Stripe;
- primeiro marketplace;
- arquitetura de recomendação/IA;
- política transacional de reserva de estoque, definida antes de checkout/pagamento.

## Architecture Quality Gate

- [x] PRD aprovado é a fonte de requisitos.
- [x] Fronteiras web/API/domain/infrastructure estão explícitas.
- [x] UI não acessa banco diretamente.
- [x] Estratégia de Supabase, Auth, RLS e secrets está explícita.
- [x] Prisma 8 RC está isolado e seus riscos atuais estão registrados.
- [x] Crescimento é orientado por módulos e small releases.
- [x] Infraestrutura futura não foi ativada.
- [x] ADRs e arquitetura aprovados pelo humano.
- [ ] Baseline real do Supabase verificado antes de schema/migrations.
- [ ] Node.js 24.11+ validado antes do scaffold do Prisma 8.

## Approval

Status: **APROVADO PELO HUMANO EM 2026-09-14**.

Gate atingido: `ARCHITECTURE_READY`. O aceite inclui os três ADRs, mantendo obrigatórios o baseline Supabase e o desbloqueio Node/Prisma antes de qualquer implementação. O Dia 2 depende de comando explícito.

## Official Technical References

- Next.js 16 upgrade and Proxy: `https://nextjs.org/docs/app/guides/upgrading/version-16`
- Next.js Proxy convention: `https://nextjs.org/docs/app/api-reference/file-conventions/proxy`
- Supabase Data API security: `https://supabase.com/docs/guides/api/securing-your-api`
- Supabase RLS: `https://supabase.com/docs/guides/database/postgres/row-level-security`
- Prisma ORM release status: `https://www.prisma.io/docs/prisma-orm/release-status`
- Prisma 8 with NestJS: `https://www.prisma.io/docs/guides/frameworks/nestjs`
