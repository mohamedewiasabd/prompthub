import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getAllBlogPosts, getBlogCategories } from '@/lib/seed-blog';
import { Calendar, Clock, Rss, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'مدونة PromptHub | مقالات وأدلة هندسة البرومبتات',
  description: 'مقالات ودلائل عملية بالعربية عن هندسة البرومبتات: أطر العمل، التسويق، توليد الصور، التلخيص، وتجنب الأخطاء الشائعة.',
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://live-stream-sport.com'}/blog` },
  openGraph: {
    title: 'مدونة PromptHub | مقالات وأدلة هندسة البرومبتات',
    description: 'مقالات ودلائل عملية بالعربية عن هندسة البرومبتات والذكاء الاصطناعي.',
    type: 'website'
  }
};

export default function BlogPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://live-stream-sport.com';
  const posts = getAllBlogPosts();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'مدونة PromptHub',
    url: `${baseUrl}/blog`,
    description: 'مقالات ودلائل عملية بالعربية عن هندسة البرومبتات.',
    blogPost: posts.map(p => ({
      '@type': 'BlogPosting',
      headline: p.title,
      datePublished: p.date,
      url: `${baseUrl}/blog/${p.slug}`,
      author: { '@type': 'Organization', name: 'PromptHub' }
    }))
  };

  const categories = getBlogCategories();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header categories={[]} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">
            <Rss className="w-3.5 h-3.5" />
            مدونة المكتبة
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            مقالات وأدلة عملية
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            دليل عربي متكامل لمهارات الذكاء الاصطناعي: أساسيات البرومبتات، أطر العمل، والتطبيقات العملية.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map(cat => (
            <span key={cat} className="text-xs font-bold px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600">
              {cat}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {posts.map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-blue-100 transition-all flex flex-col"
            >
              <div className={`h-36 bg-gradient-to-br ${post.color} relative flex items-center justify-center`}>
                <span className="text-5xl drop-shadow">{post.cover}</span>
                <span className="absolute top-3 right-3 text-xs font-bold text-white bg-black/20 rounded-lg px-2 py-1 backdrop-blur">
                  {post.category}
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h2 className="font-extrabold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-slate-500 mt-1">{post.titleEn}</p>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed flex-1">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(post.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readingTime}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 font-bold text-blue-600">
                    اقرأ المزيد
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}