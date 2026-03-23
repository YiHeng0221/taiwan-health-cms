/**
 * @fileoverview Banner Section Component
 * 
 * Split layout with entrance animation: left text + right image on cream background.
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HomeSection, BannerConfig } from '@taiwan-health/shared-types';

interface Props {
  section: HomeSection;
}

const animationClasses: Record<string, { hidden: string; visible: string }> = {
  fadein: {
    hidden: 'opacity-0 translate-y-6',
    visible: 'opacity-100 translate-y-0',
  },
  slide: {
    hidden: 'opacity-0 -translate-x-12',
    visible: 'opacity-100 translate-x-0',
  },
  zoom: {
    hidden: 'opacity-0 scale-90',
    visible: 'opacity-100 scale-100',
  },
};

export function BannerSection({ section }: Props) {
  const config = section.config as BannerConfig;
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const anim = animationClasses[config.animation] ?? animationClasses.fadein;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-brand-cream">
      <div className="container-custom py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4 md:gap-6 items-center">
          {/* Left: Text Content */}
          <div
            className={`order-2 md:order-1 transition-all duration-700 ease-out ${visible ? anim.visible : anim.hidden
              }`}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-brown mb-2 leading-tight">
              {config.title}
            </h1>
            {config.subtitle && (
              <p className="text-base md:text-lg text-brand-brown/60 tracking-wider mb-10">
                {config.subtitle}
              </p>
            )}
            {config.buttonText && config.buttonLink && (
              <Link
                href={config.buttonLink}
                className="inline-block bg-brand-brown text-brand-cream px-8 py-3 rounded-lg font-semibold hover:bg-brand-brown/90 transition-colors"
              >
                {config.buttonText}
              </Link>
            )}
          </div>

          {/* Right: Image — larger, closer to text */}
          <div
            className={`order-1 md:order-2 flex justify-end transition-all duration-700 delay-200 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
          >
            {config.image ? (
              <div className="relative w-full md:max-w-lg">
                <Image
                  src={config.image}
                  alt={config.title}
                  width={600}
                  height={600}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
            ) : (
              <div className="w-full aspect-[4/3] rounded-2xl bg-brand-brown/10" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
