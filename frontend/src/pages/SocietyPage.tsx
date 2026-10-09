import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';
import EventCard from '../components/EventCard';
import type { EventItem, Society } from '../types';

export default function SocietyPage() {
  const { slug } = useParams();
  const [society, setSociety] = useState<Society | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<{ upcomingEvents: EventItem[]; pastEvents: EventItem[]; totalEvents: number } & Society>('/societies/' + slug);
        setSociety({
          id: data.id,
          name: data.name,
          slug: data.slug,
          description: data.description,
          logo: data.logo,
          banner: data.banner,
          category: data.category,
          contactInformation: data.contactInformation,
          socialLinks: data.socialLinks,
          isActive: data.isActive,
        });
        setEvents([...data.upcomingEvents, ...data.pastEvents]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [slug]);

  if (loading) return <div className="page-shell">Loading society profile...</div>;
  if (!society) return <div className="page-shell">Society not found.</div>;

  return (
    <div className="page-shell space-y-8">
      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-soft">
        <img src={society.banner || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80'} alt={society.name} className="h-60 w-full object-cover" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.5fr_1.5fr]">
        <div className="card-surface p-5">
          <img src={society.logo || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80'} alt={society.name} className="h-28 w-28 rounded-2xl object-cover" />
          <h1 className="mt-5 text-3xl font-bold text-slate-900">{society.name}</h1>
          <p className="mt-3 text-sm text-slate-600">{society.description}</p>
          <div className="mt-5 text-sm text-slate-500">Category: {society.category}</div>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="card-surface p-5"><div className="text-sm text-slate-500">Total events</div><div className="mt-2 text-3xl font-bold">{events.length}</div></div>
            <div className="card-surface p-5"><div className="text-sm text-slate-500">Upcoming</div><div className="mt-2 text-3xl font-bold">{events.filter((event) => new Date(event.eventDate) >= new Date()).length}</div></div>
            <div className="card-surface p-5"><div className="text-sm text-slate-500">Avg rating</div><div className="mt-2 text-3xl font-bold">4.8</div></div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Events</h2>
            <div className="mt-4 grid gap-6 md:grid-cols-2">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
