# Test Matrix — FEATURE-AWS-API-DEPLOY

## Requirement Traceability

| Requirement | Acceptance | Primary validation | Layer | Dia 2 | Current state |
|---|---|---|---|---|---|
| `FPRD-AWSAPI001-RQ-001` | `FPRD-AWSAPI001-AC-001` | `AWS-IMG-001`, `AWS-IMG-003`, `AWS-CI-002`, reproducible build hash | container | RED | PARTIAL; build passa, comparação de dois digests ausente |
| `FPRD-AWSAPI001-RQ-002` | `FPRD-AWSAPI001-AC-002` | `AWS-IMG-001`, `AWS-IMG-002`, `AWS-CI-004`, secret scan | container/security | RED | PARTIAL; non-root/Trivy passam, secret scan dedicado ausente |
| `FPRD-AWSAPI001-RQ-003` | `FPRD-AWSAPI001-AC-003` | `AWS-NET-001`, `AWS-CI-002`, local container smoke | runtime | RED | PASS; runner smoke |
| `FPRD-AWSAPI001-RQ-004` | `FPRD-AWSAPI001-AC-004` | `AWS-HEALTH-001`, `AWS-EXP-001`, `AWS-EXP-008` | HTTP | RED | PASS; JSON/no-store/correlation |
| `FPRD-AWSAPI001-RQ-005` | `FPRD-AWSAPI001-AC-005` | `AWS-HEALTH-002..004`, `AWS-EXP-001`, `AWS-EXP-009`, isolated PostgreSQL timeout | HTTP/integration | RED | PASS; ready/503 JSON/no-store |
| `FPRD-AWSAPI001-RQ-006` | `FPRD-AWSAPI001-AC-006` | `AWS-LIFE-001`, child-process SIGTERM smoke | runtime | RED | PASS |
| `FPRD-AWSAPI001-RQ-007` | `FPRD-AWSAPI001-AC-007` | `AWS-MIG-001`, `AWS-HARD-001`, startup smoke sem `DIRECT_URL` | static/runtime | GREEN guard | PASS; pool 5/task explícito |
| `FPRD-AWSAPI001-RQ-008` | `FPRD-AWSAPI001-AC-008` | manifest/IaC review + ECR digest evidence | infrastructure | BLOCKED remote | BLOCKED remote |
| `FPRD-AWSAPI001-RQ-009` | `FPRD-AWSAPI001-AC-009` | `AWS-HARD-008` + policy simulator/review | security | PLANNED | PARTIAL; matrix local, policies/Secrets blocked |
| `FPRD-AWSAPI001-RQ-010` | `FPRD-AWSAPI001-AC-010` | `AWS-CI-001`, `AWS-CI-003`, `AWS-CI-004` + OIDC claim review | CI/security | RED | PARTIAL; workflow seguro, exchange não executado |
| `FPRD-AWSAPI001-RQ-011` | `FPRD-AWSAPI001-AC-011` | `AWS-OBS-001..002`, `AWS-EXP-002`, `AWS-EXP-005..006`, correlated smoke | observability | BLOCKED remote | PARTIAL; telemetria local, CloudWatch bloqueado |
| `FPRD-AWSAPI001-RQ-012` | `FPRD-AWSAPI001-AC-012` | `AWS-HARD-008`, cost estimate + Budget + scaling review | FinOps | BLOCKED approval | BLOCKED; plan exists, estimate/approval absent |
| `FPRD-AWSAPI001-RQ-013` | `FPRD-AWSAPI001-AC-013` | `AWS-HARD-008`, `AWS-EXP-007`, unhealthy revision/canary rollback exercise | release | BLOCKED remote | PARTIAL; runbook verde, exercício bloqueado |
| `FPRD-AWSAPI001-RQ-014` | `FPRD-AWSAPI001-AC-014` | target-ref/credential separation evidence | environment | BLOCKED target | BLOCKED target |
| `FPRD-AWSAPI001-RQ-015` | `FPRD-AWSAPI001-AC-015` | `AWS-CI-001`, `AWS-CI-004`, scanner report + SBOM | supply chain | RED | PASS; Trivy + CycloneDX |
| `FPRD-AWSAPI001-RQ-016` | `FPRD-AWSAPI001-AC-016` | `AWS-HARD-002..007`, `AWS-EXP-003..005`, `AWS-EXP-008`, bundle smoke | edge/security | PLANNED Day 4 | PASS; preflight/429/smoke |
| `FPRD-AWSAPI001-RQ-017` | `FPRD-AWSAPI001-AC-017` | change record with account/region/action/rollback | governance | BLOCKED mutation | BLOCKED mutation |

## Coverage Summary

- requirements mapped: 17/17;
- acceptance criteria mapped: 17/17;
- executable contracts through Day 6: 33;
- baseline RED: 8; additional timeout/build-clean REDs: 2;
- Day 4 RED: 4 workflow contracts followed by 2 observability contracts;
- Day 5 RED observations: 13; Day 6 RED observations: 5;
- expected GREEN guards: 1;
- remote criteria remain blocked honestly; none are marked passed by document
  existence alone.
- Day 7 final audit: 7 PASS, 6 PARTIAL and 4 BLOCKED; see
  `release-readiness.md` for criterion-level rationale.
