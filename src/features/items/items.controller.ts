import { Request, Response, NextFunction } from 'express';
import { itemsService } from './items.service';

export const itemsController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await itemsService.findAll(req.query as any);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const item = await itemsService.findById(id);
      res.json({ data: item });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await itemsService.create(req.body);
      res.status(201).json({ data: item });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const item = await itemsService.update(id, req.body);
      res.json({ data: item });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const item = await itemsService.remove(id);
      res.json({ data: item, message: 'Item archived successfully' });
    } catch (err) {
      next(err);
    }
  },
};

