# Test Matrix — FEATURE-AWS-API-DEPLOY

## Requirement Traceability

| Requirement | Acceptance | Primary validation | Layer | Dia 2 | Current state |
|---|---|---|---|---|---|
| `FPRD-AWSAPI001-RQ-001` | `FPRD-AWSAPI001-AC-001` | `AWS-IMG-001`, `AWS-IMG-003`, `AWS-CI-002`, reproducible build hash | container | RED | CI CONTRACT GREEN; runner build pending |
| `FPRD-AWSAPI001-RQ-002` | `FPRD-AWSAPI001-AC-002` | `AWS-IMG-001`, `AWS-IMG-002`, `AWS-CI-004`, secret scan | container/security | RED | CI CONTRACT GREEN; runner scan pending |
| `FPRD-AWSAPI001-RQ-003` | `FPRD-AWSAPI001-AC-003` | `AWS-NET-001`, `AWS-CI-002`, local container smoke | runtime | RED | CI CONTRACT GREEN; runner smoke pending |
| `FPRD-AWSAPI001-RQ-004` | `FPRD-AWSAPI001-AC-004` | `AWS-HEALTH-001` | HTTP | RED | GREEN |
| `FPRD-AWSAPI001-RQ-005` | `FPRD-AWSAPI001-AC-005` | `AWS-HEALTH-002`, `AWS-HEALTH-003`, `AWS-HEALTH-004`, isolated PostgreSQL timeout | HTTP/integration | RED | GREEN |
| `FPRD-AWSAPI001-RQ-006` | `FPRD-AWSAPI001-AC-006` | `AWS-LIFE-001`, child-process SIGTERM smoke | runtime | RED | GREEN |
| `FPRD-AWSAPI001-RQ-007` | `FPRD-AWSAPI001-AC-007` | `AWS-MIG-001`, startup smoke sem `DIRECT_URL` | static/runtime | GREEN guard | GREEN |
| `FPRD-AWSAPI001-RQ-008` | `FPRD-AWSAPI001-AC-008` | manifest/IaC review + ECR digest evidence | infrastructure | BLOCKED remote | BLOCKED remote |
| `FPRD-AWSAPI001-RQ-009` | `FPRD-AWSAPI001-AC-009` | IAM/Secrets matrix + policy simulator/review | security | PLANNED | PLANNED |
| `FPRD-AWSAPI001-RQ-010` | `FPRD-AWSAPI001-AC-010` | `AWS-CI-001`, `AWS-CI-003`, `AWS-CI-004` + OIDC claim review | CI/security | RED | LOCAL GREEN; OIDC not executed |
| `FPRD-AWSAPI001-RQ-011` | `FPRD-AWSAPI001-AC-011` | `AWS-OBS-001`, `AWS-OBS-002`, correlated smoke + CloudWatch redaction query | observability | BLOCKED remote | LOCAL GREEN; CloudWatch blocked remote |
| `FPRD-AWSAPI001-RQ-012` | `FPRD-AWSAPI001-AC-012` | cost estimate + Budget + scaling review | FinOps | BLOCKED approval | BLOCKED approval |
| `FPRD-AWSAPI001-RQ-013` | `FPRD-AWSAPI001-AC-013` | unhealthy revision/canary rollback exercise | release | BLOCKED remote | BLOCKED remote |
| `FPRD-AWSAPI001-RQ-014` | `FPRD-AWSAPI001-AC-014` | target-ref/credential separation evidence | environment | BLOCKED target | BLOCKED target |
| `FPRD-AWSAPI001-RQ-015` | `FPRD-AWSAPI001-AC-015` | `AWS-CI-001`, `AWS-CI-004`, scanner report + SBOM | supply chain | RED | LOCAL GREEN; runner artifacts pending |
| `FPRD-AWSAPI001-RQ-016` | `FPRD-AWSAPI001-AC-016` | HTTP contracts for CORS/rate limit/Swagger | edge/security | PLANNED Day 4 | DEFERRED Day 5; outside approved slice |
| `FPRD-AWSAPI001-RQ-017` | `FPRD-AWSAPI001-AC-017` | change record with account/region/action/rollback | governance | BLOCKED mutation | BLOCKED mutation |

## Coverage Summary

- requirements mapped: 17/17;
- acceptance criteria mapped: 17/17;
- executable contracts after Day 4 expansion: 16;
- baseline RED: 8; additional timeout/build-clean REDs: 2;
- Day 4 RED: 4 workflow contracts followed by 2 observability contracts;
- expected GREEN guards: 1;
- remote criteria remain blocked honestly; none are marked passed by document
  existence alone.
