import { NextFunction, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { AuthenticatedRequest } from './auth.js';

export async function requireSocietyAccess(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  if (req.user.role === 'ADMIN') {
    return next();
  }

  const organizerProfile = await prisma.organizerProfile.findFirst({
    where: { userId: req.user.id },
  });

  if (!organizerProfile) {
    return res.status(403).json({ error: 'Organizer profile not found.' });
  }

  req.user = {
    ...req.user,
    societyId: organizerProfile.societyId,
  } as typeof req.user & { societyId?: string };

  next();
}
