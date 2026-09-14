# AI-001 — RED Must Not Be a Configuration Failure

## Context

During Dia 2, the first TypeScript check used `module: NodeNext` and extensionless ESM imports. TypeScript correctly rejected the imports before Jest could reach the catalog contracts.

## Cause

The initial scaffold combined two individually valid choices without validating their joint contract. `NodeNext` requires Node-compatible explicit import semantics, while the approved Prisma 8/ESM toolchain and generated-style imports use bundler resolution.

## Impact

If the test command had been accepted at that point, a configuration error would have been mislabeled as TDD RED. That would provide no evidence about missing catalog behavior.

## Correction

- changed the shared TypeScript configuration to `module: ESNext` and `moduleResolution: Bundler`;
- repeated type-check until green;
- only then executed Jest and recorded behavioral RED;
- preserved placeholder behavior without implementing the feature.

## Prevention

Every future RED gate must run in this order:

1. dependency installation/lockfile verification;
2. type-check and test-runner discovery green;
3. target test execution;
4. classification of each failure as behavior, infrastructure blocker or configuration defect.

## Context Routes

- `docs/features/FEATURE-CATALOG/test-plan.md#red-contract`
- `project-toolchain.md`
- `tsconfig.base.json`
- `.agents/workflows/dia-2.md`
