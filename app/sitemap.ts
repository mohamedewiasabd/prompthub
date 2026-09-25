import { MetadataRoute } from 'next';
import { getAllCategories, getAllPrompts } from '@/lib/db';
import { AI_MODELS, MODEL_COMPARISONS } from '@/lib/seed-ai-models';
import { TECHNIQUES, SKILL_DOMAINS } from '@/lib/seed-techniques';
import { getAllBlogPosts } from '@/lib/seed-blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.APP_URL || 'https://live-stream-sport.com';
  const categories = getAllCategories();
  const prompts = getAllPrompts();

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/llms.txt`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/llms-full.txt`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/shortcuts`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/models`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/learn`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/skills`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/help`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/trending`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }
  ];

  // Categories
  for (const cat of categories) {
    entries.push({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: new Date(cat.updatedAt || new Date()),
      changeFrequency: 'daily',
      priority: 0.8,
    });
  }

  // Prompts
  for (const p of prompts) {
    entries.push({
      url: `${baseUrl}/p/${p.id}`,
      lastModified: new Date(p.updatedAt || new Date()),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  // AI Models
  for (const model of AI_MODELS) {
    entries.push({
      url: `${baseUrl}/models/${model.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  // Model Comparisons
  for (const comp of MODEL_COMPARISONS) {
    entries.push({
      url: `${baseUrl}/compare/${comp.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  // Techniques
  for (const tech of TECHNIQUES) {
    entries.push({
      url: `${baseUrl}/learn/${tech.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  // Blog posts
  for (const post of getAllBlogPosts()) {
    entries.push({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  return entries;
}
