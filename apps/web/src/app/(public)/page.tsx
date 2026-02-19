/**
 * @fileoverview Homepage
 * 
 * CMS-driven homepage with dynamic sections.
 */

import { HomeSections } from '@/components/home/home-sections';

// Force dynamic rendering to fetch fresh data
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return <HomeSections />;
}
