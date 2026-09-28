# AWS API Operational Runbook

Status: local validation only. No AWS resource exists for this release.

No command in this runbook authorizes remote mutation.

## Audience and Safety

This runbook is for the operator validating `plus-store-api`. Before using a
remote URL, confirm the AWS account, region, environment, revision and owner.
Never paste tokens, database URLs, cookies or complete request bodies into logs,
issues or chat. Examples use placeholders and synthetic correlation IDs.

## Pre-deployment Gate

- confirm the exact AWS account and `sa-east-1` by an approved read-only check;
- select a separate non-production Supabase target with synthetic data;
- approve the Pricing Calculator estimate, budget and alert thresholds;
- choose the IaC mechanism and review the exact resource inventory;
- record the candidate image digest and last known healthy digest;
- verify CORS origins, task limits, pool limit and the ALB-only ingress rule;
- obtain separate human authorization before any remote mutation.

If any item is missing, stop. Local tests and documentation may continue, but
image publication, OIDC deployment and ECS creation remain blocked.

## Smoke and Expected Results

Use a synthetic correlation ID. Replace `<api-origin>` only with the approved
HTTPS staging origin.

```text
GET <api-origin>/health/live
X-Correlation-ID: smoke-live-001
expected: 200, application/json, cache-control: no-store
expected body: {"status":"ok"}

GET <api-origin>/health/ready
X-Correlation-ID: smoke-ready-001
expected: 200, application/json, cache-control: no-store
expected body: {"status":"ready"}

GET <api-origin>/v1/catalog/products?limit=1
X-Correlation-ID: smoke-catalog-001
expected: 200 and the same safe X-Correlation-ID response header
```

The public catalog request does not require authorization today. When recording
an approved administrative diagnostic, represent its credential only as:

```text
authorization: Bearer <redacted>
```

Never record a real bearer value.

## Incident Triage

1. Stop promotion and record UTC time, environment, revision and image digest.
2. Check ALB target health and distinguish liveness from database readiness.
3. Search structured logs by the synthetic or reported correlation ID.
4. Confirm the error record contains no token, database URL, PII or request body.
5. Compare 5xx, unhealthy targets and deployment events with the previous
   healthy revision.
6. Do not run migrations, widen IAM or point staging at production to bypass an
   incident.

## Rollback

Rollback is allowed only after the remote deployment gate authorizes it.

1. Stop promotion and select the recorded last known healthy digest.
2. Register a revision that changes only the image digest.
3. Wait for service stability and target health.
4. Repeat live, ready and catalog smoke with new correlation IDs.
5. Record account, region, service, old/new digest, timestamps and outcome.
6. Escalate separately if a database change prevents image-only rollback.

## Teardown Safety

- resolve every target to an exact account, region, ARN/ID and release record;
- follow the order in `aws-hardening.yaml` and never delete by name glob;
- preserve the approved CloudWatch evidence window;
- never alter or delete Supabase or Vercel resources from this procedure;
- schedule secret deletion only after owner approval;
- record every removed resource and any intentionally retained dependency.

## Accessibility and Format Notes

This release exposes a headless HTTP API, so screen responsiveness and visual
WCAG checks belong to the separate Vercel frontend release. API accessibility
here means predictable JSON, explicit status codes, safe correlation IDs,
non-cacheable operational responses and a runbook that separates expected
results, failure paths and prohibited actions.
