/**
 * @fileoverview Article Detail Page
 * 
 * Dynamic route for individual article pages.
 * SEO-optimized with dynamic metadata.
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleContent } from '@/components/articles/article-content';

interface Props {
  params: { slug: string };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/articles/slug/${params.slug}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      return { title: '文章不存在' };
    }

    const article = await res.json();

    return {
      title: article.title,
      description: article.metaDescription || article.title,
      openGraph: {
        title: article.title,
        description: article.metaDescription || article.title,
        images: article.coverImage ? [article.coverImage] : [],
        type: 'article',
      },
    };
  } catch {
    return { title: '文章不存在' };
  }
}

export default async function ArticlePage({ params }: Props) {
  // Server-side fetch for initial data
  let article;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/articles/slug/${params.slug}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      notFound();
    }

    article = await res.json();
  } catch {
    notFound();
  }

  return <ArticleContent article={article} />;
}
