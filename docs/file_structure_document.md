# Mozzy File Structure Documentation

## Introduction

A well-organized file structure is essential for the development and maintenance of Mozzy. It ensures smooth collaboration among team members, reduces onboarding time for new developers, and minimizes errors during coding and deployment. Given that Mozzy is an AI-powered content transformation platform that helps creators repurpose their content across different formats and platforms, having a clear file structure facilitates the management of these complex functionalities.

## Tech Stack Overview

The tech stack for Mozzy comprises modern technologies designed to provide a robust and scalable platform:

- **Frontend Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with shadcn/UI components
- **State Management**: Zustand for global state
- **Authentication**: Supabase Auth with SSR
- **AI Integration**: Claude AI (Anthropic)
- **Icons**: Lucide Icons
- **Testing**: Jest
- **Logging**: Custom logger implementation

## Root Directory Structure

The root directory contains configuration files and main project directories:

1. **Configuration Files**:

   - `next.config.js` - Next.js configuration
   - `tsconfig.json` - TypeScript configuration
   - `tailwind.config.js` - Tailwind CSS configuration
   - `package.json` - Dependencies and scripts
   - `.env.local` - Environment variables
   - `.cursorrules` - Cursor IDE configuration
   - `middleware.ts` - Auth and routing middleware

2. **Main Directories**:
   - `/app` - Next.js 14 App Router directory
   - `/docs` - Project documentation
   - `/public` - Static assets
   - `/__tests__` - Test files
   - `/lib` - Core library code

## App Directory Structure (Next.js 14 App Router)

The `/app` directory follows Next.js 14 conventions with a feature-based organization:

### Core Directories

- **/actions**

  - Server actions for API integrations
  - Direct communication with external services
  - `auth.ts` - Authentication server actions
  - `posts.ts` - Post management actions
  - `anthropicActions.ts` - AI integration actions
  - `podcastActions.ts` - Podcast feature actions

- **/api**

  - API route handlers
  - RESTful endpoints
  - Auth-related endpoints

- **/components**

  - `/blocks` - Content block components
  - `/ui` - shadcn/UI components
  - Reusable UI components

- **/config**

  - Application configuration
  - Environment-specific settings

- **/constants**

  - Shared constants and enums
  - Configuration values

- **/hooks**

  - Custom React hooks
  - Shared state logic
  - Authentication hooks

- **/services**

  - Business logic services
  - External service integrations

- **/stores**

  - Zustand store definitions
  - Global state management

- **/types**

  - TypeScript type definitions
  - Shared interfaces
  - Supabase type definitions

- **/utils**
  - Utility functions
  - Helper methods

## Library Directory Structure (/lib)

The `/lib` directory contains core functionality:

- **/supabase**

  - `server.ts` - Server-side Supabase client
  - Authentication utilities
  - Session management

- **/logger**
  - Centralized logging system
  - Error tracking
  - Debug utilities

### Feature Directories

- **/dashboard**

  - Dashboard-specific pages
  - Dashboard components
  - Protected routes

- **/templates**

  - Content templates
  - Template management

- **/auth**
  - Authentication pages
  - Login/signup flows
  - Password reset

### Supporting Directories

- **/prompts**

  - AI prompt templates
  - Claude AI integration

- **/providers**

  - React context providers
  - Global providers
  - Auth providers

- **/schemas**
  - Data validation schemas
  - Type definitions

## Documentation Structure

The `/docs` directory contains:

- `plan.md` - Main project plan and task tracking
- `plan-podcast.md` - Podcast feature specific planning
- `file_structure_document.md` - This documentation
- `/composer-history` - Task execution history

## Authentication Structure

Authentication is implemented across several key areas:

1. **Server Actions** (`/app/actions/auth.ts`):

   - `signIn` - User authentication
   - `signOut` - Session termination
   - `getUser` - User data retrieval
   - `getSession` - Session management
   - `hasRole` - Role-based access control

2. **Middleware** (`middleware.ts`):

   - Route protection
   - Session validation
   - Cookie management
   - Error handling

3. **Supabase Integration** (`/lib/supabase/server.ts`):
   - Client creation
   - Session utilities
   - Cookie handling
   - Error management

## Best Practices

1. **Component Organization**:

   - Place components in feature-specific directories
   - Use index.ts files for clean exports
   - Keep components small and focused

2. **State Management**:

   - Use Zustand for global state
   - Implement hooks for component state
   - Leverage server components for data fetching

3. **File Naming**:

   - Use kebab-case for files
   - Use PascalCase for components
   - Use camelCase for functions and variables

4. **Code Organization**:

   - Group related functionality
   - Maintain clear separation of concerns
   - Follow Next.js 14 conventions

5. **Authentication Best Practices**:

   - Use server actions for auth operations
   - Implement proper error handling
   - Add comprehensive logging
   - Maintain session security
   - Use role-based access control

## Conclusion

Mozzy's file structure is designed to support scalable development with Next.js 14's App Router architecture. The organization emphasizes modularity, maintainability, and clear separation of concerns. This structure supports the platform's AI-powered content transformation capabilities while maintaining a clean and efficient development environment.
