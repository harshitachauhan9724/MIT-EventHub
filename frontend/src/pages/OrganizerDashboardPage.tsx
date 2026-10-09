import { Activity, BarChart3, CalendarDays, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import StatCard from '../components/StatCard';

export default function OrganizerDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const payload = await api.get<any>('/dashboard/organizer');
        setData(payload);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <div className="page-shell">Loading organizer dashboard…</div>;
  if (!data) return <div className="page-shell">No organizer dashboard data available.</div>;

  return (
    <div className="page-shell space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.15em] text-indigo-600">Organizer dashboard</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Society performance at a glance</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total events" value={String(data.totalEvents || 0)} icon={<CalendarDays className="h-5 w-5" />} />
        <StatCard label="Registrations" value={String(data.totalRegistrations || 0)} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Attendees" value={String(data.totalAttendees || 0)} icon={<Activity className="h-5 w-5" />} />
        <StatCard label="Avg rating" value={String((data.averageRating || 0).toFixed(1))} icon={<BarChart3 className="h-5 w-5" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card-surface p-6">
          <h2 className="text-2xl font-semibold text-slate-900">Recent registrations</h2>
          <div className="mt-5 space-y-3">
            {(data.recentRegistrations || []).slice(0, 5).map((item: any) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 p-3 text-sm text-slate-600">
                {item.studentId || 'Guest'} · {item.id}
              </div>
            ))}
          </div>
        </div>

        <div className="card-surface p-6">
          <h2 className="text-2xl font-semibold text-slate-900">Quick actions</h2>
          <div className="mt-5 space-y-3">
            <Link to="/create-event" className="secondary-button w-full justify-center">Create Event</Link>
            <Link to="/events" className="secondary-button w-full justify-center">Manage Events</Link>
            <Link to="/notifications" className="secondary-button w-full justify-center">Notifications</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
