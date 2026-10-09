import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page-shell flex min-h-[60vh] items-center justify-center">
      <div className="card-surface max-w-lg p-10 text-center">
        <div className="text-6xl font-bold text-indigo-600">404</div>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-3 text-slate-600">The page you were looking for does not exist.</p>
        <Link to="/" className="primary-button mt-6">Back home</Link>
      </div>
    </div>
  );
}
