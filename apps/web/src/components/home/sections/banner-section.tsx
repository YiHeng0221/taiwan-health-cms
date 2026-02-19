/**
 * @fileoverview Banner Section Component
 */

import Image from 'next/image';
import Link from 'next/link';
import { HomeSection, BannerConfig } from '@taiwan-health/shared-types';
import { cn } from '@/lib/utils';

interface Props {
  section: HomeSection;
}

export function BannerSection({ section }: Props) {
  const config = section.config as BannerConfig;

  const animationClass = {
    fadein: 'animate-fade-in',
    slide: 'animate-slide-in',
    zoom: 'animate-zoom-in',
  }[config.animation] || '';

  return (
    <section className="relative h-[600px] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {config.image ? (
          <Image
            src={config.image}
            alt={config.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-600 to-secondary-600" />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className={cn('container-custom relative z-10 text-white', animationClass)}>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 max-w-2xl">
          {config.title}
        </h1>
        {config.subtitle && (
          <p className="text-xl md:text-2xl mb-8 max-w-xl opacity-90">
            {config.subtitle}
          </p>
        )}
        {config.buttonText && config.buttonLink && (
          <Link href={config.buttonLink} className="btn-primary text-lg">
            {config.buttonText}
          </Link>
        )}
      </div>
    </section>
  );
}
