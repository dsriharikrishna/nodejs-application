import { Request, Response } from 'express';
import { prisma } from '../../shared/db/prisma';

export const healthController = {
  check(_req: Request, res: Response): void {
    res.json({
      status: 'okay',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      service: 'express-app',
      version: '1.0.0',
    });
  },

  async ready(_req: Request, res: Response): Promise<void> {
    try {
      const result = await prisma.$queryRaw<Array<{ connected: number }>>`SELECT 1 as connected`;
      const isConnected = Array.isArray(result) && result.length > 0;

      if (isConnected) {
        res.status(200).json({
          status: 'ready',
          database: 'connected',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(503).json({
        status: 'not ready',
        database: 'disconnected',
        error: 'Database returned no result',
      });
    } catch (error) {
      res.status(503).json({
        status: 'not ready',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown database error',
      });
    }
  },
};

