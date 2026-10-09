import { Activity, BarChart3, Building2, UserRound, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import StatCard from '../components/StatCard';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const payload = await api.get<any>('/dashboard/admin');
        setData(payload);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <div className="page-shell">Loading admin dashboard…</div>;
  if (!data) return <div className="page-shell">No admin dashboard data.</div>;

  return (
    <div className="page-shell space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.15em] text-indigo-600">Admin dashboard</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Platform health overview</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Students" value={String(data.totalStudents || 0)} icon={<UserRound className="h-5 w-5" />} />
        <StatCard label="Organizers" value={String(data.totalOrganizers || 0)} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Societies" value={String(data.totalSocieties || 0)} icon={<Building2 className="h-5 w-5" />} />
        <StatCard label="Events" value={String(data.totalEvents || 0)} icon={<Activity className="h-5 w-5" />} />
      </div>

      <div className="card-surface p-6">
        <h2 className="text-2xl font-semibold text-slate-900">Recent feedback</h2>
        <div className="mt-5 space-y-3">
          {(data.recentFeedback || []).slice(0, 5).map((item: any) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 p-3 text-sm text-slate-600">
              <div className="font-medium text-slate-900">{item.student?.name || 'Student'} · {item.event?.title || 'Event'}</div>
              <div className="mt-1">{item.comment}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
