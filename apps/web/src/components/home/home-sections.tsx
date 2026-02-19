/**
 * @fileoverview Home Sections Component
 * 
 * Renders CMS-driven homepage sections dynamically.
 */

'use client';

import { useHomeSections } from '@/hooks/use-home-sections';
import { HomeSection, HomeSectionType } from '@taiwan-health/shared-types';
import { BannerSection } from './sections/banner-section';
import { CarouselSection } from './sections/carousel-section';
import { ServicesSection } from './sections/services-section';
import { CtaSection } from './sections/cta-section';

// Section component map
const sectionComponents: Record<HomeSectionType, React.ComponentType<{ section: HomeSection }>> = {
  banner: BannerSection,
  carousel: CarouselSection,
  services: ServicesSection,
  cta: CtaSection,
  features: ServicesSection, // Reuse services for features
  testimonials: CtaSection, // Placeholder
};

export function HomeSections() {
  const { data: sections, isLoading, error } = useHomeSections();

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-96 bg-gray-200" />
        <div className="container-custom py-12">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !sections) {
    return (
      <div className="container-custom py-12 text-center">
        <p className="text-red-500">載入頁面時發生錯誤</p>
      </div>
    );
  }

  return (
    <div>
      {sections.map((section) => {
        const Component = sectionComponents[section.type as HomeSectionType];
        if (!Component) return null;
        return <Component key={section.id} section={section} />;
      })}
    </div>
  );
}
