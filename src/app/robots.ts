import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Prevent Google from showing private/functional pages in search results
      disallow: [
        '/profile', 
        '/onboarding', 
        '/auth', 
        '/api', // Never index your backend routes
      ],
    },
    sitemap: 'https://synap-seed.vercel.app/sitemap.xml',
  }
}