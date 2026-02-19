/**
 * @fileoverview Article Content Component
 * 
 * Renders article detail with Tiptap JSON content.
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Article, TiptapNode } from '@taiwan-health/shared-types';
import { formatDate } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';

interface Props {
  article: Article;
}

/**
 * Render Tiptap JSON content to React elements
 */
function renderContent(nodes: TiptapNode[]): React.ReactNode {
  return nodes.map((node, index) => {
    const key = `${node.type}-${index}`;

    switch (node.type) {
      case 'heading': {
        const level = node.attrs?.level || 2;
        const Tag = `h${level}` as keyof JSX.IntrinsicElements;
        const className = {
          1: 'text-3xl font-bold mb-4',
          2: 'text-2xl font-bold mb-3 mt-6',
          3: 'text-xl font-semibold mb-2 mt-4',
        }[level as 1 | 2 | 3] || 'text-lg font-semibold mb-2';
        
        return (
          <Tag key={key} className={className}>
            {node.content && renderContent(node.content)}
          </Tag>
        );
      }

      case 'paragraph':
        return (
          <p key={key} className="mb-4 leading-relaxed text-gray-700">
            {node.content ? renderContent(node.content) : null}
          </p>
        );

      case 'text': {
        let text: React.ReactNode = node.text;
        
        // Apply marks (bold, italic, link, etc.)
        if (node.marks) {
          node.marks.forEach((mark) => {
            switch (mark.type) {
              case 'bold':
                text = <strong key={mark.type}>{text}</strong>;
                break;
              case 'italic':
                text = <em key={mark.type}>{text}</em>;
                break;
              case 'link':
                text = (
                  <a
                    key={mark.type}
                    href={mark.attrs?.href as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline"
                  >
                    {text}
                  </a>
                );
                break;
            }
          });
        }
        
        return <span key={key}>{text}</span>;
      }

      case 'bulletList':
        return (
          <ul key={key} className="list-disc pl-6 mb-4 space-y-1">
            {node.content && renderContent(node.content)}
          </ul>
        );

      case 'orderedList':
        return (
          <ol key={key} className="list-decimal pl-6 mb-4 space-y-1">
            {node.content && renderContent(node.content)}
          </ol>
        );

      case 'listItem':
        return (
          <li key={key} className="text-gray-700">
            {node.content && renderContent(node.content)}
          </li>
        );

      case 'blockquote':
        return (
          <blockquote
            key={key}
            className="border-l-4 border-primary-500 pl-4 my-4 italic text-gray-600"
          >
            {node.content && renderContent(node.content)}
          </blockquote>
        );

      case 'image':
        return (
          <figure key={key} className="my-6">
            <Image
              src={node.attrs?.src as string}
              alt={(node.attrs?.alt as string) || ''}
              width={800}
              height={450}
              className="rounded-lg w-full h-auto"
            />
            {node.attrs?.title && (
              <figcaption className="text-center text-sm text-gray-500 mt-2">
                {node.attrs.title as string}
              </figcaption>
            )}
          </figure>
        );

      case 'horizontalRule':
        return <hr key={key} className="my-6 border-gray-200" />;

      default:
        return null;
    }
  });
}

export function ArticleContent({ article }: Props) {
  return (
    <article className="container-custom py-12">
      {/* Back Link */}
      <Link
        href="/articles"
        className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        返回文章列表
      </Link>

      {/* Article Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>
        <p className="text-gray-500">{formatDate(article.createdAt)}</p>
      </header>

      {/* Cover Image */}
      {article.coverImage && (
        <div className="relative h-96 mb-8 rounded-xl overflow-hidden">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        {article.content?.content && renderContent(article.content.content)}
      </div>

      {/* Share / CTA */}
      <div className="mt-12 pt-8 border-t">
        <div className="text-center">
          <p className="text-gray-600 mb-4">喜歡這篇文章嗎？</p>
          <Link href="/contact" className="btn-primary">
            聯絡我們了解更多
          </Link>
        </div>
      </div>
    </article>
  );
}
