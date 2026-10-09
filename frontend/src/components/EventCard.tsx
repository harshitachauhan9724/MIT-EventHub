import { ArrowRight, CalendarDays, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { EventItem } from '../types';

interface EventCardProps {
  event: EventItem;
}

export default function EventCard({ event }: EventCardProps) {
  const availableSeats = event.capacity && event.capacity > 0 ? Math.max(event.capacity - (event.registrationCount ?? 0), 0) : 0;

  const statusLabel =
    event.status === 'PUBLISHED' ? 'Open' :
    event.status === 'ONGOING' ? 'Ongoing' :
    event.status === 'COMPLETED' ? 'Completed' :
    event.status === 'CANCELLED' ? 'Cancelled' :
    'Draft';

  const statusStyles =
    event.status === 'CANCELLED' ? 'bg-[#2E151B] text-[#F5F1EE] border-[#DA7B93]/60' :
    event.status === 'COMPLETED' ? 'bg-[#1C3334] text-[#F5F1EE] border-[#376E6F]/60' :
    'bg-[#376E6F]/15 text-[#DFF1F0] border-[#376E6F]/40';

  return (
    <article className="event-card-3d group">
      <div className="event-card-visual">
        <img
          src={event.banner || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80'}
          alt={event.title}
          className="event-card-image"
        />
        <div className="event-card-overlay" />
        <div className="event-card-chip">{event.society?.name}</div>
        <div className={`event-card-status ${statusStyles}`}>{statusLabel}</div>
      </div>

      <div className="event-card-body">
        <div className="event-card-meta">
          <span>{event.category?.name}</span>
          <span>{new Date(event.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        </div>

        <div>
          <h3 className="event-card-title">{event.title}</h3>
          <p className="event-card-description">{event.shortDescription}</p>
        </div>

        <div className="event-card-details">
          <div className="detail-row"><CalendarDays className="h-4 w-4" /> {event.startTime} - {event.endTime}</div>
          <div className="detail-row"><MapPin className="h-4 w-4" /> {event.venue?.name}</div>
          <div className="detail-row"><Users className="h-4 w-4" /> {availableSeats} seats left</div>
        </div>

        <div className="event-card-footer">
          <div className="event-footnote">{event.capacity ? `${event.capacity} cap` : 'Open access'}</div>
          <Link to={`/events/${event.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#F5F1EE]">
            View Details <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
