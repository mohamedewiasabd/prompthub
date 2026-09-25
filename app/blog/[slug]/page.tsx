import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BLOG_POSTS, getBlogPostBySlug } from '@/lib/seed-blog';
import { Calendar, Clock, User, ArrowLeft, Lightbulb, Check } from 'lucide-react';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return BLOG_POSTS.map(p => ({ slug: p.slug }));
}

// Allow AI-generated articles (saved to the DB via the API) to render on demand.
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: 'مقال غير موجود | PromptHub' };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://live-stream-sport.com';
  const url = `${baseUrl}/blog/${post.slug}`;
  return {
    title: `${post.title} | PromptHub`,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: 'article',
      siteName: 'PromptHub',
      publishedTime: post.date,
      authors: [post.author]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt
    }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://live-stream-sport.com';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    inLanguage: 'ar',
    url: `${baseUrl}/blog/${post.slug}`,
    datePublished: post.date,
    dateModified: post.date,
    keywords: post.tags.join(', '),
    author: { '@type': 'Organization', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'PromptHub',
      logo: { '@type': 'ImageObject', url: `${baseUrl}/icon.png` }
    },
    about: post.tags.map(t => ({ '@type': 'Thing', name: t }))
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header categories={[]} />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4" />
            العودة إلى المدونة
          </Link>
        </div>

        <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className={`bg-gradient-to-br ${post.color} px-6 sm:px-8 py-10 text-center`}>
            <span className="text-6xl drop-shadow">{post.cover}</span>
            <h1 className="mt-4 text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-snug">
              {post.title}
            </h1>
            <p className="mt-2 text-white/80 text-xs font-sans">{post.titleEn}</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-white/85">
              <span className="inline-flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                {post.author}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(post.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {post.readingTime}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {post.sections.map((section, si) => (
              <section key={si} className="space-y-3">
                {section.heading && (
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 border-r-4 border-blue-500 pr-3">
                    {section.heading}
                  </h2>
                )}
                {section.paragraphs.map((para, pi) => (
                  <p key={pi} className="text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                    {para}
                  </p>
                ))}
                {section.list && (
                  <ul className="space-y-2">
                    {section.list.map((item, li) => (
                      <li key={li} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.prompt && (
                  <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 space-y-2" dir={section.prompt.english ? 'ltr' : 'rtl'}>
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
                      <Lightbulb className="w-4 h-4" />
                      {section.prompt.title}
                    </div>
                    <div className="rounded-lg bg-slate-900 text-slate-100 text-[13px] leading-relaxed p-4 font-mono whitespace-pre-wrap text-right">
                      {section.prompt.text}
                    </div>
                  </div>
                )}
                {section.tips && (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                    <div className="text-xs font-bold text-emerald-700 mb-2">نصائح عملية</div>
                    <ul className="space-y-1.5">
                      {section.tips.map((tip, ti) => (
                        <li key={ti} className="flex items-start gap-2 text-sm text-emerald-900">
                          <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ))}
          </div>
        </article>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {post.tags.map(tag => (
            <span key={tag} className="text-xs font-bold px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600">
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 text-center">
          <h3 className="font-extrabold text-slate-900 text-lg">جرّب التعلم العملي</h3>
          <p className="text-sm text-slate-500 mt-1 mb-4">أفكار المقال قابلة للتطبيق فوراً عبر برومبتات المكتبة الجاهزة.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/learn" className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl px-4 py-2 transition-colors">
              تصفح أدلة التعلم
            </Link>
            <Link href="/trending" className="text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl px-4 py-2 transition-colors">
              الأكثر رواجاً الآن
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}