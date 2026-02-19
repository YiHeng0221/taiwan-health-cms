/**
 * @fileoverview CTA Section Component
 */

import Link from 'next/link';
import Image from 'next/image';
import { HomeSection, CtaConfig } from '@taiwan-health/shared-types';

interface Props {
  section: HomeSection;
}

export function CtaSection({ section }: Props) {
  const config = section.config as CtaConfig;

  return (
    <section className="relative py-20">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {config.backgroundImage ? (
          <>
            <Image
              src={config.backgroundImage}
              alt=""
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-primary-900/80" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800" />
        )}
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{config.title}</h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
          {config.description}
        </p>
        <Link
          href={config.buttonLink}
          className="inline-flex items-center justify-center bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          {config.buttonText}
        </Link>
      </div>
    </section>
  );
}
