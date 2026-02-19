/**
 * @fileoverview Carousel Section Component
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HomeSection, CarouselConfig } from '@taiwan-health/shared-types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  section: HomeSection;
}

export function CarouselSection({ section }: Props) {
  const config = section.config as CarouselConfig;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play
  useEffect(() => {
    if (!config.autoplay || config.items.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % config.items.length);
    }, config.interval || 5000);

    return () => clearInterval(interval);
  }, [config.autoplay, config.interval, config.items.length]);

  const goTo = (index: number) => {
    setCurrentIndex(index);
  };

  const goPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? config.items.length - 1 : prev - 1
    );
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % config.items.length);
  };

  if (config.items.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50">
      <div className="container-custom">
        <div className="relative">
          {/* Slides */}
          <div className="overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {config.items.map((item, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <Link href={item.url} className="block relative h-80 group">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                      {item.description && (
                        <p className="text-white/80">{item.description}</p>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {config.items.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Dots */}
          {config.items.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {config.items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goTo(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex
                      ? 'bg-primary-600'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
