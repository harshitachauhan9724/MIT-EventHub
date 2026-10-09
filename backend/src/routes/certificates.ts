import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const certificatesRouter = Router();

certificatesRouter.get('/certificates/my', requireAuth, async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== 'STUDENT') {
    return res.status(403).json({ error: 'Only students can view certificates.' });
  }

  const certificates = await prisma.certificate.findMany({
    where: { studentId: req.user.id },
    include: { event: { include: { society: true } } },
    orderBy: { issuedAt: 'desc' },
  });

  res.json({ certificates });
});

certificatesRouter.post('/events/:id/certificates', requireAuth, async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== 'ORGANIZER' && req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only organizers or admins can issue certificates.' });
  }

  const eventId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const { studentId } = req.body || {};

  if (!studentId) {
    return res.status(400).json({ error: 'studentId is required.' });
  }

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return res.status(404).json({ error: 'Event not found.' });

  const registration = await prisma.registration.findUnique({
    where: { eventId_studentId: { eventId, studentId } },
  });

  if (!registration) return res.status(400).json({ error: 'Student is not registered for this event.' });

  const certificate = await prisma.certificate.upsert({
    where: { eventId_studentId: { eventId, studentId } },
    update: {},
    create: {
      eventId,
      studentId,
      certificateId: `CERT-${Date.now().toString().slice(-8)}`,
      certificateUrl: `/certificates/${eventId}/${studentId}`,
    },
  });

  return res.status(201).json({ certificate });
});

export default certificatesRouter;
