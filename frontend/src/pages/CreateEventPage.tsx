import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    description: '',
    societyId: 'cmblnm7vf0000v0k5n5tqg0v7',
    categoryId: 'cmblnm7vf0001v0k5n5tqg0v8',
    venueId: 'cmblnm7vf0002v0k5n5tqg0v9',
    eventDate: '2026-10-20',
    startTime: '09:00',
    endTime: '10:30',
    registrationDeadline: '2026-10-15',
    capacity: 80,
    eligibility: 'Open to all students',
    tags: 'campus, workshop',
    status: 'DRAFT',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      await api.post('/events', form);
      navigate('/dashboard');
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell max-w-3xl">
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-[0.15em] text-indigo-600">Create event</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Publish a new campus event</h1>
      </div>

      <form onSubmit={handleSubmit} className="card-surface space-y-5 p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">Event title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" required />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">Short description</label>
            <input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" required />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">Full description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-28 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Society ID</label>
            <input value={form.societyId} onChange={(e) => setForm({ ...form, societyId: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Category ID</label>
            <input value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Venue ID</label>
            <input value={form.venueId} onChange={(e) => setForm({ ...form, venueId: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Capacity</label>
            <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Date</label>
            <input type="date" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Start time</label>
            <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">End time</label>
            <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Registration deadline</label>
            <input type="date" value={form.registrationDeadline} onChange={(e) => setForm({ ...form, registrationDeadline: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">Tags</label>
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button className="secondary-button" type="button">Save draft</button>
          <button className="primary-button" type="submit" disabled={loading}>{loading ? 'Publishing...' : 'Publish event'}</button>
        </div>
      </form>
    </div>
  );
}
