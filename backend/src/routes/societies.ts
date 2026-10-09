import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const societiesRouter = Router();

const societySchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  category: z.string().min(2),
  logo: z.string().optional(),
  banner: z.string().optional(),
  contactInformation: z.string().optional(),
  socialLinks: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

societiesRouter.get('/', async (_req, res) => {
  const societies = await prisma.society.findMany({
    where: { isActive: true },
    include: {
      _count: { select: { events: true } },
    },
    orderBy: { name: 'asc' },
  });

  res.json({ societies });
});

societiesRouter.get('/:slug', async (req, res) => {
  const society = await prisma.society.findFirst({
    where: { slug: req.params.slug },
    include: {
      events: { include: { category: true, venue: true } },
      organizers: { include: { user: true } },
    },
  });

  if (!society) {
    return res.status(404).json({ error: 'Society not found.' });
  }

  const pastEvents = society.events.filter((event) => new Date(event.eventDate) < new Date());
  const upcomingEvents = society.events.filter((event) => new Date(event.eventDate) >= new Date());

  return res.json({
    ...society,
    upcomingEvents,
    pastEvents,
    totalEvents: society.events.length,
  });
});

societiesRouter.post('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only admins can manage societies.' });
  }

  const parsed = societySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid society payload.' });
  }

  const slug = parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const society = await prisma.society.create({
    data: {
      ...parsed.data,
      slug,
    },
  });

  res.status(201).json(society);
});

societiesRouter.put('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only admins can update society details.' });
  }

  const societyId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = societySchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid update payload.' });
  }

  const society = await prisma.society.update({
    where: { id: societyId },
    data: parsed.data,
  });

  res.json(society);
});

societiesRouter.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only admins can delete societies.' });
  }

  const societyId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await prisma.society.delete({ where: { id: societyId } });
  res.json({ success: true });
});

export default societiesRouter;
