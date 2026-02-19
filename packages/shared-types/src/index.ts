/**
 * @fileoverview Shared types for Taiwan Health Management CMS
 * 
 * This package contains all shared TypeScript types, interfaces, and enums
 * used across both frontend (Next.js) and backend (NestJS) applications.
 * 
 * Architecture Decision:
 * - Centralized types ensure type safety across the entire monorepo
 * - Changes to data structures are reflected in both frontend and backend
 * - Reduces duplication and potential type mismatches
 */

// ============================================================================
// User Types
// ============================================================================

/** User roles for authorization */
export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
}

/** User entity without sensitive data */
export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

/** User with password (internal use only) */
export interface UserWithPassword extends User {
  password: string;
}

// ============================================================================
// Article Types
// ============================================================================

/** Article entity for 運動專欄 (Sports Column) */
export interface Article {
  id: string;
  title: string;
  slug: string;
  /** Tiptap JSON content */
  content: TiptapContent;
  coverImage: string | null;
  isPublished: boolean;
  /** SEO meta description */
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Create article DTO */
export interface CreateArticleDto {
  title: string;
  slug: string;
  content: TiptapContent;
  coverImage?: string;
  metaDescription?: string;
  isPublished?: boolean;
}

/** Update article DTO */
export interface UpdateArticleDto {
  title?: string;
  slug?: string;
  content?: TiptapContent;
  coverImage?: string;
  metaDescription?: string;
  isPublished?: boolean;
}

/** Article list item (lightweight for listing) */
export interface ArticleListItem {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  isPublished: boolean;
  createdAt: Date;
}

// ============================================================================
// Tiptap Content Types
// ============================================================================

/** Tiptap editor JSON structure */
export interface TiptapContent {
  type: 'doc';
  content: TiptapNode[];
}

/** Generic Tiptap node */
export interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: TiptapMark[];
  text?: string;
}

/** Tiptap text mark */
export interface TiptapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

// ============================================================================
// Home Section Types (CMS-driven)
// ============================================================================

/** Home section base structure */
export interface HomeSection {
  id: string;
  type: HomeSectionType;
  config: HomeSectionConfig;
  order: number;
}

/** Supported home section types */
export type HomeSectionType = 
  | 'banner' 
  | 'carousel' 
  | 'features' 
  | 'testimonials' 
  | 'cta' 
  | 'services';

/** Union type for all section configs */
export type HomeSectionConfig = 
  | BannerConfig 
  | CarouselConfig 
  | FeaturesConfig 
  | TestimonialsConfig 
  | CtaConfig 
  | ServicesConfig;

/** Banner section configuration */
export interface BannerConfig {
  title: string;
  subtitle?: string;
  image: string;
  animation: 'fadein' | 'slide' | 'zoom';
  buttonText?: string;
  buttonLink?: string;
}

/** Carousel section configuration */
export interface CarouselConfig {
  items: CarouselItem[];
  autoplay?: boolean;
  interval?: number;
}

export interface CarouselItem {
  title: string;
  url: string;
  image: string;
  description?: string;
}

/** Features section configuration */
export interface FeaturesConfig {
  title: string;
  subtitle?: string;
  items: FeatureItem[];
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

/** Testimonials section configuration */
export interface TestimonialsConfig {
  title: string;
  items: TestimonialItem[];
}

export interface TestimonialItem {
  name: string;
  role: string;
  content: string;
  avatar?: string;
}

/** CTA section configuration */
export interface CtaConfig {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage?: string;
}

/** Services preview section */
export interface ServicesConfig {
  title: string;
  items: ServiceItem[];
}

export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
  link: string;
}

// ============================================================================
// Event Types (活動花絮)
// ============================================================================

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: Date;
  location: string;
  images: string[];
  isPublished: boolean;
  createdAt: Date;
}

// ============================================================================
// Contact Types (聯絡我們)
// ============================================================================

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface CreateContactDto {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// ============================================================================
// API Response Types
// ============================================================================

/** Standard API response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/** Paginated response */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** API error response */
export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

// ============================================================================
// Auth Types
// ============================================================================

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  /** Access token (also set as HttpOnly cookie) */
  accessToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}
