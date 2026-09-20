---
id: ROLLBACK-CAT-001
feature: FEATURE-CATALOG
small_release: SR-MVP-01
status: VERIFIED_FOR_RELEASE_CANDIDATE
date: 2026-09-20
---

# FEATURE-CATALOG — Rollback and Recovery Plan

## Current Position

The safest rollback is currently to stop promotion: the principal Supabase
project has not received the catalog schema and no backend has been deployed.

## Application Rollback

The two catalog migrations are additive and create a new private `app` schema.
A rollback to the previous application version does not require dropping the
schema because that version has no dependency on it. The inactive schema can be
left in place while the deployment is investigated.

## Migration Failure

Before remote promotion:

1. confirm the exact project and environment;
2. confirm backup/PITR availability appropriate to the plan;
3. preserve the migration log and failed migration metadata;
4. stop application promotion;
5. do not use `reset`, `drop schema` or manual history edits on the principal project;
6. repair forward with a reviewed migration, or restore through the approved
   Supabase recovery mechanism when data integrity requires it;
7. rerun migration status, constraints, grants, RLS and advisors before resuming.

## Storage and Auth

No Storage or Auth mutation belongs to this candidate. If either is added in a
later release, it needs its own rollback steps and validation evidence.

## Local Drill Evidence

- isolated target `plus_store_day3_migrate` was recreated empty;
- both migrations applied successfully;
- a second deployment was idempotent;
- migration status reported the schema up to date;
- the local target is disposable and contains no user or production data.

This plan records recovery controls; it does not authorize a remote migration or
destructive operation.
