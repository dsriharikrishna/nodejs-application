import { z } from 'zod';

export const createItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(2000).optional(),
  status: z.enum(['ACTIVE', 'ARCHIVED']).optional().default('ACTIVE'),
});

export const updateItemSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional().nullable(),
  status: z.enum(['ACTIVE', 'ARCHIVED']).optional(),
});

export const listQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform((v) => Math.max(1, parseInt(v, 10))),
  limit: z
    .string()
    .optional()
    .default('10')
    .transform((v) => Math.min(100, Math.max(1, parseInt(v, 10)))),
  status: z.enum(['ACTIVE', 'ARCHIVED']).optional(),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
export type ListQuery = z.infer<typeof listQuerySchema>;

