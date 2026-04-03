/**
 * @fileoverview Article Detail Page
 * 
 * Dynamic route for individual article pages.
 * SEO-optimized with dynamic metadata.
 */

import { cache } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleContent } from '@/components/articles/article-content';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.leyisheng.com';

interface Props {
  params: { slug: string };
}

const getArticle = cache(async (slug: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/articles/slug/${slug}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) return null;
  return res.json();
});

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle(params.slug);

  if (!article) {
    return { title: '文章不存在' };
  }

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
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: '首頁', url: SITE_URL },
          { name: '運動專欄', url: `${SITE_URL}/articles` },
          { name: article.title, url: `${SITE_URL}/articles/${article.slug}` },
        ]}
      />
      <ArticleJsonLd
        title={article.title}
        description={article.metaDescription}
        datePublished={article.createdAt}
        dateModified={article.updatedAt}
        image={article.coverImage}
        url={`${SITE_URL}/articles/${article.slug}`}
      />
      <ArticleContent article={article} />
    </>
  );
}
