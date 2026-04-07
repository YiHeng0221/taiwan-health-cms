'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useArticles } from '@/hooks/use-articles';
import { useTags, Tag } from '@/hooks/use-tags';
import { formatDate } from '@/lib/utils';
import { Search, ChevronLeft, ChevronRight, X } from 'lucide-react';

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function ArticleList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedTagId, setSelectedTagId] = useState<string | undefined>();
  const debouncedSearch = useDebouncedValue(search, 400);
  const pageSize = 9;

  const { data: tags } = useTags();
  const { data, isLoading, error } = useArticles({
    page,
    pageSize,
    search: debouncedSearch || undefined,
    tagId: selectedTagId,
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedTagId]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-48 bg-gray-200" />
            <div className="p-6 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">載入文章時發生錯誤，請稍後再試。</p>
      </div>
    );
  }

  const { items: articles = [], totalPages = 0 } = data || {};

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-6 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜尋文章..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Tag Filter */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-8 justify-center">
          <button
            onClick={() => setSelectedTagId(undefined)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !selectedTagId
                ? 'bg-brand-yellow text-brand-dark'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          {tags.map((tag: Tag) => (
            <button
              key={tag.id}
              onClick={() =>
                setSelectedTagId(selectedTagId === tag.id ? undefined : tag.id)
              }
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedTagId === tag.id
                  ? 'bg-brand-yellow text-brand-dark'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}

      {/* Articles Grid */}
      {articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {search || selectedTagId ? '找不到相關文章' : '目前沒有文章'}
          </p>
          {selectedTagId && (
            <button
              onClick={() => setSelectedTagId(undefined)}
              className="mt-3 text-sm text-brand-yellow hover:underline inline-flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              清除篩選
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link key={article.id} href={`/articles/${article.slug}`}>
              <article className="card group hover:shadow-lg transition-shadow h-full flex flex-col">
                <div className="relative h-48 bg-gray-100 shrink-0">
                  {article.coverImage ? (
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <span>無圖片</span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  {/* Tags */}
                  {(article as any).tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {(article as any).tags.map((at: any) => (
                        <span
                          key={at.tag?.id || at.tagId}
                          className="text-xs bg-brand-yellow/10 text-brand-dark px-2 py-0.5 rounded-full"
                        >
                          {at.tag?.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-brand-yellow transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-auto">
                    {formatDate(article.createdAt)}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-gray-600">
            第 {page} / {totalPages} 頁
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
