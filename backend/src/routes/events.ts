import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const eventsRouter = Router();

const eventSchema = z.object({
  title: z.string().min(3),
  shortDescription: z.string().min(8),
  description: z.string().min(20),
  categoryId: z.string(),
  societyId: z.string(),
  venueId: z.string(),
  eventDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  registrationDeadline: z.string(),
  capacity: z.coerce.number().int().positive().optional(),
  eligibility: z.string().optional(),
  tags: z.string().optional(),
  banner: z.string().optional(),
  status: z.enum(['DRAFT', 'PENDING_APPROVAL', 'PUBLISHED', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
});

function normalizeEvent(event: any) {
  const registrationCount = event.registrations?.length || 0;
  const remainingSeats = event.capacity ? Math.max(event.capacity - registrationCount, 0) : null;
  return {
    ...event,
    registrationCount,
    remainingSeats,
  };
}

eventsRouter.get('/', async (req, res) => {
  const { search, society, category, venue, status, sort = 'newest', availability } = req.query;

  const filters: any = {};

  if (typeof search === 'string' && search.trim()) {
    filters.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { society: { is: { name: { contains: search, mode: 'insensitive' } } } },
      { category: { is: { name: { contains: search, mode: 'insensitive' } } } },
      { venue: { is: { name: { contains: search, mode: 'insensitive' } } } },
    ];
  }

  if (typeof society === 'string' && society !== 'all') filters.societyId = society;
  if (typeof category === 'string' && category !== 'all') filters.categoryId = category;
  if (typeof venue === 'string' && venue !== 'all') filters.venueId = venue;
  if (typeof status === 'string' && status !== 'all') filters.status = status;

  if (typeof availability === 'string') {
    if (availability === 'open') {
      filters.capacity = { gt: 0 };
    }
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'upcoming') orderBy = { eventDate: 'asc' };
  if (sort === 'date') orderBy = { eventDate: 'asc' };
  if (sort === 'popularity') orderBy = [{ registrations: { _count: 'desc' } }];
  if (sort === 'newest') orderBy = { createdAt: 'desc' };

  const events = await prisma.event.findMany({
    where: filters,
    include: {
      category: true,
      society: true,
      venue: true,
      registrations: true,
      organizer: { include: { user: true } },
    },
    orderBy,
  });

  res.json({ events: events.map(normalizeEvent) });
});

eventsRouter.get('/:id', async (req, res) => {
  const eventId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const event = await prisma.event.findFirst({
    where: { OR: [{ id: eventId }, { slug: eventId }] },
    include: {
      category: true,
      society: true,
      venue: true,
      organizer: { include: { user: true } },
      registrations: { include: { student: true } },
    },
  });

  if (!event) return res.status(404).json({ error: 'Event not found.' });

  res.json({ event: normalizeEvent(event) });
});

eventsRouter.post('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== 'ORGANIZER' && req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only organizers or admins can create events.' });
  }

  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid event payload.' });
  }

  const data = parsed.data;
  let organizerProfile = null;

  if (req.user?.role === 'ORGANIZER') {
    organizerProfile = await prisma.organizerProfile.findFirst({ where: { userId: req.user.id } });
    if (!organizerProfile) {
      return res.status(403).json({ error: 'Organizer profile not found.' });
    }
    if (data.societyId !== organizerProfile.societyId) {
      return res.status(403).json({ error: 'You can only create events for your own society.' });
    }
  }

  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const event = await prisma.event.create({
    data: {
      ...data,
      slug,
      eventDate: new Date(data.eventDate),
      registrationDeadline: new Date(data.registrationDeadline),
      organizerId: organizerProfile?.id || (await prisma.organizerProfile.findFirst({ where: { societyId: data.societyId } }))?.id || (await prisma.organizerProfile.findFirst())!.id,
      status: data.status || 'DRAFT',
    },
    include: { society: true, category: true, venue: true },
  });

  res.status(201).json({ event });
});

eventsRouter.put('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== 'ORGANIZER' && req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only organizers or admins can update events.' });
  }

  const eventId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const existing = await prisma.event.findUnique({ where: { id: eventId } });
  if (!existing) return res.status(404).json({ error: 'Event not found.' });

  if (req.user.role === 'ORGANIZER') {
    const organizerProfile = await prisma.organizerProfile.findFirst({ where: { userId: req.user.id } });
    if (!organizerProfile || organizerProfile.societyId !== existing.societyId) {
      return res.status(403).json({ error: 'You can only edit your own society events.' });
    }
  }

  const parsed = eventSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid update payload.' });
  }

  const data = parsed.data;
  const event = await prisma.event.update({
    where: { id: eventId },
    data: {
      ...data,
      ...(data.eventDate ? { eventDate: new Date(data.eventDate) } : {}),
      ...(data.registrationDeadline ? { registrationDeadline: new Date(data.registrationDeadline) } : {}),
    },
    include: { society: true, category: true, venue: true },
  });

  res.json({ event });
});

eventsRouter.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== 'ORGANIZER' && req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only organizers or admins can delete events.' });
  }

  const eventId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const existing = await prisma.event.findUnique({ where: { id: eventId } });
  if (!existing) return res.status(404).json({ error: 'Event not found.' });

  if (req.user.role === 'ORGANIZER') {
    const organizerProfile = await prisma.organizerProfile.findFirst({ where: { userId: req.user.id } });
    if (!organizerProfile || organizerProfile.societyId !== existing.societyId) {
      return res.status(403).json({ error: 'You can only delete your own society events.' });
    }
  }

  await prisma.event.delete({ where: { id: eventId } });
  res.json({ success: true });
});

export default eventsRouter;
