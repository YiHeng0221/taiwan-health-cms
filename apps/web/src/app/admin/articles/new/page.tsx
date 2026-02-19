/**
 * @fileoverview New Article Page
 */

import type { Metadata } from 'next';
import { ArticleEditor } from '@/components/admin/article-editor';

export const metadata: Metadata = {
  title: '新增文章',
};

export default function NewArticlePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">新增文章</h1>
      <ArticleEditor />
    </div>
  );
}
