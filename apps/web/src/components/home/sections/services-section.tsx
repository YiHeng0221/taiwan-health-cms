/**
 * @fileoverview Services Section Component
 */

import Link from 'next/link';
import { HomeSection, ServicesConfig } from '@taiwan-health/shared-types';
import { Heart, Activity, Leaf, Users, Dumbbell, Stethoscope } from 'lucide-react';

interface Props {
  section: HomeSection;
}

// Icon map
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  heart: Heart,
  activity: Activity,
  leaf: Leaf,
  users: Users,
  dumbbell: Dumbbell,
  stethoscope: Stethoscope,
};

export function ServicesSection({ section }: Props) {
  const config = section.config as ServicesConfig;

  return (
    <section className="py-16">
      <div className="container-custom">
        <h2 className="section-title text-center">{config.title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {config.items.map((item, index) => {
            const Icon = iconMap[item.icon] || Heart;

            return (
              <Link
                key={index}
                href={item.link}
                className="card p-6 hover:shadow-lg transition-shadow group"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-600 transition-colors">
                  <Icon className="h-7 w-7 text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
