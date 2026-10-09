import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const registrationsRouter = Router();

registrationsRouter.post('/events/:id/register', requireAuth, async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== 'STUDENT') {
    return res.status(403).json({ error: 'Only students can register for events.' });
  }

  const eventId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const event = await prisma.event.findUnique({ where: { id: eventId }, include: { registrations: true } });
  if (!event) return res.status(404).json({ error: 'Event not found.' });

  if (event.status === 'CANCELLED' || event.status === 'DRAFT') {
    return res.status(400).json({ error: 'This event is not open for registration.' });
  }

  if (new Date(event.registrationDeadline) < new Date()) {
    return res.status(400).json({ error: 'Registration deadline has passed.' });
  }

  const alreadyRegistered = await prisma.registration.findUnique({
    where: { eventId_studentId: { eventId: eventId, studentId: req.user.id } },
  });

  if (alreadyRegistered) {
    return res.status(409).json({ error: 'You are already registered for this event.' });
  }

  const registrationCount = await prisma.registration.count({ where: { eventId: event.id, status: 'ACTIVE' } });
  if (event.capacity && registrationCount >= event.capacity) {
    return res.status(400).json({ error: 'Event is full.' });
  }

  const registration = await prisma.registration.create({
    data: {
      eventId: eventId,
      studentId: req.user.id,
      registrationNumber: `REG-${Date.now().toString().slice(-8)}`,
      status: 'ACTIVE',
    },
    include: {
      event: { include: { society: true, venue: true } },
      student: true,
    },
  });

  await prisma.notification.create({
    data: {
      userId: req.user.id,
      title: 'Registration confirmed',
      message: `You are registered for ${event.title}.`,
      type: 'REGISTRATION',
      isRead: false,
    },
  });

  return res.status(201).json({ registration });
});

registrationsRouter.delete('/events/:id/register', requireAuth, async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== 'STUDENT') {
    return res.status(403).json({ error: 'Only students can cancel registrations.' });
  }

  const eventId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const registration = await prisma.registration.findUnique({
    where: { eventId_studentId: { eventId, studentId: req.user.id } },
  });

  if (!registration) {
    return res.status(404).json({ error: 'Registration not found.' });
  }

  await prisma.registration.update({
    where: { id: registration.id },
    data: { status: 'CANCELLED' },
  });

  return res.json({ success: true });
});

registrationsRouter.get('/registrations/my', requireAuth, async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== 'STUDENT') {
    return res.status(403).json({ error: 'Only students can access their registrations.' });
  }

  const registrations = await prisma.registration.findMany({
    where: { studentId: req.user.id },
    include: { event: { include: { society: true, category: true, venue: true } }, attendance: true },
    orderBy: { registeredAt: 'desc' },
  });

  res.json({ registrations });
});

registrationsRouter.get('/events/:id/registrations', requireAuth, async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== 'ORGANIZER' && req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden.' });
  }

  const eventId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return res.status(404).json({ error: 'Event not found.' });

  if (req.user.role === 'ORGANIZER') {
    const organizerProfile = await prisma.organizerProfile.findFirst({ where: { userId: req.user.id } });
    if (!organizerProfile || organizerProfile.societyId !== event.societyId) {
      return res.status(403).json({ error: 'You can only view registrations for your own society events.' });
    }
  }

  const registrations = await prisma.registration.findMany({
    where: { eventId: eventId },
    include: { student: true, attendance: true },
  });

  res.json({ registrations });
});

export default registrationsRouter;
