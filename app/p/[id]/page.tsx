import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPromptById, getAllCategories } from '@/lib/db';
import { PromptDetailClient } from '@/components/PromptDetailClient';

type Params = { id: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const prompt = getPromptById(id);
  if (!prompt) return { title: 'برومبت غير موجود | PromptHub' };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://live-stream-sport.com';
  const title = `${prompt.title} | PromptHub`;
  const description = prompt.description || 'برومبت ذكاء اصطناعي احترافي من مكتبة البرومبتات الذكية';
  const url = `${baseUrl}/p/${prompt.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: 'PromptHub',
      images: [
        {
          url: `${baseUrl}/og/prompt/${prompt.id}`,
          width: 1200,
          height: 630,
          alt: prompt.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  };
}

export default async function PromptPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const prompt = getPromptById(id);
  const categories = getAllCategories();

  if (!prompt) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://live-stream-sport.com';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    headline: prompt.title,
    description: prompt.description || '',
    inLanguage: 'ar',
    url: `${baseUrl}/p/${prompt.id}`,
    learningResourceType: 'Prompt Engineering Resource',
    educationalUse: 'AI Prompt',
    datePublished: prompt.createdAt,
    dateModified: prompt.updatedAt,
    interactionStatistic: [
      { '@type': 'InteractionCounter', interactionType: 'https://schema.org/ViewAction', userInteractionCount: prompt.views },
      { '@type': 'InteractionCounter', interactionType: 'https://schema.org/DownloadAction', userInteractionCount: prompt.copies },
      { '@type': 'InteractionCounter', interactionType: 'https://schema.org/LikeAction', userInteractionCount: prompt.likes }
    ],
    aggregateRating: prompt.ratingCount
      ? {
          '@type': 'AggregateRating',
          ratingValue: (prompt.ratingAverage || 0).toFixed(1),
          ratingCount: prompt.ratingCount
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'PromptHub',
      url: baseUrl
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PromptDetailClient prompt={prompt} categories={categories} />
    </>
  );
}
