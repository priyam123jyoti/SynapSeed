import { MetadataRoute } from 'next';
import { SUBJECT_TOPICS } from '@/components/quiz/constants';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://synap-seed.vercel.app';

  // 1. All Core Pages
  const corePages = [
    '',
    '/faculty',
    '/research',
    '/events',
    '/quiz',
    '/synapstore',
    '/moana-ai-unlimited-quiz-generator',
    '/onboarding',
    '/auth', 
    '/profile',
    '/affiliate-store',
    '/text-to-mind-maps',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.9,
  }));

  // 2. Subject Landing Pages (SEO Power-up)
  // Indexes: /quiz?subject=physics, /quiz?subject=botany, etc.
  const subjectLandingPages = Object.keys(SUBJECT_TOPICS).map((subject) => ({
    url: `${baseUrl}/quiz?subject=${subject}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 3. Dynamic Supabase Events
  const { data: events } = await supabase
    .from('events')
    .select('slug');

  const eventPages = (events || []).map((event) => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // 4. Dynamic Quiz Topic Pages (The 120+ deep links)
  // FIX: Added .replace(/&/g, '&amp;') to prevent the "EntityRef" XML crash
  const quizTopicPages = Object.entries(SUBJECT_TOPICS).flatMap(([subject, topics]) =>
    topics.map((topic) => {
      const rawUrl = `${baseUrl}/quiz?subject=${subject}&topic=${encodeURIComponent(topic.name)}`;
      return {
        url: rawUrl.replace(/&/g, '&amp;'), 
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      };
    })
  );

  return [...corePages, ...subjectLandingPages, ...eventPages, ...quizTopicPages];
}