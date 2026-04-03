/**
 * @fileoverview Icon picker options and helper for About page sections
 */

import {
  Heart,
  Award,
  Target,
  Users,
  Star,
  Shield,
  Zap,
  Lightbulb,
  Globe,
  Clock,
  ThumbsUp,
  Activity,
  Leaf,
  Sun,
  Smile,
  Eye,
  BookOpen,
  Compass,
  Gem,
  HandHeart,
  type LucideIcon,
} from 'lucide-react';

export const ICON_OPTIONS = [
  { value: 'heart', label: '❤ 愛心' },
  { value: 'award', label: '🏆 獎章' },
  { value: 'target', label: '🎯 目標' },
  { value: 'users', label: '👥 團隊' },
  { value: 'star', label: '⭐ 星星' },
  { value: 'shield', label: '🛡 盾牌' },
  { value: 'zap', label: '⚡ 閃電' },
  { value: 'lightbulb', label: '💡 燈泡' },
  { value: 'globe', label: '🌐 地球' },
  { value: 'clock', label: '⏰ 時鐘' },
  { value: 'thumbs-up', label: '👍 讚' },
  { value: 'activity', label: '📈 活動' },
  { value: 'leaf', label: '🍃 葉子' },
  { value: 'sun', label: '☀ 太陽' },
  { value: 'smile', label: '😊 微笑' },
  { value: 'eye', label: '👁 眼睛' },
  { value: 'book-open', label: '📖 書本' },
  { value: 'compass', label: '🧭 指南針' },
  { value: 'gem', label: '💎 寶石' },
  { value: 'hand-heart', label: '🤲 關懷' },
];

const iconMap: Record<string, LucideIcon> = {
  heart: Heart,
  award: Award,
  target: Target,
  users: Users,
  star: Star,
  shield: Shield,
  zap: Zap,
  lightbulb: Lightbulb,
  globe: Globe,
  clock: Clock,
  'thumbs-up': ThumbsUp,
  activity: Activity,
  leaf: Leaf,
  sun: Sun,
  smile: Smile,
  eye: Eye,
  'book-open': BookOpen,
  compass: Compass,
  gem: Gem,
  'hand-heart': HandHeart,
};

/** Get Lucide icon component by name string */
export function getIcon(name: string): LucideIcon {
  return iconMap[name] || Star;
}
