import { MetadataRoute } from 'next';
import { SUBJECT_TOPICS } from '@/components/quiz/constants';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://synap-seed.vercel.app';

  // 1. Core Pages (Static)
  const corePages = [
    '',
    '/faculty',
    '/research',
    '/events',
    '/quiz',
    '/synapstore',
    '/moana-ai-unlimited-quiz-generator',
    '/text-to-mind-maps',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(), // These change often enough to keep as 'now'
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Subject Landing Pages
  const subjectLandingPages = Object.keys(SUBJECT_TOPICS).map((subject) => ({
    url: `${baseUrl}/quiz?subject=${subject}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // 3. Dynamic Events (Using ACTUAL updated dates)
  // SEO PRO TIP: Fetching 'updated_at' makes Google crawl new changes faster
  const { data: events } = await supabase
    .from('events')
    .select('slug, updated_at');

  const eventPages = (events || []).map((event) => ({
    url: `${baseUrl}/events/${event.slug}`,
    // Use actual DB date or fallback to now
    lastModified: event.updated_at ? new Date(event.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9, // Higher priority because these are "Rich Result" pages
  }));

  // 4. Dynamic Quiz Topic Pages
  const quizTopicPages = Object.entries(SUBJECT_TOPICS).flatMap(([subject, topics]) =>
    topics.map((topic) => ({
      // REMOVED manual &amp; replacement. encodeURIComponent is enough for Next.js sitemaps.
      url: `${baseUrl}/quiz?subject=${subject}&topic=${encodeURIComponent(topic.name)}`,
      lastModified: new Date(), 
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))
  );

  return [...corePages, ...subjectLandingPages, ...eventPages, ...quizTopicPages];
}