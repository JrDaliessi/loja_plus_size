import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const tokensPath = resolve(process.cwd(), '../../packages/ui/src/tokens.css');

function channel(hex: string): number {
  const normalized = Number.parseInt(hex, 16) / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const value = hex.replace('#', '');
  const [red, green, blue] = [
    value.slice(0, 2),
    value.slice(2, 4),
    value.slice(4, 6),
  ].map(channel);
  return 0.2126 * red! + 0.7152 * green! + 0.0722 * blue!;
}

function contrast(foreground: string, background: string): number {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

function token(css: string, name: string): string {
  const match = css.match(new RegExp(`--${name}:\\s*(#[0-9A-Fa-f]{6})`));
  if (!match?.[1]) {
    throw new Error(`Missing token --${name}`);
  }
  return match[1];
}

describe('Purple Noir token contract — RED', () => {
  it('WEBPREVIEW-DS-001 materializes the approved minimal token slice', () => {
    expect(existsSync(tokensPath), `Missing ${tokensPath}`).toBe(true);
    if (!existsSync(tokensPath)) return;

    const css = readFileSync(tokensPath, 'utf8');
    expect(token(css, 'color-ink')).toBe('#0B090D');
    expect(token(css, 'color-surface-editorial')).toBe('#FAF7FB');
    expect(token(css, 'color-text-primary')).toBe('#1A121F');
    expect(token(css, 'color-text-inverse')).toBe('#F8F5FA');
    expect(token(css, 'color-action-primary')).toBe('#C4B5FD');
  });

  it('WEBPREVIEW-DS-002 preserves AA contrast for inverse and primary actions', () => {
    expect(contrast('#F8F5FA', '#0B090D')).toBeGreaterThanOrEqual(4.5);
    expect(contrast('#1A121F', '#C4B5FD')).toBeGreaterThanOrEqual(4.5);
    expect(contrast('#FFFFFF', '#8B5CF6')).toBeLessThan(4.5);
  });
});
