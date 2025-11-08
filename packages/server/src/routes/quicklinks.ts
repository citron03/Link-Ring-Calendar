import { Router } from 'express';
import prisma from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import type { QuickLink as PrismaQuickLink } from '@prisma/client';

// As defined in api-and-schema.md
interface QuickLinkResp {
  id: number;
  title: string;
  url: string;
  orderIndex: number;
}

const router = Router();

// Protect all quicklink routes
router.use(authMiddleware);

// GET /api/quicklinks
router.get('/', async (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  try {
    const rows = await prisma.quickLink.findMany({
      where: { userId },
      orderBy: { order_index: 'asc' },
    }) as PrismaQuickLink[];

    const quickLinks: QuickLinkResp[] = rows.map(r => ({
      id: r.id,
      title: r.title,
      url: r.url,
      orderIndex: r.order_index,
    }));

    res.json({ quickLinks });
  } catch (error) {
    console.error('Error fetching quicklinks', error);
    res.status(500).json({ message: 'Failed to fetch quick links' });
  }
});

// POST /api/quicklinks
router.post('/', async (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const { title, url } = req.body;
  if (!title || !url) {
    return res.status(400).json({ message: 'Title and URL are required' });
  }

  try {
    const count = await prisma.quickLink.count({ where: { userId } });

    const newLink = await prisma.quickLink.create({
      data: {
        title,
        url,
        order_index: count,
        userId,
      },
    });

    const resp: QuickLinkResp = {
      id: newLink.id,
      title: newLink.title,
      url: newLink.url,
      orderIndex: newLink.order_index,
    };

    res.status(201).json({ quickLink: resp });
  } catch (error) {
    console.error('Error creating quicklink', error);
    res.status(500).json({ message: 'Failed to create quick link' });
  }
});

// PUT /api/quicklinks/:id
router.put('/:id', async (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const { id } = req.params;
  const { title, url } = req.body;

  try {
    const existing = await prisma.quickLink.findUnique({ where: { id: Number(id) } });
    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ message: 'Link not found' });
    }

    const updated = await prisma.quickLink.update({
      where: { id: Number(id) },
      data: {
        ...(title && { title }),
        ...(url && { url }),
      },
    });

    const resp: QuickLinkResp = {
      id: updated.id,
      title: updated.title,
      url: updated.url,
      orderIndex: updated.order_index,
    };

    res.json({ quickLink: resp });
  } catch (error) {
    console.error('Error updating quicklink', error);
    res.status(500).json({ message: 'Failed to update quick link' });
  }
});

// PUT /api/quicklinks/reorder
router.put('/reorder', async (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const { updates } = req.body;

  if (!Array.isArray(updates)) {
    return res.status(400).json({ message: 'Updates must be an array' });
  }

  try {
    // Verify all links belong to the user
    const linkIds = updates.map((u: { id: number }) => u.id);
    const userLinks = await prisma.quickLink.findMany({
      where: { userId, id: { in: linkIds } },
    });

    if (userLinks.length !== linkIds.length) {
      return res.status(403).json({ message: 'Some links do not belong to you' });
    }

    // Update order_index for each link
    await Promise.all(
      updates.map((update: { id: number; orderIndex: number }) =>
        prisma.quickLink.update({
          where: { id: update.id },
          data: { order_index: update.orderIndex },
        })
      )
    );

    res.json({ message: 'Links reordered successfully' });
  } catch (error) {
    console.error('Error reordering quicklinks', error);
    res.status(500).json({ message: 'Failed to reorder quick links' });
  }
});

// DELETE /api/quicklinks/:id
router.delete('/:id', async (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const { id } = req.params;

  try {
    const existing = await prisma.quickLink.findUnique({ where: { id: Number(id) } });
    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ message: 'Link not found' });
    }

    await prisma.quickLink.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: 'Link deleted successfully' });
  } catch (error) {
    console.error('Error deleting quicklink', error);
    res.status(500).json({ message: 'Failed to delete quick link' });
  }
});

export default router;
