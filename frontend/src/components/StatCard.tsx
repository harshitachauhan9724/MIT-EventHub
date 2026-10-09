import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
}

export default function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="card-surface p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">{label}</div>
          <div className="mt-3 text-3xl font-bold text-slate-900">{value}</div>
        </div>
        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">{icon}</div>
      </div>
    </div>
  );
}
