/**
 * @fileoverview Root Application Module
 *
 * Architecture Decisions:
 * 1. ConfigModule at root level for global config access
 * 2. PrismaModule as global module for database access
 * 3. Feature modules separated by domain (articles, auth, home-sections, etc.)
 * 4. Global JwtAuthGuard: all routes require auth by default, use @Public() to opt out
 * 5. Global ThrottlerGuard: rate limiting on all endpoints (60 req/min default)
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { HomeSectionsModule } from './modules/home-sections/home-sections.module';
import { EventsModule } from './modules/events/events.module';
import { ContactModule } from './modules/contact/contact.module';
import { UsersModule } from './modules/users/users.module';
import { UploadModule } from './modules/upload/upload.module';
import { ServicesModule } from './modules/services/services.module';
import { SettingsModule } from './modules/settings/settings.module';
import { FaqModule } from './modules/faq/faq.module';
import { TagsModule } from './modules/tags/tags.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

@Module({
  imports: [
    // Global configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting: 60 requests per minute by default
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 60,
    }]),

    // Database module
    PrismaModule,

    // Feature modules
    AuthModule,
    UsersModule,
    ArticlesModule,
    HomeSectionsModule,
    EventsModule,
    ContactModule,
    UploadModule,
    ServicesModule,
    SettingsModule,
    FaqModule,
    TagsModule,
  ],
  providers: [
    // Global JWT auth guard: all routes require authentication by default
    // Use @Public() decorator to make specific routes public
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Global rate limiting guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
