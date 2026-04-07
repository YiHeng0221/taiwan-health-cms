/**
 * @fileoverview Carousel Section Component
 *
 * Generic carousel used for 活動花絮, 合作經驗, etc.
 * Infinite loop with center active item. Following embla-carousel demo pattern.
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { HomeSection, CarouselConfig, CarouselItem } from '@taiwan-health/shared-types';

function SlideContent({ item, title }: { item: CarouselItem; title: string }) {
  const inner = (
    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
      {item.image ? (
        <Image
          src={item.image}
          alt={item.title || title}
          fill
          className="object-contain"
        />
      ) : (
        <div className="w-full h-full bg-brand-brown/10 rounded-2xl" />
      )}
    </div>
  );

  if (item.url) {
    return (
      <Link href={item.url} className="block cursor-pointer">
        {inner}
      </Link>
    );
  }

  return inner;
}

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

  const isSingle = config.items.length === 1;

  // Embla loop mode needs enough slides to fill the viewport.
  // With 50% slide width, 2 slides aren't enough — duplicate them.
  const displayItems =
    config.items.length === 2
      ? [...config.items, ...config.items]
      : config.items;
  const realCount = config.items.length;
  const realIndex = isSingle ? 0 : selectedIndex % realCount;
  const currentItem = config.items[realIndex];

  return (
    <section className="py-16">
      <div className="container-custom">
        {/* Section Title */}
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-2xl font-bold text-brand-brown">{config.title}</h2>
          <span className="inline-block w-8 h-1 bg-brand-yellow rounded-full" />
        </div>
      </div>

      {isSingle ? (
        /* Single item — centered, no carousel */
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <SlideContent item={config.items[0]} title={config.title} />
          </div>
          {config.items[0].title && (
            <p className="text-center text-brand-dark mt-6 text-sm md:text-base leading-relaxed">
              {config.items[0].url ? (
                <Link href={config.items[0].url} className="hover:text-brand-yellow transition-colors underline underline-offset-4">
                  {config.items[0].title}
                </Link>
              ) : (
                config.items[0].title
              )}
            </p>
          )}
        </div>
      ) : (
        /* Multiple items — embla carousel */
        <div className="embla">
          <div className="embla__viewport overflow-hidden" ref={emblaRef}>
            <div className="embla__container flex">
              {displayItems.map((item, index) => (
                <div
                  key={index}
                  className="embla__slide embla__slide--responsive"
                  style={{
                    minWidth: 0,
                    paddingLeft: '1rem',
                  }}
                >
                  <div
                    className="transition-[transform,opacity] duration-300 origin-center"
                    style={{
                      transform: index === selectedIndex ? 'scale(1)' : 'scale(0.88)',
                      opacity: index === selectedIndex ? 1 : 0.4,
                    }}
                  >
                    <SlideContent item={item} title={config.title} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="container-custom">
            {/* Item title (if present) */}
            {currentItem?.title && (
              <p className="text-center text-brand-dark mt-6 text-sm md:text-base leading-relaxed">
                {currentItem.url ? (
                  <Link href={currentItem.url} className="hover:text-brand-yellow transition-colors underline underline-offset-4">
                    {currentItem.title}
                  </Link>
                ) : (
                  currentItem.title
                )}
              </p>
            )}

            {/* Dots — show only real item count */}
            {realCount > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: realCount }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => onDotButtonClick(index)}
                    aria-label={`前往第 ${index + 1} 張`}
                    className={`w-3 h-3 rounded-full transition-colors ${index === realIndex
                      ? 'bg-brand-dark'
                      : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
