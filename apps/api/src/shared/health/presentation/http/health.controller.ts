import {
  Controller,
  Get,
  Inject,
  ServiceUnavailableException,
} from '@nestjs/common';

import {
  READINESS_PROBE,
  type ReadinessProbe,
} from '../../application/readiness-probe';

@Controller('health')
export class HealthController {
  constructor(
    @Inject(READINESS_PROBE)
    private readonly readinessProbe: ReadinessProbe,
  ) {}

  @Get('live')
  live(): { status: 'ok' } {
    return { status: 'ok' };
  }

  @Get('ready')
  async ready(): Promise<{ status: 'ready' }> {
    try {
      await this.readinessProbe.check();
      return { status: 'ready' };
    } catch {
      throw new ServiceUnavailableException({ status: 'unavailable' });
    }
  }
}
