# Rollback Plan — SR-INFRA-API-01 Candidate

## Current State

No AWS resource, ECR image, ECS revision, Secrets Manager value or staging
Supabase target was created. The current recovery point is merge commit
`51d81f47bb025b04b585fdc58d9a0a8e909df298` on `main`.

## Candidate Rollback

- reject or close the release-readiness PR without changing `main`;
- if documentation is merged incorrectly, revert only the candidate commit after
  reviewing its exact diff;
- do not reset, delete or overwrite unrelated repository history;
- no database rollback is needed because this phase executes no migration.

## Future AWS Deployment Rollback

This procedure is inactive until remote deployment receives separate approval.

1. Record account, region, service, current revision and last healthy image digest.
2. Stop promotion when deployment, health, correlated smoke or 5xx gates fail.
3. Register a new task revision pointing to the last healthy digest; never reuse
   a mutable tag as recovery evidence.
4. Wait for ECS/ALB stability and repeat live, ready and catalog smoke.
5. Confirm correlated logs contain no token, database URL or personal data.
6. Record old/new revision, digest, timestamps, operator and result.

Database changes are not part of this candidate. Any future incompatible schema
change requires an independent expand/contract plan and recovery evidence.

## Teardown Boundary

Follow the exact inventory and order in `docs/infrastructure/aws-hardening.yaml`.
Never remove resources by glob or account-wide command. Preserve the approved
CloudWatch evidence window and never alter Supabase or Vercel during AWS
teardown.
