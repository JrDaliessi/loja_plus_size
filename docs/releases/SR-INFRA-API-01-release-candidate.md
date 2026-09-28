---
id: SR-INFRA-API-01-RC1
small_release: SR-INFRA-API-01
feature: FEATURE-AWS-API-DEPLOY
status: BLOCKED
date: 2026-09-28
source_commit: 51d81f47bb025b04b585fdc58d9a0a8e909df298
---

# SR-INFRA-API-01 — AWS API Release Candidate

## Objective

Prepare a reproducible, observable and reversible NestJS API candidate for a
future ECS Express Mode/Fargate deployment in `sa-east-1`.

## Included

- pinned, non-root multi-stage container;
- health, bounded readiness and graceful shutdown;
- bounded PostgreSQL pool and isolated migration boundary;
- structured telemetry and safe correlation IDs;
- explicit CORS, rate limiting and production Swagger policy;
- keyless OIDC workflow design, image scan and CycloneDX SBOM;
- machine-readable IAM/cost/rollback/teardown guardrails;
- human-readable operational and rollback runbooks.

## Excluded / Not Yet Executed

- AWS identity exchange, ECR publication and ECS deployment;
- Secrets Manager, IAM policy simulation and CloudWatch evidence;
- AWS cost estimate/budget approval;
- non-production Supabase target selection;
- remote smoke, canary and rollback exercise;
- Vercel integration with an AWS API URL.

## Evidence

- 17/17 criteria traced: 7 PASS, 6 PARTIAL, 4 BLOCKED;
- 114/114 API tests and configured coverage thresholds pass;
- lint, type-check, production builds and dependency audits pass;
- `main` workflows `36425538715` and `36425538719` pass;
- [Day 7 evidence](../features/FEATURE-AWS-API-DEPLOY/day7-evidence.md);
- [release readiness](../features/FEATURE-AWS-API-DEPLOY/release-readiness.md);
- [rollback plan](../features/FEATURE-AWS-API-DEPLOY/rollback-plan.md).

## Release Decision

`BLOCKED`. This candidate demonstrates validated source, container and delivery
controls, but it is not a live AWS deployment. Promotion requires the ordered
remote prerequisites and a new, explicit human authorization.
