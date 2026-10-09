import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import societiesRouter from './routes/societies.js';
import eventsRouter from './routes/events.js';
import registrationsRouter from './routes/registrations.js';
import attendanceRouter from './routes/attendance.js';
import notificationsRouter from './routes/notifications.js';
import feedbackRouter from './routes/feedback.js';
import certificatesRouter from './routes/certificates.js';
import dashboardRouter from './routes/dashboard.js';
import { env } from './config/env.js';

const app = express();

app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'campus-event-planner-api' });
});

app.use('/api/auth', authRouter);
app.use('/api/societies', societiesRouter);
app.use('/api/events', eventsRouter);
app.use('/api', registrationsRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api', feedbackRouter);
app.use('/api', certificatesRouter);
app.use('/api/dashboard', dashboardRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

app.listen(env.port, () => {
  console.log(`Campus Event Planner API listening on http://localhost:${env.port}`);
});
