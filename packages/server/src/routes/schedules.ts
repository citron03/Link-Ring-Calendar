import { Router } from 'express';
import prisma from '../lib/prisma';
import type { Schedule as PrismaSchedule } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

interface ScheduleResp {
  id: number;
  title: string;
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
      date: newSchedule.date.toISOString().split('T')[0],
      hyperlinkUrl: newSchedule.hyperlink_url,
    };

    res.status(201).json({ schedule: resp });
  } catch (error) {
    console.error('Error creating schedule', error);
    res.status(500).json({ message: 'Failed to create schedule' });
  }
});

export default router;
