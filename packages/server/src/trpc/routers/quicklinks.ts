import { z } from 'zod';
import prisma from '../../lib/prisma';
import { router, protectedProcedure } from '../trpc';

export const quickLinksRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.userId;
    const links = await prisma.quickLink.findMany({
      where: { userId },
      orderBy: { order_index: 'asc' },
    });

    return links.map((link) => ({
      id: link.id,
      title: link.title,
      url: link.url,
      orderIndex: link.order_index,
      iconUrl: link.icon_url,
      userId: link.userId,
    }));
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        url: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.userId;
      const count = await prisma.quickLink.count({ where: { userId } });

      const newLink = await prisma.quickLink.create({
        data: {
          title: input.title,
          url: input.url,
          order_index: count,
          userId,
        },
      });

      return {
        id: newLink.id,
        title: newLink.title,
        url: newLink.url,
        orderIndex: newLink.order_index,
        iconUrl: newLink.icon_url,
        userId: newLink.userId,
      };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        url: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.userId;
      const { id, ...updateData } = input;

      const existing = await prisma.quickLink.findUnique({ where: { id } });
      if (!existing || existing.userId !== userId) {
        throw new Error('Link not found');
      }

      const updated = await prisma.quickLink.update({
        where: { id },
        data: {
          ...(updateData.title && { title: updateData.title }),
          ...(updateData.url && { url: updateData.url }),
        },
      });

      return {
        id: updated.id,
        title: updated.title,
        url: updated.url,
        orderIndex: updated.order_index,
        iconUrl: updated.icon_url,
        userId: updated.userId,
      };
    }),

  reorder: protectedProcedure
    .input(
      z.object({
        updates: z.array(
          z.object({
            id: z.number(),
            orderIndex: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.userId;
      const linkIds = input.updates.map((u) => u.id);

      // Verify all links belong to the user
      const userLinks = await prisma.quickLink.findMany({
        where: { userId, id: { in: linkIds } },
      });

      if (userLinks.length !== linkIds.length) {
        throw new Error('Some links do not belong to you');
      }

      // Update order_index for each link
      await Promise.all(
        input.updates.map((update) =>
          prisma.quickLink.update({
            where: { id: update.id },
            data: { order_index: update.orderIndex },
          })
        )
      );

      return { message: 'Links reordered successfully' };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.userId;
      const existing = await prisma.quickLink.findUnique({ where: { id: input.id } });
      if (!existing || existing.userId !== userId) {
        throw new Error('Link not found');
      }

      await prisma.quickLink.delete({ where: { id: input.id } });
      return { message: 'Link deleted successfully' };
    }),
});

