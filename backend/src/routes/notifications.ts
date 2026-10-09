import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const notificationsRouter = Router();

notificationsRouter.get('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ notifications, unreadCount: notifications.filter((n) => !n.isRead).length });
});

notificationsRouter.patch('/:id/read', requireAuth, async (req: AuthenticatedRequest, res) => {
  const notificationId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const notification = await prisma.notification.update({
    where: { id: notificationId, userId: req.user!.id },
    data: { isRead: true },
  });

  return res.json({ notification });
});

notificationsRouter.patch('/read-all', requireAuth, async (req: AuthenticatedRequest, res) => {
  await prisma.notification.updateMany({
    where: { userId: req.user!.id, isRead: false },
    data: { isRead: true },
  });

  return res.json({ success: true });
});

export default notificationsRouter;
