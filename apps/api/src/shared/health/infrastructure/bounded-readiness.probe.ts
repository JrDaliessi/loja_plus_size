import type { ReadinessProbe } from '../application/readiness-probe';

export class BoundedReadinessProbe implements ReadinessProbe {
  constructor(
    private readonly probe: () => Promise<unknown>,
    private readonly timeoutMs: number,
  ) {
    if (!Number.isInteger(timeoutMs) || timeoutMs < 1) {
      throw new Error('DATABASE_READINESS_TIMEOUT_INVALID');
    }
  }

  async check(): Promise<void> {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const timeoutResult = new Promise<never>((_resolve, reject) => {
      timeout = setTimeout(
        () => reject(new Error('DATABASE_READINESS_TIMEOUT')),
        this.timeoutMs,
      );
    });

    try {
      await Promise.race([this.probe(), timeoutResult]);
    } finally {
      if (timeout !== undefined) clearTimeout(timeout);
    }
  }
}
