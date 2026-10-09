import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const dashboardRouter = Router();

dashboardRouter.get('/student', requireAuth, async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== 'STUDENT') {
    return res.status(403).json({ error: 'Only students can access the student dashboard.' });
  }

  const registrations = await prisma.registration.findMany({
    where: { studentId: req.user.id },
    include: { event: { include: { society: true } } },
  });

  const upcoming = registrations.filter((r) => r.status === 'ACTIVE' && new Date(r.event.eventDate) >= new Date());
  const attended = await prisma.attendance.count({
    where: { registration: { studentId: req.user.id } },
  });

  const certificates = await prisma.certificate.count({ where: { studentId: req.user.id } });
  const notifications = await prisma.notification.count({ where: { userId: req.user.id, isRead: false } });

  const events = await prisma.event.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: { society: true },
  });

  res.json({
    greeting: 'Welcome back!',
    registrationCount: registrations.length,
    upcomingCount: upcoming.length,
    attendedCount: attended,
    certificateCount: certificates,
    unreadNotifications: notifications,
    recentActivity: registrations.slice(0, 5),
    recommendedEvents: events,
  });
});

dashboardRouter.get('/organizer', requireAuth, async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== 'ORGANIZER') {
    return res.status(403).json({ error: 'Only organizers can access the organizer dashboard.' });
  }

  const profile = await prisma.organizerProfile.findFirst({ where: { userId: req.user.id } });
  if (!profile) {
    return res.status(404).json({ error: 'Organizer profile not found.' });
  }

  const events = await prisma.event.findMany({
    where: { societyId: profile.societyId },
    include: { registrations: true, feedbacks: true },
  });

  const totalRegistrations = events.reduce((sum, event) => sum + event.registrations.length, 0);
  const totalAttendees = await prisma.attendance.count({ where: { registration: { event: { societyId: profile.societyId } } } });
  const upcomingEvents = events.filter((event) => new Date(event.eventDate) >= new Date()).length;
  const avgRating = events.flatMap((event) => event.feedbacks).reduce((sum, item) => sum + item.rating, 0) / Math.max(events.flatMap((event) => event.feedbacks).length, 1);

  res.json({
    totalEvents: events.length,
    upcomingEvents,
    totalRegistrations,
    totalAttendees,
    attendanceRate: totalRegistrations ? (totalAttendees / totalRegistrations) * 100 : 0,
    averageRating: avgRating,
    eventPerformance: events,
    recentRegistrations: events.flatMap((event) => event.registrations).slice(0, 5),
  });
});

dashboardRouter.get('/admin', requireAuth, async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only admins can access the admin dashboard.' });
  }

  const [students, organizers, societies, events, registrations, attendance, feedbacks] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.user.count({ where: { role: 'ORGANIZER' } }),
    prisma.society.count(),
    prisma.event.count(),
    prisma.registration.count(),
    prisma.attendance.count(),
    prisma.feedback.findMany({ take: 10, include: { event: true, student: true }, orderBy: { createdAt: 'desc' } }),
  ]);

  const ratings = feedbacks.map((f) => f.rating);
  const avgRating = ratings.length ? ratings.reduce((sum, value) => sum + value, 0) / ratings.length : 0;

  res.json({
    totalStudents: students,
    totalOrganizers: organizers,
    totalSocieties: societies,
    totalEvents: events,
    publishedEvents: await prisma.event.count({ where: { status: 'PUBLISHED' } }),
    totalRegistrations: registrations,
    totalAttendance: attendance,
    averageEventRating: avgRating,
    recentFeedback: feedbacks,
  });
});

export default dashboardRouter;
