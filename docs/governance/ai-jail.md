# AI Jail e Segurança Operacional

## Escopo

Aplica-se a scripts, instalações, banco, autenticação, pagamentos, webhooks, marketplaces, mensageria, publicação e qualquer mutação externa.

## Regras

- Usar ambiente local/sandbox e dados sintéticos por padrão.
- Separar desenvolvimento, homologação e produção.
- Nunca registrar, exibir ou commitar segredos.
- Solicitar autorização antes de criar contas, provisionar serviços, publicar ou executar mutação irreversível.
- Validar projeto, ambiente, schema e alvo antes de migration, exclusão ou deploy.
- Preferir migrations incrementais, rollback explícito e backups verificáveis.
- Usar credenciais de menor privilégio e rotação.
- Não expor `service_role` no Next.js cliente.
- Exigir idempotency key e verificação de assinatura em pagamentos e webhooks.
- Exigir dry-run para sincronizações e campanhas quando tecnicamente possível.
- Registrar observabilidade e correlação antes de automações críticas.

## Dados pessoais

- Coletar medidas corporais e preferências somente de forma opcional e com finalidade clara.
- Minimizar retenção e acesso; permitir correção e exclusão conforme política aplicável.
- Não inferir atributos sensíveis além do necessário para a experiência solicitada.

## Áreas de validação adicional

Autenticação, RBAC/RLS, estoque concorrente, pagamento, dados financeiros, migrations, filas, agendamentos, integrações externas, comunicações e publicação.

## Rollback mínimo

Cada mudança externa deve identificar: estado anterior, ação de reversão, dados afetados, responsável e evidência de validação.
