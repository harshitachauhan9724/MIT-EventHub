export type UserRole = 'STUDENT' | 'ORGANIZER' | 'ADMIN';

export interface Society {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  banner?: string;
  category: string;
  contactInformation?: string;
  socialLinks?: string;
  isActive: boolean;
}

export interface EventCategory {
  id: string;
  name: string;
  description?: string;
}

export interface Venue {
  id: string;
  name: string;
  building?: string;
  room?: string;
  position?: string;
  location?: string;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  banner?: string;
  category: EventCategory;
  society: Society;
  venue: Venue;
  eventDate: string;
  startTime: string;
  endTime: string;
  registrationDeadline: string;
  capacity?: number;
  eligibility?: string;
  tags?: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'PUBLISHED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  registrationCount?: number;
  remainingSeats?: number | null;
  organizer?: { user?: { name: string } };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  organizerProfile?: { society?: Society } | null;
}
