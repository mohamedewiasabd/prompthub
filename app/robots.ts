import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.APP_URL || 'https://live-stream-sport.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/secret-admin-portal', '/api/admin/'],
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'ClaudeBot',
          'anthropic-ai',
          'PerplexityBot',
          'Google-Extended',
          'CCBot',
          'Applebot',
          'Bytespider',
          'Diffbot'
        ],
        allow: ['/', '/category/*', '/p/*', '/llms.txt', '/llms-full.txt', '/api/ai-read/*'],
        disallow: ['/secret-admin-portal', '/api/admin/'],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
