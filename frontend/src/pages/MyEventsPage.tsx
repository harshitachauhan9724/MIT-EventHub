import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

export default function MyEventsPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<{ registrations: any[] }>('/registrations/my');
        setRegistrations(data.registrations || []);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <div className="page-shell">Loading your registrations…</div>;

  return (
    <div className="page-shell space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.15em] text-indigo-600">My events</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Your event registrations</h1>
      </div>

      {registrations.length ? (
        <div className="grid gap-6 md:grid-cols-2">
          {registrations.map((registration) => (
            <div key={registration.id} className="card-surface p-5">
              <div className="text-xs uppercase tracking-[0.12em] text-slate-500">{registration.event?.society?.name}</div>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">{registration.event?.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{registration.event?.shortDescription}</p>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                <span>{new Date(registration.event?.eventDate).toLocaleDateString()}</span>
                <span>{registration.registrationNumber}</span>
              </div>
              <div className="mt-4 flex gap-3">
                <Link to={`/events/${registration.eventId}`} className="primary-button">View</Link>
                <Link to={`/tickets/${registration.id}`} className="secondary-button">Ticket</Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-surface p-10 text-center text-slate-600">No registrations yet.</div>
      )}
    </div>
  );
}
