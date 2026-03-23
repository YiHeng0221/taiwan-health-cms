/**
 * @fileoverview Contact CTA Section Component
 * 
 * Yellow background section with title, description, email input and button.
 * Matches the mockup "守護健康，從今天開始！" design.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HomeSection, CtaConfig, ContactCtaConfig } from '@taiwan-health/shared-types';

interface Props {
  section: HomeSection;
}

export function CtaSection({ section }: Props) {
  const config = section.config as CtaConfig & ContactCtaConfig;
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(config.buttonLink + (email ? `?email=${encodeURIComponent(email)}` : ''));
  };

  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="bg-brand-yellow rounded-2xl px-6 py-12 md:px-12 md:py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {config.title}
          </h2>
          {config.description && (
            <p className="text-white mb-8 max-w-xl mx-auto">
              {config.description}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={config.emailPlaceholder || '輸入您的 E-mail'}
              className="flex-1 px-4 py-3 rounded-lg border-0 bg-white text-brand-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-brown"
            />
            <button
              type="submit"
              className="bg-brand-dark text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-dark/90 transition-colors whitespace-nowrap"
            >
              {config.buttonText}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
