import { useEffect, useState } from 'react';
import { api } from '../api/client';
import SocietyCard from '../components/SocietyCard';
import type { Society } from '../types';

export default function SocietiesPage() {
  const [societies, setSocieties] = useState<Society[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<{ societies: Society[] }>('/societies');
        setSocieties(data.societies || []);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <div className="page-shell">Loading societies…</div>;

  return (
    <div className="page-shell">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.15em] text-indigo-600">Societies</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Campus clubs and communities</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {societies.map((society) => (
          <SocietyCard key={society.id} society={society} />
        ))}
      </div>
    </div>
  );
}
