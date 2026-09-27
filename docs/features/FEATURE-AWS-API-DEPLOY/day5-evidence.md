# Day 5 Evidence — FEATURE-AWS-API-DEPLOY

Date: 2026-09-27  
Scope: local hardening only; no AWS, Supabase or Vercel mutation

## Outcome

The API now has explicit production controls for the PostgreSQL application
pool, browser origins, public catalog throttling, trusted proxy depth and Swagger
exposure. The AWS pre-deployment plan also records bounded IAM roles, cost
approval, immutable image promotion, rollback and exact teardown.

This is a local hardening result. It does not authorize OIDC execution, image
publication, ECS creation or connection to the production Supabase project.

## TDD Evidence

The Day 5 suite is
`apps/api/src/features/deployment/tests/day5/aws-hardening.day5.spec.ts`.

- initial RED: six behavior contracts failed after placeholders made module
  resolution valid;
- operational-plan RED: two contracts failed while the machine-readable IAM,
  cost, rollback and teardown artifact was absent;
- edge escalation RED: four proxy-aware rate-limit assertions failed before the
  trusted proxy policy was installed;
- network boundary RED: `AWS-HARD-008` failed before the infrastructure plan
  restricted task ingress to the ALB security group;
- final GREEN: 8/8 Day 5 contracts passed on Node.js 24.21.0.

The contracts cover:

- `AWS-HARD-001`: bounded Prisma/PostgreSQL pool;
- `AWS-HARD-002..003`: fail-fast production configuration;
- `AWS-HARD-004`: explicit CORS allowlist without credentials;
- `AWS-HARD-005`: per-client public catalog rate limit behind one trusted proxy;
- `AWS-HARD-006..007`: conditional Swagger and image-smoke compatibility;
- `AWS-HARD-008`: IAM, cost, network, rollback and teardown plan.

## Validation

- complete API regression: 18 suites, 105/105 tests passed against isolated
  PostgreSQL at `127.0.0.1:55432`;
- Day 5 suite: 8/8 passed;
- API bundle: generated successfully (`91.8 kB`, sourcemap `205.4 kB`);
- production bundle smoke: live `200`, allowed CORS present, denied CORS absent,
  same client `200, 200, 429`, independent client `200`, Swagger `404`;
- lint and type-check: passed on Node.js 24.21.0;
- production and full dependency audits: no known vulnerabilities;
- Docker is not installed locally, so the existing GitHub Linux runner remains
  the authoritative image build, smoke, Trivy and SBOM gate after push.

## Database Boundary

The current Supabase guidance was rechecked before choosing the runtime pool
settings. The application owns a small bounded driver pool (`max: 5` per task),
uses SSL and expects a pooled runtime URL. `DIRECT_URL` and migrations remain
outside application startup. Staging still requires a separate non-production
Supabase target.

## Remaining Remote Gates

- validate AWS account, identity and region read-only;
- select the non-production Supabase target;
- approve the AWS Pricing Calculator estimate, monthly budget and alerts;
- choose IaC;
- validate the branch on GitHub Actions;
- exercise deployment and rollback only after a separate authorization.
