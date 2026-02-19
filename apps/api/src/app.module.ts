/**
 * @fileoverview Root Application Module
 * 
 * Architecture Decisions:
 * 1. ConfigModule at root level for global config access
 * 2. PrismaModule as global module for database access
 * 3. Feature modules separated by domain (articles, auth, home-sections, etc.)
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { HomeSectionsModule } from './modules/home-sections/home-sections.module';
import { EventsModule } from './modules/events/events.module';
import { ContactModule } from './modules/contact/contact.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    // Global configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Database module
    PrismaModule,
    
    // Feature modules
    AuthModule,
    UsersModule,
    ArticlesModule,
    HomeSectionsModule,
    EventsModule,
    ContactModule,
  ],
})
export class AppModule {}
