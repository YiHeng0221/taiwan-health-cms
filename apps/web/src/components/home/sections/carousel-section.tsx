/**
 * @fileoverview Carousel Section Component
 *
 * Generic carousel used for 活動花絮, 合作經驗, etc.
 * Infinite loop with center active item. Following embla-carousel demo pattern.
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { HomeSection, CarouselConfig } from '@taiwan-health/shared-types';

interface Props {
  section: HomeSection;
}

export function CarouselSection({ section }: Props) {
  const config = section.config as CarouselConfig;

  const autoplayRef = useRef(
    Autoplay({ delay: config.interval || 5000, stopOnInteraction: false }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    config.autoplay ? [autoplayRef.current] : [],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      onSelect();
    });
    onSelect();
  }, [emblaApi, onSelect]);

  if (config.items.length === 0) return null;

  const currentItem = config.items[selectedIndex];

  return (
    <section className="py-16">
      <div className="container-custom">
        {/* Section Title */}
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-2xl font-bold text-brand-brown">{config.title}</h2>
          <span className="inline-block w-8 h-1 bg-brand-yellow rounded-full" />
        </div>
      </div>

      {/* Embla — follows demo structure exactly */}
      <div className="embla">
        <div className="embla__viewport overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex">
            {config.items.map((item, index) => (
              <div
                key={index}
                className="embla__slide embla__slide--responsive"
                style={{
                  minWidth: 0,
                  paddingLeft: '1rem',
                }}
              >
                {/* Inner content — scale/opacity here, not on slide itself */}
                <div
                  className="transition-[transform,opacity] duration-300 origin-center"
                  style={{
                    transform: index === selectedIndex ? 'scale(1)' : 'scale(0.88)',
                    opacity: index === selectedIndex ? 1 : 0.4,
                  }}
                >
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title || config.title}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-brand-brown/10 rounded-2xl" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="container-custom">
          {/* Item title (if present) */}
          {currentItem?.title && (
            <p className="text-center text-brand-dark mt-6 text-sm md:text-base leading-relaxed">
              {currentItem.title}
            </p>
          )}

          {/* Dots */}
          {scrollSnaps.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => onDotButtonClick(index)}
                  aria-label={`前往第 ${index + 1} 張`}
                  className={`w-3 h-3 rounded-full transition-colors ${index === selectedIndex
                    ? 'bg-brand-dark'
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
