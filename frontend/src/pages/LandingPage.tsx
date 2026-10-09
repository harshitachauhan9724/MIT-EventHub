import { ArrowRight, Building2, CalendarRange, CheckCircle2, Sparkles, Trophy, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import Animated3DScene from '../components/Animated3DScene';
import EventCard from '../components/EventCard';
import SocietyCard from '../components/SocietyCard';
import type { EventItem, Society } from '../types';

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            node.classList.add('visible');
            observer.unobserve(node);
          }
        });
      },
      { threshold: 0.18 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [societies, setSocieties] = useState<Society[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [eventData, societyData] = await Promise.all([
          api.get<{ events: EventItem[] }>('/events?sort=upcoming'),
          api.get<{ societies: Society[] }>('/societies'),
        ]);
        setEvents(eventData.events || []);
        setSocieties((societyData.societies || []).slice(0, 4));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <div className="page-shell"><div className="soft-panel p-12 text-center text-[var(--muted)]">Loading campus experiences…</div></div>;
  }

  const featureHighlights = [
    { icon: CalendarRange, title: 'Smart discovery', text: 'Discover events by society, venue, category, and accessibility in minutes.' },
    { icon: Trophy, title: 'Real recognition', text: 'Digital tickets, certificates, and feedback keep engagement meaningful.' },
    { icon: Building2, title: 'Campus-wide insights', text: 'Built for organizers, admins, and students in a single premium platform.' },
  ];

  const steps = [
    'Explore campus events and societies',
    'Register in a single tap with QR tickets',
    'Track attendance, feedback, and your schedule',
  ];

  return (
    <div className="landing-page-shell">
      <section className="page-shell pt-10 sm:pt-14">
        <div className="editorial-hero-panel">
          <div className="editorial-hero-copy">
            <div className="hero-chip">
              <Sparkles className="h-4 w-4" /> Campus experiences worth showing up for
            </div>
            <h1>Discover what’s happening on campus.</h1>
            <p>
              Explore events, connect with societies, register instantly, and never miss what’s next.
            </p>

            <div className="hero-actions">
              <button onClick={() => navigate('/events')} className="primary-button gap-2">
                Explore Events <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={() => navigate('/register')} className="secondary-button gap-2">
                Host an Event
              </button>
            </div>

            <div className="hero-meta">
              <span><CalendarRange className="h-4 w-4" /> 100+ events yearly</span>
              <span><Users className="h-4 w-4" /> 12k active members</span>
            </div>
          </div>

          <div className="hero-visual-wrap">
            <Animated3DScene />
            <div className="floating-stat left">
              <div className="floating-label">Featured</div>
              <div className="floating-title">Campus Hackathon</div>
              <div className="floating-copy">Building the next generation of ideas</div>
            </div>
            <div className="floating-stat right">
              <div className="floating-label">This week</div>
              <div className="floating-number">24</div>
              <div className="floating-copy">Events happening</div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-8">
        <Reveal>
          <div className="stats-grid">
            {[
              { label: 'Students', value: '12k+' },
              { label: 'Events hosted', value: '320+' },
              { label: 'Avg rating', value: '4.8/5' },
              { label: 'Certificates issued', value: '3.1k' },
            ].map((stat) => (
              <div key={stat.label} className="metric-card">
                <div className="metric-label">{stat.label}</div>
                <div className="metric-value">{stat.value}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="page-shell py-8">
        <Reveal className="section-header">
          <div>
            <p className="eyebrow">Featured events</p>
            <h2 className="section-title">Campus highlights</h2>
          </div>
          <button onClick={() => navigate('/events')} className="secondary-button">Browse all</button>
        </Reveal>
        <Reveal className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {(events || []).slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </Reveal>
      </section>

      <section className="page-shell py-8">
        <Reveal className="section-header">
          <div>
            <p className="eyebrow">Why Campus Event Planner</p>
            <h2 className="section-title">Built for modern campus life</h2>
          </div>
        </Reveal>

        <Reveal className="mt-6 grid gap-6 md:grid-cols-3">
          {featureHighlights.map(({ icon: Icon, title, text }) => (
            <div key={title} className="soft-panel info-panel">
              <div className="icon-badge"><Icon className="h-6 w-6" /></div>
              <h3 className="panel-title">{title}</h3>
              <p className="panel-copy">{text}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="page-shell py-8">
        <Reveal className="section-header">
          <div>
            <p className="eyebrow">How it works</p>
            <h2 className="section-title">From discovery to attendance</h2>
          </div>
        </Reveal>

        <Reveal className="mt-6 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step} className="soft-panel process-panel">
              <div className="process-index">0{index + 1}</div>
              <p className="process-copy">{step}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="page-shell py-8">
        <Reveal className="section-header">
          <div>
            <p className="eyebrow">Campus communities</p>
            <h2 className="section-title">Student groups you’ll want to join</h2>
          </div>
        </Reveal>
        <Reveal className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {societies.map((society) => (
            <SocietyCard key={society.id} society={society} />
          ))}
        </Reveal>
      </section>

      <section className="page-shell py-8">
        <Reveal>
          <div className="cta-panel">
            <div className="cta-copy">
              <div className="cta-pill"><CheckCircle2 className="h-4 w-4" /> Ready to launch your next event</div>
              <h2>Bring your campus community together.</h2>
            </div>
            <button onClick={() => navigate('/register')} className="cta-button">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </Reveal>
      </section>

      <footer className="page-shell pb-10 pt-4">
        <Reveal className="footer-bar">
          <div className="footer-brand">MIT EventHub</div>
          <div className="footer-links">
            <button onClick={() => navigate('/events')}>Events</button>
            <button onClick={() => navigate('/societies')}>Societies</button>
            <button onClick={() => navigate('/login')}>Login</button>
          </div>
        </Reveal>
      </footer>
    </div>
  );
}
