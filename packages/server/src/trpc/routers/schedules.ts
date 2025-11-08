import { z } from 'zod';
import prisma from '../../lib/prisma';
import { router, protectedProcedure } from '../trpc';

export const schedulesRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.userId;
      const where: any = { userId };

      if (input?.startDate || input?.endDate) {
        where.date = {};
        if (input.startDate) {
          where.date.gte = new Date(input.startDate);
        }
        if (input.endDate) {
          where.date.lte = new Date(input.endDate);
        }
      }

      const schedules = await prisma.schedule.findMany({
        where,
        orderBy: { date: 'asc' },
      });

      return schedules.map((s) => ({
        id: s.id,
        title: s.title,
        content: s.content,
        date: s.date.toISOString().split('T')[0],
        hyperlinkUrl: s.hyperlink_url,
        userId: s.userId,
      }));
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.userId;
      const schedule = await prisma.schedule.findUnique({
        where: { id: input.id },
      });

      if (!schedule || schedule.userId !== userId) {
        throw new Error('Schedule not found');
      }

      return {
        id: schedule.id,
        title: schedule.title,
        content: schedule.content,
        date: schedule.date.toISOString().split('T')[0],
        hyperlinkUrl: schedule.hyperlink_url,
        userId: schedule.userId,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().optional(),
        date: z.string(),
        hyperlinkUrl: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.userId;
      const schedule = await prisma.schedule.create({
        data: {
          title: input.title,
          content: input.content || null,
          date: new Date(input.date),
          hyperlink_url: input.hyperlinkUrl,
          userId,
        },
      });

      return {
        id: schedule.id,
        title: schedule.title,
        content: schedule.content,
        date: schedule.date.toISOString().split('T')[0],
        hyperlinkUrl: schedule.hyperlink_url,
        userId: schedule.userId,
      };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        date: z.string().optional(),
        hyperlinkUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.userId;
      const { id, ...updateData } = input;

      const existing = await prisma.schedule.findUnique({ where: { id } });
      if (!existing || existing.userId !== userId) {
        throw new Error('Schedule not found');
      }

      const updated = await prisma.schedule.update({
        where: { id },
        data: {
          ...(updateData.title && { title: updateData.title }),
          ...(updateData.content !== undefined && { content: updateData.content }),
          ...(updateData.date && { date: new Date(updateData.date) }),
          ...(updateData.hyperlinkUrl && { hyperlink_url: updateData.hyperlinkUrl }),
        },
      });

      return {
        id: updated.id,
        title: updated.title,
        content: updated.content,
        date: updated.date.toISOString().split('T')[0],
        hyperlinkUrl: updated.hyperlink_url,
        userId: updated.userId,
      };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.userId;
      const existing = await prisma.schedule.findUnique({ where: { id: input.id } });
      if (!existing || existing.userId !== userId) {
        throw new Error('Schedule not found');
      }

      await prisma.schedule.delete({ where: { id: input.id } });
      return { message: 'Schedule deleted successfully' };
    }),
});

