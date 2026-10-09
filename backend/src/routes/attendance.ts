import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const attendanceRouter = Router();

const checkInSchema = z.object({
  registrationId: z.string().optional(),
  registrationNumber: z.string().optional(),
  eventId: z.string().optional(),
});

attendanceRouter.post('/check-in', requireAuth, async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== 'ORGANIZER' && req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only organizers/admins can check in attendees.' });
  }

  const parsed = checkInSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid check-in payload.' });
  }

  const { registrationId, registrationNumber, eventId } = parsed.data;

  const registration = await prisma.registration.findFirst({
    where: {
      OR: [
        registrationId ? { id: registrationId } : undefined,
        registrationNumber ? { registrationNumber } : undefined,
      ].filter(Boolean) as any,
    },
    include: { event: true, student: true },
  });

  if (!registration) {
    return res.status(404).json({ error: 'Registration not found.' });
  }

  if (eventId && registration.eventId !== eventId) {
    return res.status(400).json({ error: 'Ticket does not match this event.' });
  }

  if (registration.status === 'CANCELLED') {
    return res.status(400).json({ error: 'Registration has been cancelled.' });
  }

  const existingCheckIn = await prisma.attendance.findUnique({ where: { registrationId: registration.id } });
  if (existingCheckIn) {
    return res.status(409).json({ error: 'This registration has already been checked in.' });
  }

  const attendance = await prisma.attendance.create({
    data: {
      registrationId: registration.id,
      checkedInAt: new Date(),
      checkedInBy: req.user.id,
      status: 'PRESENT',
    },
  });

  await prisma.notification.create({
    data: {
      userId: registration.studentId,
      title: 'Checked in',
      message: `You have checked in for ${registration.event.title}.`,
      type: 'ANNOUNCEMENT',
      isRead: false,
    },
  });

  return res.status(201).json({ attendance, registration });
});

export default attendanceRouter;
