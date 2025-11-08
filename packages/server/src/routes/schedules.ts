import { Router } from 'express';
import prisma from '../lib/prisma';
import type { Schedule as PrismaSchedule } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

interface ScheduleResp {
  id: number;
  title: string;
  content: string | null;
  date: string; // YYYY-MM-DD
  hyperlinkUrl: string;
}

const router = Router();

router.use(authMiddleware);

// GET /api/schedules
router.get('/', async (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  try {
    const rows = await prisma.schedule.findMany({ where: { userId } });

  const schedules: ScheduleResp[] = (rows as PrismaSchedule[]).map(r => ({
      id: r.id,
      title: r.title,
      content: r.content,
      date: r.date.toISOString().split('T')[0],
      hyperlinkUrl: r.hyperlink_url,
    }));

    res.json({ schedules });
  } catch (error) {
    console.error('Error fetching schedules', error);
    res.status(500).json({ message: 'Failed to fetch schedules' });
  }
});

// POST /api/schedules
router.post('/', async (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const { title, date, hyperlinkUrl } = req.body;
  if (!title || !date || !hyperlinkUrl) {
    return res.status(400).json({ message: 'Title, date, and hyperlinkUrl are required' });
  }

  try {
    const newSchedule = await prisma.schedule.create({
      data: {
        title,
        date: new Date(date),
        hyperlink_url: hyperlinkUrl,
        userId,
      },
    });

    const resp: ScheduleResp = {
      id: newSchedule.id,
      title: newSchedule.title,
      content: newSchedule.content,
      date: newSchedule.date.toISOString().split('T')[0],
      hyperlinkUrl: newSchedule.hyperlink_url,
    };

    res.status(201).json({ schedule: resp });
  } catch (error) {
    console.error('Error creating schedule', error);
    res.status(500).json({ message: 'Failed to create schedule' });
  }
});

// GET /api/schedules/:id
router.get('/:id', async (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const { id } = req.params;

  try {
    const schedule = await prisma.schedule.findUnique({ where: { id: Number(id) } });
    if (!schedule || schedule.userId !== userId) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    const resp: ScheduleResp = {
      id: schedule.id,
      title: schedule.title,
      content: schedule.content,
      date: schedule.date.toISOString().split('T')[0],
      hyperlinkUrl: schedule.hyperlink_url,
    };

    res.json({ schedule: resp });
  } catch (error) {
    console.error('Error fetching schedule', error);
    res.status(500).json({ message: 'Failed to fetch schedule' });
  }
});

// PUT /api/schedules/:id
router.put('/:id', async (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const { id } = req.params;
  const { title, date, hyperlinkUrl, content } = req.body;

  try {
    const existing = await prisma.schedule.findUnique({ where: { id: Number(id) } });
    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    const updated = await prisma.schedule.update({
      where: { id: Number(id) },
      data: {
        ...(title && { title }),
        ...(date && { date: new Date(date) }),
        ...(hyperlinkUrl && { hyperlink_url: hyperlinkUrl }),
        ...(content !== undefined && { content }),
      },
    });

    const resp: ScheduleResp = {
      id: updated.id,
      title: updated.title,
      content: updated.content,
      date: updated.date.toISOString().split('T')[0],
      hyperlinkUrl: updated.hyperlink_url,
    };

    res.json({ schedule: resp });
  } catch (error) {
    console.error('Error updating schedule', error);
    res.status(500).json({ message: 'Failed to update schedule' });
  }
});

// DELETE /api/schedules/:id
router.delete('/:id', async (req: AuthRequest, res) => {
  const userId = req.user!.userId;
  const { id } = req.params;

  try {
    const existing = await prisma.schedule.findUnique({ where: { id: Number(id) } });
    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    await prisma.schedule.delete({ where: { id: Number(id) } });
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule', error);
    res.status(500).json({ message: 'Failed to delete schedule' });
  }
});

export default router;
