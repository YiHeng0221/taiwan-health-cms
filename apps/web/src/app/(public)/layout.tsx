/**
 * @fileoverview Public Layout with Header and Footer
 * 
 * Layout for public-facing pages (non-admin).
 * Implements clean Header - Content - Footer structure.
 */

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LineFloatButton } from '@/components/layout/line-float-button';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <LineFloatButton />
    </div>
  );
}
