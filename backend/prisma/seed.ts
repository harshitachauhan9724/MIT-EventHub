import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.notification.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.eventCategory.deleteMany();
  await prisma.organizerProfile.deleteMany();
  await prisma.society.deleteMany();
  await prisma.user.deleteMany();

  const societies = [
    {
      name: 'Literary Society',
      slug: 'literary-society',
      description: 'A creative community focused on literature, poetry, debates, writing, storytelling, quizzes, book discussions and language-focused activities.',
      category: 'Arts & Humanities',
      logo: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80',
      banner: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
      contactInformation: 'literary@campus.edu',
      socialLinks: 'Instagram, LinkedIn',
      isActive: true,
    },
    {
      name: 'Hobbies Club',
      slug: 'hobbies-club',
      description: 'A creative community where students explore art, photography, music, dance, crafts, gaming and other hobbies.',
      category: 'Lifestyle & Creative',
      logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
      banner: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
      contactInformation: 'hobbies@campus.edu',
      socialLinks: 'Instagram, Discord',
      isActive: true,
    },
    {
      name: 'MIT Tech Club',
      slug: 'tech-club',
      description: 'A technology-focused community conducting coding competitions, hackathons, workshops, web development sessions, cybersecurity activities and innovation events.',
      category: 'Technology',
      logo: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=600&q=80',
      banner: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      contactInformation: 'techclub@campus.edu',
      socialLinks: 'GitHub, LinkedIn',
      isActive: true,
    },
    {
      name: 'AIML Student Society',
      slug: 'aiml-student-society',
      description: 'A student community focused on Artificial Intelligence, Machine Learning, Data Science, Generative AI, research, workshops, seminars and practical projects.',
      category: 'AI & Data',
      logo: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
      banner: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80',
      contactInformation: 'aiml@campus.edu',
      socialLinks: 'LinkedIn, Research',
      isActive: true,
    },
    {
      name: 'CSSS',
      slug: 'csss',
      description: 'A student society focused on computing, technical activities, academic initiatives, competitions, workshops and student-driven campus events.',
      category: 'Computing',
      logo: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=600&q=80',
      banner: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
      contactInformation: 'csss@campus.edu',
      socialLinks: 'GitHub, Email',
      isActive: true,
    },
  ];

  const createdSocieties = await Promise.all(
    societies.map((society) => prisma.society.create({ data: society }))
  );

  const categories = [
    { name: 'Workshop', description: 'Practical sessions.' },
    { name: 'Hackathon', description: 'Build and solve.' },
    { name: 'Competition', description: 'Contests and battles.' },
    { name: 'Seminar', description: 'Talks and knowledge sessions.' },
    { name: 'Cultural', description: 'Creative experiences.' },
    { name: 'Networking', description: 'Meet and connect.' },
  ];

  const createdCategories = await Promise.all(
    categories.map((category) => prisma.eventCategory.create({ data: category }))
  );

  const venues = [
    { name: 'Central Auditorium', building: 'Main Block', room: 'A-201', capacity: 250, location: 'North Campus' },
    { name: 'Innovation Lab', building: 'STEM Tower', room: 'L-102', capacity: 80, location: 'Engineering Wing' },
    { name: 'Library Hall', building: 'Knowledge Center', room: 'Hall 3', capacity: 140, location: 'East Campus' },
    { name: 'Maker Space', building: 'Design Studio', room: 'M-8', capacity: 60, location: 'South Campus' },
    { name: 'Seminar Room 4', building: 'Faculty Block', room: 'SR-4', capacity: 100, location: 'West Campus' },
    { name: 'Open Air Stage', building: 'Green Plaza', room: 'Plaza', capacity: 300, location: 'Central Green' },
  ];

  const createdVenues = await Promise.all(
    venues.map((venue) => prisma.venue.create({ data: venue }))
  );

  const admin = await prisma.user.create({
    data: {
      name: 'Campus Admin',
      email: 'admin@campus.local',
      passwordHash: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
    },
  });

  const organizerUser = await prisma.user.create({
    data: {
      name: 'Ava Organiser',
      email: 'organizer@campus.local',
      passwordHash: await bcrypt.hash('organizer123', 10),
      role: 'ORGANIZER',
    },
  });

  const studentUser = await prisma.user.create({
    data: {
      name: 'Harshita',
      email: 'student@campus.local',
      passwordHash: await bcrypt.hash('student123', 10),
      role: 'STUDENT',
    },
  });

  const students = await Promise.all(
    [
      { name: 'Aria Patel', email: 'aria@student.local', passwordHash: await bcrypt.hash('student123', 10) },
      { name: 'Noah Singh', email: 'noah@student.local', passwordHash: await bcrypt.hash('student123', 10) },
      { name: 'Zara Khan', email: 'zara@student.local', passwordHash: await bcrypt.hash('student123', 10) },
      { name: 'Leo Martin', email: 'leo@student.local', passwordHash: await bcrypt.hash('student123', 10) },
      { name: 'Ishita Roy', email: 'ishita@student.local', passwordHash: await bcrypt.hash('student123', 10) },
      { name: 'Aman Shah', email: 'aman@student.local', passwordHash: await bcrypt.hash('student123', 10) },
    ].map((student) => prisma.user.create({ data: { ...student, role: 'STUDENT' } }))
  );

  const organizerProfiles = await Promise.all(
    createdSocieties.map((society, index) =>
      prisma.organizerProfile.create({
        data: {
          userId: index === 0 ? organizerUser.id : students[index]?.id ?? organizerUser.id,
          societyId: society.id,
          designation: index === 0 ? 'President' : 'Coordinator',
          bio: 'Campus community organizer.',
        },
      })
    )
  );

  const eventCatalog = [
    { title: 'Poetry Evening', society: 'Literary Society', category: 'Workshop', venue: 'Central Auditorium', date: '2026-10-02', startTime: '17:30', endTime: '19:00', deadline: '2026-09-27', capacity: 120, tags: 'poetry, open mic', status: 'PUBLISHED' },
    { title: 'Inter-College Debate', society: 'Literary Society', category: 'Competition', venue: 'Library Hall', date: '2026-10-06', startTime: '16:00', endTime: '18:30', deadline: '2026-10-01', capacity: 90, tags: 'debate, speaking', status: 'PUBLISHED' },
    { title: 'Creative Writing Workshop', society: 'Literary Society', category: 'Workshop', venue: 'Seminar Room 4', date: '2026-11-05', startTime: '14:00', endTime: '16:00', deadline: '2026-10-30', capacity: 80, tags: 'writing, stories', status: 'PUBLISHED' },
    { title: 'Book Discussion Circle', society: 'Literary Society', category: 'Seminar', venue: 'Library Hall', date: '2026-09-25', startTime: '18:00', endTime: '19:30', deadline: '2026-09-20', capacity: 50, tags: 'books, discussion', status: 'ONGOING' },
    { title: 'Open Mic Night', society: 'Literary Society', category: 'Cultural', venue: 'Open Air Stage', date: '2026-12-01', startTime: '18:30', endTime: '21:00', deadline: '2026-11-25', capacity: 180, tags: 'music, spoken word', status: 'PUBLISHED' },
    { title: 'Photography Walk', society: 'Hobbies Club', category: 'Workshop', venue: 'Open Air Stage', date: '2026-10-10', startTime: '07:30', endTime: '09:30', deadline: '2026-10-05', capacity: 60, tags: 'photography, campus', status: 'PUBLISHED' },
    { title: 'Art Workshop', society: 'Hobbies Club', category: 'Workshop', venue: 'Maker Space', date: '2026-10-20', startTime: '15:00', endTime: '17:00', deadline: '2026-10-15', capacity: 40, tags: 'art, canvas', status: 'PUBLISHED' },
    { title: 'Music Jam', society: 'Hobbies Club', category: 'Cultural', venue: 'Central Auditorium', date: '2026-11-12', startTime: '18:00', endTime: '20:30', deadline: '2026-11-07', capacity: 120, tags: 'music, live band', status: 'PUBLISHED' },
    { title: 'Dance Showcase', society: 'Hobbies Club', category: 'Cultural', venue: 'Open Air Stage', date: '2026-12-03', startTime: '18:00', endTime: '20:30', deadline: '2026-11-28', capacity: 150, tags: 'dance, performance', status: 'PUBLISHED' },
    { title: 'Creative Craft Session', society: 'Hobbies Club', category: 'Workshop', venue: 'Maker Space', date: '2026-09-18', startTime: '13:00', endTime: '15:00', deadline: '2026-09-12', capacity: 35, tags: 'craft, creativity', status: 'COMPLETED' },
    { title: 'Campus Hackathon', society: 'MIT Tech Club', category: 'Hackathon', venue: 'Innovation Lab', date: '2026-10-15', startTime: '09:00', endTime: '18:00', deadline: '2026-10-10', capacity: 200, tags: 'hackathon, coding', status: 'PUBLISHED' },
    { title: 'Web Development Workshop', society: 'MIT Tech Club', category: 'Workshop', venue: 'Innovation Lab', date: '2026-10-18', startTime: '15:00', endTime: '17:30', deadline: '2026-10-13', capacity: 70, tags: 'web, frontend', status: 'PUBLISHED' },
    { title: 'Coding Challenge', society: 'MIT Tech Club', category: 'Competition', venue: 'Seminar Room 4', date: '2026-11-10', startTime: '10:00', endTime: '12:30', deadline: '2026-11-05', capacity: 80, tags: 'algorithms, coding', status: 'PUBLISHED' },
    { title: 'Cybersecurity Workshop', society: 'MIT Tech Club', category: 'Workshop', venue: 'Innovation Lab', date: '2026-09-30', startTime: '12:00', endTime: '14:00', deadline: '2026-09-25', capacity: 60, tags: 'security, ethics', status: 'PUBLISHED' },
    { title: 'Developer Meetup', society: 'MIT Tech Club', category: 'Networking', venue: 'Central Auditorium', date: '2026-12-11', startTime: '18:00', endTime: '20:00', deadline: '2026-12-06', capacity: 150, tags: 'networking, career', status: 'PUBLISHED' },
    { title: 'AI Bootcamp', society: 'AIML Student Society', category: 'Workshop', venue: 'Innovation Lab', date: '2026-10-28', startTime: '10:00', endTime: '15:00', deadline: '2026-10-22', capacity: 80, tags: 'ai, learning', status: 'PUBLISHED' },
    { title: 'Machine Learning Workshop', society: 'AIML Student Society', category: 'Workshop', venue: 'Innovation Lab', date: '2026-11-18', startTime: '13:00', endTime: '15:30', deadline: '2026-11-12', capacity: 90, tags: 'ml, data', status: 'PUBLISHED' },
    { title: 'Generative AI Seminar', society: 'AIML Student Society', category: 'Seminar', venue: 'Central Auditorium', date: '2026-09-22', startTime: '17:00', endTime: '18:30', deadline: '2026-09-17', capacity: 180, tags: 'genai, trends', status: 'ONGOING' },
    { title: 'Data Science Challenge', society: 'AIML Student Society', category: 'Competition', venue: 'Seminar Room 4', date: '2026-12-20', startTime: '11:00', endTime: '15:00', deadline: '2026-12-15', capacity: 100, tags: 'data, analytics', status: 'PUBLISHED' },
    { title: 'AI Project Showcase', society: 'AIML Student Society', category: 'Seminar', venue: 'Open Air Stage', date: '2027-01-10', startTime: '17:30', endTime: '20:00', deadline: '2027-01-05', capacity: 200, tags: 'showcase, projects', status: 'DRAFT' },
    { title: 'Technical Quiz', society: 'CSSS', category: 'Competition', venue: 'Seminar Room 4', date: '2026-10-14', startTime: '16:00', endTime: '18:00', deadline: '2026-10-09', capacity: 50, tags: 'quiz, tech', status: 'PUBLISHED' },
    { title: 'Programming Contest', society: 'CSSS', category: 'Competition', venue: 'Innovation Lab', date: '2026-11-01', startTime: '09:30', endTime: '13:00', deadline: '2026-10-27', capacity: 70, tags: 'contest, coding', status: 'PUBLISHED' },
    { title: 'Student Research Meetup', society: 'CSSS', category: 'Networking', venue: 'Library Hall', date: '2026-10-25', startTime: '17:30', endTime: '19:00', deadline: '2026-10-20', capacity: 90, tags: 'research, club', status: 'PUBLISHED' },
    { title: 'Tech Talk', society: 'CSSS', category: 'Seminar', venue: 'Central Auditorium', date: '2026-09-23', startTime: '18:00', endTime: '19:30', deadline: '2026-09-18', capacity: 140, tags: 'seminar, innovation', status: 'PUBLISHED' },
    { title: 'Computing Workshop', society: 'CSSS', category: 'Workshop', venue: 'Innovation Lab', date: '2026-12-08', startTime: '14:00', endTime: '16:00', deadline: '2026-12-03', capacity: 60, tags: 'computing, skills', status: 'PUBLISHED' },
  ];

  const societyMap = new Map(createdSocieties.map((society) => [society.name, society]));
  const categoryMap = new Map(createdCategories.map((category) => [category.name, category]));
  const venueMap = new Map(createdVenues.map((venue) => [venue.name, venue]));

  for (const item of eventCatalog) {
    const society = societyMap.get(item.society)!;
    const category = categoryMap.get(item.category)!;
    const venue = venueMap.get(item.venue)!;
    const organizer = organizerProfiles[0];

    await prisma.event.create({
      data: {
        title: item.title,
        slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        shortDescription: `${item.title} for the campus community.`,
        description: `${item.title} is a campus event organized by ${society.name}.`,
        banner: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
        categoryId: category.id,
        societyId: society.id,
        organizerId: organizer.id,
        venueId: venue.id,
        eventDate: new Date(item.date),
        startTime: item.startTime,
        endTime: item.endTime,
        registrationDeadline: new Date(item.deadline),
        capacity: item.capacity,
        eligibility: 'Open to all current students.',
        tags: item.tags,
        status: item.status,
      },
    });
  }

  const sampleEvents = await prisma.event.findMany({ include: { society: true, category: true, venue: true } });

  for (let index = 0; index < students.length; index++) {
    const student = students[index];
    const event = sampleEvents[index % sampleEvents.length];
    await prisma.registration.create({
      data: {
        eventId: event.id,
        studentId: student.id,
        registrationNumber: `REG-${String(index + 1).padStart(4, '0')}`,
        status: 'ACTIVE',
      },
    });

    await prisma.notification.create({
      data: {
        userId: student.id,
        title: 'Registration confirmed',
        message: `You are registered for ${event.title}.`,
        type: 'REGISTRATION',
        isRead: false,
      },
    });

    if (index % 2 === 0) {
      await prisma.feedback.create({
        data: {
          eventId: event.id,
          studentId: student.id,
          rating: 4,
          comment: 'Very engaging event with a great campus atmosphere.',
        },
      });
    }
  }

  const createdRegistration = await prisma.registration.findFirst();
  if (createdRegistration) {
    await prisma.attendance.create({
      data: {
        registrationId: createdRegistration.id,
        checkedInAt: new Date(),
        checkedInBy: admin.id,
        status: 'PRESENT',
      },
    });
  }

  await prisma.notification.create({
    data: {
      userId: admin.id,
      title: 'Welcome to MIT EventHub',
      message: 'The platform is ready for event management.',
      type: 'ANNOUNCEMENT',
      isRead: false,
    },
  });

  console.log('Seed data created successfully.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
