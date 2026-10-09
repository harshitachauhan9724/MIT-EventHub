import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import EventCard from '../components/EventCard';
import type { EventItem, Society, EventCategory, Venue } from '../types';

export default function ExploreEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [societies, setSocieties] = useState<Society[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    society: 'all',
    category: 'all',
    venue: 'all',
    status: 'all',
    sort: 'newest',
  });

  useEffect(() => {
    async function load() {
      const [eventData, societyData] = await Promise.all([
        api.get<{ events: EventItem[] }>('/events'),
        api.get<{ societies: Society[] }>('/societies'),
      ]);
      setEvents(eventData.events || []);
      setSocieties(societyData.societies || []);
      setCategories([]);
      setVenues([]);
    }

    load();
  }, []);

  const filteredEvents = useMemo(() => {
    const query = filters.search.toLowerCase();
    let result = [...events];

    if (query) {
      result = result.filter((event) =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.society?.name.toLowerCase().includes(query)
      );
    }

    if (filters.society !== 'all') {
      result = result.filter((event) => event.society?.id === filters.society);
    }

    if (filters.category !== 'all') {
      result = result.filter((event) => event.category?.id === filters.category);
    }

    if (filters.venue !== 'all') {
      result = result.filter((event) => event.venue?.id === filters.venue);
    }

    if (filters.status !== 'all') {
      result = result.filter((event) => event.status === filters.status);
    }

    if (filters.sort === 'upcoming') {
      result.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
    } else if (filters.sort === 'date') {
      result.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
    } else {
      result.sort((a, b) => (b.registrationCount ?? 0) - (a.registrationCount ?? 0));
    }

    return result;
  }, [filters, events]);

  return (
    <div className="page-shell">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-indigo-600">Explore events</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">Find your next campus moment</h1>
        </div>
      </div>

      <div className="card-surface mb-8 p-4">
        <div className="grid gap-4 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_0.8fr]">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <Search className="h-4 w-4" />
            <input
              value={filters.search}
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
              placeholder="Search events, societies or venues"
              className="w-full border-0 bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>

          <select value={filters.society} onChange={(event) => setFilters((current) => ({ ...current, society: event.target.value }))} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <option value="all">All societies</option>
            {societies.map((society) => (
              <option key={society.id} value={society.id}>{society.name}</option>
            ))}
          </select>

          <select value={filters.category} onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>

          <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <option value="all">All statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select value={filters.sort} onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <option value="newest">Newest</option>
            <option value="upcoming">Upcoming</option>
            <option value="date">Date</option>
            <option value="popular">Popular</option>
          </select>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
        <div className="flex items-center gap-2"><Filter className="h-4 w-4" /> {filteredEvents.length} matches</div>
        <div className="flex items-center gap-2"><ArrowUpDown className="h-4 w-4" /> Sorted by {filters.sort}</div>
      </div>

      {filteredEvents.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="card-surface p-10 text-center">
          <p className="text-lg font-semibold text-slate-900">No events match your filters.</p>
          <p className="mt-2 text-sm text-slate-600">Try broadening your search.</p>
        </div>
      )}
    </div>
  );
}
