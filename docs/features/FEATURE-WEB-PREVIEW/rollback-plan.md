# Rollback Plan — SR-WEB-PREVIEW-01

## Scope

The release contains a static demonstrative web route, local WebP assets and
documentation. It has no database migration, remote write, user data, payment,
inventory or Supabase dependency.

## Before remote deployment

- keep the existing branch head as the recovery point;
- if the candidate commit is rejected, revert only that commit after review;
- do not remove or overwrite unrelated working-tree changes.

## Vercel Preview

- do not promote a Preview that is not `READY` or fails browser verification;
- retain the last known `READY` deployment while investigating a failed one;
- a branch Preview can be abandoned without changing production;
- verify that the production alias remains unchanged.

## Production

Production promotion is outside this release-candidate gate. If later
authorized, promote the exact inspected Preview artifact. A rollback must point
the production alias back to the previously verified deployment and be followed
by a browser/error-log check.

## Data recovery

Not applicable: this release creates no schema, storage object or persistent
business data.
