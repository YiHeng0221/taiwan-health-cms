/**
 * @fileoverview Articles List Page (運動專欄)
 * 
 * Public page showing all published articles with pagination.
 * SEO-optimized with metadata.
 */

import type { Metadata } from 'next';
import { ArticleList } from '@/components/articles/article-list';

export const metadata: Metadata = {
  title: '運動專欄',
  description: '探索最新的健康與運動知識，由專業團隊為您精心撰寫的健康文章。',
  openGraph: {
    title: '運動專欄 | 樂頤生健康管理',
    description: '探索最新的健康與運動知識，由專業團隊為您精心撰寫的健康文章。',
  },
};

export default function ArticlesPage() {
  return (
    <div className="container-custom py-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="section-title">運動專欄</h1>
        <p className="section-subtitle max-w-2xl mx-auto">
          探索最新的健康與運動知識，由專業團隊為您精心撰寫的健康文章
        </p>
      </div>

      {/* Article List */}
      <ArticleList />
    </div>
  );
}
