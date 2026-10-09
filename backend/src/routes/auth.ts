import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { comparePassword, hashPassword, signToken } from '../lib/auth.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const authRouter = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['STUDENT', 'ORGANIZER']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

authRouter.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid registration data.' });
  }

  const existingUser = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });

  if (existingUser) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      passwordHash: await hashPassword(parsed.data.password),
      role: (parsed.data.role || 'STUDENT') as 'STUDENT' | 'ORGANIZER',
      isActive: true,
    },
  });

  const token = signToken({ userId: user.id, email: user.email, role: user.role });

  return res.status(201).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid login request.' });
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
    include: { organizerProfile: true },
  });

  if (!user || !user.isActive) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const passwordValid = await comparePassword(parsed.data.password, user.passwordHash);

  if (!passwordValid) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = signToken({ userId: user.id, email: user.email, role: user.role });

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizerProfile: user.organizerProfile,
    },
  });
});

authRouter.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

authRouter.get('/me', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: {
      organizerProfile: { include: { society: true } },
    },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    profileImage: user.profileImage,
    isActive: user.isActive,
    organizerProfile: user.organizerProfile,
  });
});

export default authRouter;
