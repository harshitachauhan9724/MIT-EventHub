import { ArrowLeft, CalendarDays, Clock3, MapPin, Share2, Ticket, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { EventItem } from '../types';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<{ event: EventItem }>('/events/' + id);
        setEvent(data.event);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'STUDENT') {
      alert('Only students can register for events.');
      return;
    }

    try {
      setRegistering(true);
      await api.post('/events/' + event!.id + '/register', {});
      alert('Registration successful!');
      navigate('/my-events');
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <div className="page-shell"><div className="soft-panel p-12 text-center text-[var(--muted)]">Loading event details…</div></div>;
  if (!event) return <div className="page-shell"><div className="soft-panel p-12 text-center text-[var(--muted)]">Event not found.</div></div>;

  const availableSeats = event.capacity ? Math.max(event.capacity - (event.registrationCount ?? 0), 0) : 0;

  return (
    <div className="page-shell page-spaced">
      <button onClick={() => navigate('/events')} className="secondary-button gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to events
      </button>

      <div className="featured-visual-panel mt-6">
        <img src={event.banner || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80'} alt={event.title} className="featured-visual-image" />
      </div>

      <div className="detail-layout">
        <div className="detail-main">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge">{event.society?.name}</span>
            <span className="badge">{event.category?.name}</span>
            <span className="badge">{event.status}</span>
          </div>

          <div className="mt-6">
            <h1 className="detail-hero-title">{event.title}</h1>
            <p className="detail-hero-copy">{event.shortDescription}</p>
          </div>

          <div className="stats-grid mt-6">
            <div className="info-tile">
              <CalendarDays className="h-5 w-5" />
              <div className="info-label">Date</div>
              <div className="info-value">{new Date(event.eventDate).toLocaleDateString()}</div>
            </div>
            <div className="info-tile">
              <Clock3 className="h-5 w-5" />
              <div className="info-label">Time</div>
              <div className="info-value">{event.startTime} - {event.endTime}</div>
            </div>
            <div className="info-tile">
              <MapPin className="h-5 w-5" />
              <div className="info-label">Venue</div>
              <div className="info-value">{event.venue?.name}</div>
            </div>
            <div className="info-tile">
              <Users className="h-5 w-5" />
              <div className="info-label">Seats left</div>
              <div className="info-value">{availableSeats}</div>
            </div>
          </div>

          <div className="soft-panel info-panel">
            <h2 className="section-subtitle">About this event</h2>
            <p className="paragraph-copy">{event.description}</p>
          </div>

          <div className="soft-panel info-panel">
            <h2 className="section-subtitle">Eligibility & tags</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {(event.tags || 'Campus community').split(',').map((tag) => (
                <span key={tag} className="badge">{tag.trim()}</span>
              ))}
            </div>
            <p className="paragraph-copy mt-4">Eligibility: {event.eligibility || 'Open to all students.'}</p>
          </div>
        </div>

        <aside className="detail-side">
          <div className="soft-panel side-panel">
            <div className="side-label"><Ticket className="h-4 w-4" /> Registration</div>

            <div className="mt-5 space-y-3 text-sm text-[var(--muted)]">
              <div className="side-stat-row"><span>Society</span><span className="stat-strong">{event.society?.name}</span></div>
              <div className="side-stat-row"><span>Capacity</span><span className="stat-strong">{event.capacity || 'Unlimited'}</span></div>
              <div className="side-stat-row"><span>Deadline</span><span className="stat-strong">{new Date(event.registrationDeadline).toLocaleDateString()}</span></div>
            </div>

            <button onClick={handleRegister} disabled={registering || event.status === 'CANCELLED'} className="primary-button mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50">
              {registering ? 'Registering...' : 'Register for event'}
            </button>
            <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="secondary-button mt-3 w-full gap-2">
              <Share2 className="h-4 w-4" /> Share event
            </button>
          </div>

          <div className="soft-panel side-panel">
            <h3 className="section-subtitle">Organizer</h3>
            <div className="mt-4 flex items-center gap-3">
              <div className="organizer-avatar">{event.organizer?.user?.name?.charAt(0) || 'O'}</div>
              <div>
                <div className="organizer-name">{event.organizer?.user?.name || 'Campus Organizer'}</div>
                <div className="organizer-role">{event.society?.name}</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
