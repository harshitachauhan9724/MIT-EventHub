import { useEffect, useState } from 'react';
import { api } from '../api/client';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<{ notifications: any[] }>('/notifications');
        setNotifications(data.notifications || []);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const markAllRead = async () => {
    await api.patch('/notifications/read-all');
    setNotifications((items) => items.map((item) => ({ ...item, isRead: true })));
  };

  if (loading) return <div className="page-shell">Loading notifications…</div>;

  return (
    <div className="page-shell space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-indigo-600">Notifications</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">Your updates</h1>
        </div>
        <button onClick={markAllRead} className="secondary-button">Mark all read</button>
      </div>

      {notifications.length ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className={`card-surface p-5 ${notification.isRead ? 'opacity-80' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-slate-900">{notification.title}</div>
                  <div className="mt-2 text-sm text-slate-600">{notification.message}</div>
                </div>
                {!notification.isRead && <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">New</span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-surface p-10 text-center text-slate-600">No notifications yet.</div>
      )}
    </div>
  );
}
