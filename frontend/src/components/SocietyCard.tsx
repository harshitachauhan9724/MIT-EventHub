import { ArrowRight, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Society } from '../types';

interface SocietyCardProps {
  society: Society;
}

export default function SocietyCard({ society }: SocietyCardProps) {
  return (
    <article className="group card-surface overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-32 overflow-hidden">
        <img
          src={society.banner || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80'}
          alt={society.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-center gap-3">
          <img src={society.logo || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80'} alt={society.name} className="h-12 w-12 rounded-2xl object-cover ring-2 ring-white shadow-sm" />
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{society.name}</h3>
            <p className="text-sm text-slate-500">{society.category}</p>
          </div>
        </div>
        <p className="line-clamp-3 text-sm leading-6 text-slate-600">{society.description}</p>
        <div className="flex items-center justify-between border-t border-slate-200 pt-3">
          <div className="flex items-center gap-1.5 text-sm text-slate-500"><Users className="h-4 w-4 text-indigo-600" /> community</div>
          <Link to={`/societies/${society.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600">
            Explore <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
