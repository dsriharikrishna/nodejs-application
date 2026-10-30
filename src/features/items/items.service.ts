import { Prisma, Status } from '@prisma/client';
import { prisma } from '../../shared/db/prisma';
import { CreateItemInput, UpdateItemInput, ListQuery } from './items.schema';
import { AppError } from '../../shared/errors/AppError';

export class ItemsService {
  async findAll(query: ListQuery) {
    const { page, limit, status } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ItemWhereInput = {};
    if (status) where.status = status as Status;

    const [items, total] = await Promise.all([
      prisma.item.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.item.count({ where }),
    ]);

    return {
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) throw AppError.notFound('Item', id);
    return item;
  }

  async create(data: CreateItemInput) {
    return prisma.item.create({
      data: {
        title: data.title,
        description: data.description,
        status: (data.status ?? 'ACTIVE') as Status,
      },
    });
  }

  async update(id: string, data: UpdateItemInput) {
    await this.findById(id);
    return prisma.item.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.status !== undefined && { status: data.status as Status }),
      },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    return prisma.item.update({
      where: { id },
      data: { status: 'ARCHIVED' as Status },
    });
  }

  async ping() {
    await prisma.$queryRaw`SELECT 1`;
  }
}

export const itemsService = new ItemsService();

