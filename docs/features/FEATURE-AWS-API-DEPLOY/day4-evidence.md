# Day 4 Evidence — FEATURE-AWS-API-DEPLOY

Date: 2026-09-27
State: `IN_PROGRESS`; Day 4 GREEN locally and on the Linux runner.

## Approved Scope

- build the API image on a Linux GitHub-hosted runner;
- smoke liveness, readiness and graceful shutdown against isolated PostgreSQL;
- block image publication and AWS deployment;
- scan high/critical vulnerabilities and generate a CycloneDX SBOM;
- define a manual, environment-gated, read-only AWS OIDC identity check;
- emit allowlisted structured request telemetry with a bounded correlation ID.

No AWS login, resource mutation, ECR push, ECS deployment, remote migration or
Supabase remote access was executed in this phase.

## RED → GREEN

The first Day 4 RED run preserved the ten previous local contracts and produced
four failures because `.github/workflows/api-deploy.yml` did not exist. After
the workflow became GREEN, two observability contracts were introduced and
failed because telemetry and its entrypoint integration were absent.

The final isolated run passed 16/16 contracts:

- `AWS-CI-001..004`: workflow, image smoke, gated OIDC and prohibited actions;
- `AWS-OBS-001..002`: allowlisted structured record and HTTP integration;
- the ten Day 3 health, lifecycle, image and migration contracts.

## Workflow Safety

- all seven external Actions are pinned to full 40-character commit SHAs;
- image build uses `push: false` and a local SHA tag;
- no ECR login, AWS access key name or ECS deployment command exists;
- OIDC can run only by `workflow_dispatch` with the boolean input
  `validate_aws_identity` and the protected environment
  `aws-staging-readonly`;
- the OIDC job performs only `aws sts get-caller-identity` and requires
  `AWS_READONLY_ROLE_ARN` plus `AWS_ACCOUNT_ID` repository variables;
- scan blocks fixed high/critical findings; SBOM is uploaded for 14 days.

## Observability Safety

The request record contains only timestamp, level, service, environment,
revision, correlation ID, method, status and duration. Headers, Authorization,
cookies, query strings, request/response bodies, database errors and connection
strings are not accepted by the record contract.

## Validation Evidence

- feature contracts: 16/16 GREEN on Node.js 24.21.0;
- full API regression: 17 suites and 97/97 tests GREEN;
- isolated PostgreSQL: three migrations already applied; no pending migration;
- type-check: passed;
- lint: passed after one local `unbound-method` correction;
- build: passed, `dist/main.js` 87.7 kB;
- workflow YAML: parsed successfully with both expected jobs;
- action pins: 7/7 immutable SHA references;
- prohibited workflow content scan: zero findings;
- local PostgreSQL and API listeners: stopped after validation.

## Linux Runner Evidence

PR [#11](https://github.com/JrDaliessi/loja_plus_size/pull/11) executed the
container gate on GitHub-hosted Linux. The first run correctly blocked four
fixed HIGH findings bundled with the runtime image's unused npm toolchain. The
fix in commit `1391c95` removed npm/corepack and their shims from the final
stage, after a new contract first failed and then passed.

The second [API Image Verification run](https://github.com/JrDaliessi/loja_plus_size/actions/runs/36320602513)
completed successfully:

- BuildKit image build: passed;
- liveness, readiness and graceful SIGTERM smoke: passed;
- Trivy HIGH/CRITICAL blocking policy: passed;
- CycloneDX SBOM generation and 14-day artifact upload: passed;
- `Validate read-only AWS identity`: skipped by design.

The independent [API Quality run](https://github.com/JrDaliessi/loja_plus_size/actions/runs/36320602528)
also passed. No AWS identity exchange, ECR publication, ECS deployment,
Supabase remote access or billable AWS resource was created.

The runner emitted one non-blocking warning because the Trivy composite action
still calls an `actions/cache` revision targeting Node.js 20; GitHub forced it
to Node.js 24. This upstream maintenance item is tracked as `DEBT-CI-001`.
