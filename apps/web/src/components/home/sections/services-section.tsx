/**
 * @fileoverview Services Section Component
 * 
 * Image cards with title and arrow, matching the mockup design.
 */

import Image from 'next/image';
import Link from 'next/link';
import { HomeSection, ServicesConfig } from '@taiwan-health/shared-types';
import { ArrowRight } from 'lucide-react';

interface Props {
  section: HomeSection;
}

export function ServicesSection({ section }: Props) {
  const config = section.config as ServicesConfig;

  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-2xl font-bold text-brand-brown">{config.title}</h2>
          <span className="inline-block w-8 h-1 bg-brand-yellow rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {config.items.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-brand-brown/10 flex items-center justify-center">
                    <span className="text-brand-brown/30 text-4xl">📷</span>
                  </div>
                )}
              </div>

              {/* Title + Arrow */}
              <div className="p-4 flex items-center justify-between">
                <h3 className="font-semibold text-brand-dark">{item.title}</h3>
                <ArrowRight className="h-5 w-5 text-brand-brown group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
