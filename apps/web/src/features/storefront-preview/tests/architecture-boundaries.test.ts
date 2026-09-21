import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const featureRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = join(directory, entry.name);
    if (entry.isDirectory()) {
      return entry.name === 'tests' ? [] : sourceFiles(target);
    }
    return /\.tsx?$/.test(entry.name) ? [target] : [];
  });
}

describe('storefront preview architecture guards', () => {
  it('WEBPREVIEW-ARCH-001 forbids commercial infrastructure and remote data access', () => {
    const source = sourceFiles(featureRoot)
      .map((file) => readFileSync(file, 'utf8'))
      .join('\n');

    expect(source).not.toMatch(/@supabase|@prisma|DATABASE_URL|SUPABASE_URL/);
    expect(source).not.toMatch(/\bfetch\s*\(/);
  });

  it('WEBPREVIEW-ARCH-002 keeps the initial presentation server-compatible', () => {
    const source = sourceFiles(featureRoot)
      .map((file) => readFileSync(file, 'utf8'))
      .join('\n');

    expect(source).not.toContain("'use client'");
    expect(source).not.toContain('"use client"');
  });
});
