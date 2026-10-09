import { CalendarDays, BellRing, Award, Users, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const currentUser = user;
    async function load() {
      try {
        const role = currentUser.role.toLowerCase();
        const payload = await api.get<any>(`/dashboard/${role}`);
        setData(payload);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user]);

  if (!user) return <div className="page-shell">Loading dashboard…</div>;
  if (loading) return <div className="page-shell">Loading dashboard…</div>;
  if (!data) return <div className="page-shell">Dashboard unavailable.</div>;

  if (user?.role === 'STUDENT') {
    return (
      <div className="page-shell space-y-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-indigo-600">Student dashboard</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">Welcome back, {user.name}</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Registrations" value={String(data.registrationCount || 0)} icon={<CalendarDays className="h-5 w-5" />} />
          <StatCard label="Upcoming" value={String(data.upcomingCount || 0)} icon={<Sparkles className="h-5 w-5" />} />
          <StatCard label="Attended" value={String(data.attendedCount || 0)} icon={<Users className="h-5 w-5" />} />
          <StatCard label="Certificates" value={String(data.certificateCount || 0)} icon={<Award className="h-5 w-5" />} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="card-surface p-6">
            <h2 className="text-2xl font-semibold text-slate-900">Recommended events</h2>
            <div className="mt-5 space-y-4">
              {(data.recommendedEvents || []).slice(0, 4).map((event: any) => (
                <div key={event.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-3">
                  <div>
                    <div className="font-medium text-slate-900">{event.title}</div>
                    <div className="text-sm text-slate-500">{event.society?.name}</div>
                  </div>
                  <Link to={`/events/${event.id}`} className="primary-button">View</Link>
                </div>
              ))}
            </div>
          </div>

          <div className="card-surface p-6">
            <h2 className="text-2xl font-semibold text-slate-900">Quick actions</h2>
            <div className="mt-5 space-y-3">
              <Link to="/events" className="secondary-button w-full justify-center">Explore Events</Link>
              <Link to="/my-events" className="secondary-button w-full justify-center">My Events</Link>
              <Link to="/notifications" className="secondary-button w-full justify-center">Notifications ({data.unreadNotifications || 0})</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div className="page-shell">Role dashboard available.</div>;
}
