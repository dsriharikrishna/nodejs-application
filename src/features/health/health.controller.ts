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
      await prisma.$queryRaw`SELECT 1`;
      res.json({ status: 'ready', database: 'connected' });
    } catch {
      res.status(503).json({ status: 'not ready', database: 'disconnected' });
    }
  },
};

