# Day 6 Evidence — FEATURE-AWS-API-DEPLOY

Date: 2026-09-28  
Scope: API and operational experience; no remote infrastructure mutation

## Applicability

This artifact is a headless HTTP API. Visual responsiveness, keyboard navigation
and screen WCAG checks remain covered by the separate Vercel frontend release.
For this feature, experience validation means predictable machine-readable
responses, safe diagnostics, explicit browser preflight behavior and an
operator-friendly runbook.

## TDD Evidence

The suite is
`apps/api/src/features/deployment/tests/day6/aws-api-experience.day6.spec.ts`.

Initial RED correctly exposed four missing outcomes:

- health responses did not declare `Cache-Control: no-store`;
- rate-limit responses could be cached;
- the terminating rate limiter was installed before request telemetry;
- no operational runbook existed.

A second RED required the Linux image smoke to verify cache and correlation
headers, not only response bodies. A ninth contract confirms that unavailable
readiness remains a generic, correlated, non-cacheable `503`. Final result: 9/9
contracts GREEN.

## Implemented Experience

- `/health/live` and `/health/ready` return JSON with `Cache-Control: no-store`;
- every non-preflight request receives a bounded `X-Correlation-ID`;
- unsafe caller-provided correlation IDs are replaced by UUIDs;
- allowed CORS preflight is explicit, credential-free and returns `204`;
- denied origins receive no CORS grant;
- `429` responses are stable JSON, non-cacheable and correlated;
- telemetry runs before the rate limiter, preserving evidence for rejected
  requests;
- the image smoke now checks operational headers;
- `docs/infrastructure/aws-runbook.md` separates pre-deploy gates, expected
  smoke results, incident triage, rollback and teardown safety.

## Validation

- Day 6 contracts: 9/9 passed;
- complete API regression: 19 suites and 114/114 tests passed;
- coverage: 82.19% statements, 66.49% branches, 83.90% functions and 83.75%
  lines; configured thresholds passed;
- lint, type-check and monorepo build passed on Node.js 24.21.0;
- production and full dependency audits found no known vulnerabilities;
- production bundle smoke: health `200`, preflight `204`, catalog `200`, rate
  limit `429`, with expected cache and correlation headers;
- PostgreSQL was local and isolated; AWS, Supabase and Vercel were not mutated.

Docker is unavailable locally. The authoritative GitHub Linux validation passed:

- image build, expanded smoke, Trivy and CycloneDX SBOM: run `36386913042`;
- lint, test, build and audit: run `36386912961`;
- Vercel preview: passed;
- read-only AWS identity: `skipped` by design.

## Remaining Release Gates

- validate the AWS identity/account/region read-only when separately approved;
- select the non-production Supabase target;
- approve cost, budget and scale limits;
- choose IaC;
- execute remote deploy, correlated CloudWatch smoke and rollback only under a
  separate authorization.
