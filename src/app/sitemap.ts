import { MetadataRoute } from 'next';
import { SUBJECT_TOPICS } from '@/components/quiz/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://synapseed.com'; // Replace with your actual domain

  // 1. Static Pages
  const staticPages = [
    '',
    '/synapstore',
    '/moana-gateway',
    '/quiz',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1,
  }));

  // 2. Dynamic Quiz Topic Pages
  // This turns your 120+ topics into searchable URLs for Google
  const quizTopicPages = Object.entries(SUBJECT_TOPICS).flatMap(([subject, topics]) =>
    topics.map((topic) => ({
      url: `${baseUrl}/quiz?subject=${subject}&topic=${encodeURIComponent(topic.name)}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  );

  return [...staticPages, ...quizTopicPages];
}