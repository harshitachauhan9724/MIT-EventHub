import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const feedbackRouter = Router();

const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(5).max(500).optional(),
});

feedbackRouter.post('/events/:id/feedback', requireAuth, async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== 'STUDENT') {
    return res.status(403).json({ error: 'Only students can submit feedback.' });
  }

  const eventId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = feedbackSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid feedback payload.' });
  }

  const attendance = await prisma.attendance.findFirst({
    where: { registration: { eventId, studentId: req.user.id } },
    include: { registration: true },
  });

  if (!attendance) {
    return res.status(400).json({ error: 'You must attend the event before submitting feedback.' });
  }

  const exists = await prisma.feedback.findUnique({
    where: { eventId_studentId: { eventId, studentId: req.user.id } },
  });

  if (exists) {
    return res.status(409).json({ error: 'Feedback already submitted for this event.' });
  }

  const feedback = await prisma.feedback.create({
    data: {
      eventId,
      studentId: req.user.id,
      rating: parsed.data.rating,
      comment: parsed.data.comment || '',
    },
  });

  return res.status(201).json({ feedback });
});

feedbackRouter.get('/events/:id/feedback', async (req, res) => {
  const eventId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const feedback = await prisma.feedback.findMany({
    where: { eventId },
    include: { student: true },
    orderBy: { createdAt: 'desc' },
  });

  const average = feedback.length
    ? feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length
    : 0;

  res.json({ feedback, averageRating: average, totalReviews: feedback.length });
});

export default feedbackRouter;
