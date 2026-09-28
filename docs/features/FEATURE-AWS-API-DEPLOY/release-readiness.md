---
id: REL-AWSAPI-DAY7-001
feature: FEATURE-AWS-API-DEPLOY
small_release: SR-INFRA-API-01
phase: day-7
status: BLOCKED
date: 2026-09-28
derived_from:
  - docs/features/FEATURE-AWS-API-DEPLOY/feature-prd.md
  - docs/features/FEATURE-AWS-API-DEPLOY/test-matrix.md
  - docs/features/FEATURE-AWS-API-DEPLOY/day6-evidence.md
  - quality-gates.md
affects:
  - docs/releases/SR-INFRA-API-01-release-candidate.md
---

# FEATURE-AWS-API-DEPLOY — Release Readiness

## Decision

The source and container candidate is locally and continuously validated, but
the feature is `BLOCKED`, not `READY_FOR_RELEASE` or `RELEASED`. No AWS runtime
exists, no non-production Supabase target was selected and no remote rollback
was exercised.

## Acceptance Audit

| Acceptance criterion | Result | Evidence / missing evidence |
|---|---|---|
| `AC-001` reproducible image | PARTIAL | pinned toolchain and runner build pass; a second independent build/digest comparison is not recorded |
| `AC-002` non-root, no secret | PARTIAL | non-root/context contracts pass; no dedicated image secret-scan report is recorded |
| `AC-003` bind and arbitrary port | PASS | runner and local bundle smoke |
| `AC-004` liveness | PASS | local and image smoke; JSON/no-store/correlation |
| `AC-005` readiness | PASS | isolated PostgreSQL success, timeout and generic `503` |
| `AC-006` graceful shutdown | PASS | idempotent contract and runner `SIGTERM` smoke |
| `AC-007` pooled runtime only | PASS | bounded pool; no migration or `DIRECT_URL` at startup |
| `AC-008` ECR/ECS digest deploy | BLOCKED | no ECR repository, ECS service or deployed digest |
| `AC-009` least-privilege IAM/secrets | PARTIAL | machine-readable matrix exists; policies and Secrets Manager are not remotely reviewed |
| `AC-010` GitHub OIDC | PARTIAL | workflow is restricted and keyless; identity exchange remains `skipped` |
| `AC-011` CloudWatch correlation | PARTIAL | local structured telemetry passes; no CloudWatch evidence |
| `AC-012` cost and scale approval | BLOCKED | estimate, budget and alarms have no human approval |
| `AC-013` rollback | PARTIAL | bounded procedure/runbook exists; unhealthy remote revision was not exercised |
| `AC-014` isolated Supabase target | BLOCKED | staging target and credentials are not selected |
| `AC-015` scanner and SBOM | PASS | Trivy HIGH/CRITICAL gate and CycloneDX artifact pass on Linux |
| `AC-016` public edge policy | PASS | CORS, preflight, rate limit and production Swagger contracts pass |
| `AC-017` mutation audit record | BLOCKED | no authorized remote mutation occurred, so no execution record exists |

Summary: **7 PASS, 6 PARTIAL, 4 BLOCKED; 17/17 traced**.

## Final Quality Gate

| Gate | Evidence | Result |
|---|---|---|
| Automated validation | 19 suites, 114/114 API tests | PASS |
| Coverage | 82.19% statements, 66.49% branches, 83.90% functions, 83.75% lines | PASS |
| Static/build | lint, type-check and monorepo production build | PASS |
| Supply chain | production/full audits; Trivy and CycloneDX | PASS |
| Main CI | API Quality `36425538715`; Image Verification `36425538719` | PASS |
| Bundle smoke | live/ready, preflight, catalog and rate limit | PASS |
| Remote identity | account/profile/region not read-only validated | BLOCKED |
| Environment isolation | non-production Supabase target absent | BLOCKED |
| FinOps | estimate, budget, alerts and scale approval absent | BLOCKED |
| Deployment/recovery | no ECR/ECS deployment or remote rollback exercise | BLOCKED |

## Minimum Unblock Sequence

1. Configure the approved AWS MCP or equivalent read-only path and validate
   identity, account and `sa-east-1` without mutation.
2. Select a separate non-production Supabase project/branch and credentials.
3. Produce and approve the AWS Pricing Calculator estimate, monthly budget,
   alerts and task ceiling.
4. Choose Terraform, CDK or another exportable IaC mechanism by human decision.
5. Review exact IAM/Secrets policies and inventory before authorizing creation.
6. Execute deployment, correlated smoke and rollback as a separately approved
   small release.

## Release Boundary

The repository and container are evidence for a portfolio-quality deployment
candidate. They must not be described as a live AWS service. The Vercel preview
continues to be demonstrative and must not be pointed at a nonexistent API.
