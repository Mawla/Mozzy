markdown

# Mozzy Project Structure

## Project Overview

- **Project Name:** Mozzy
- **Description:** Mozzy is an AI-powered content transformation platform that helps creators repurpose their content across different formats and platforms.
- **Tech Stack:**
  - Frontend: Next.js 14, TypeScript, Tailwind CSS, shadcn/UI
  - AI Integration: Claude AI (Anthropic)
  - State Management: Zustand
  - Icons: Lucide Icons
  - Testing: Jest

## Project State Tracking

The project's progress and state are tracked in two main files:

### /docs/plan.md

- Contains the main project plan
- Lists completed and pending tasks
- Tracks feature implementations
- Records technical debt and improvements

### /docs/plan-podcast.md

- Specific to podcast processing features
- Details podcast-related implementations
- Tracks podcast feature progress
- Contains podcast processing architecture

These files serve as the source of truth for the project's current state and should be consulted before beginning any new work.

## Directory Structure

### Root Directory

- Configuration files (next.config.js, tsconfig.json, etc.)
- Package management (package.json, package-lock.json)
- Environment configuration (.env.local)
- Documentation (README.md, docs/)

### /app (Next.js 14 App Router)

- **/actions:** Server actions for API integrations
- **/api:** API route handlers
- **/components:** Reusable UI components
  - /blocks: Content block components
  - /ui: shadcn/UI components
- **/config:** Application configuration
- **/constants:** Shared constants and enums
- **/core:** Core application logic
- **/dashboard:** Dashboard pages and components
- **/helpers:** Utility helper functions
- **/hooks:** Custom React hooks
- **/lib:** Shared libraries and utilities
- **/prompts:** AI prompt templates
- **/providers:** React context providers
- **/schemas:** Data validation schemas
- **/services:** Business logic services
- **/settings:** Application settings
- **/store:** Global state management
- **/stores:** Zustand stores
- **/styles:** Global styles and Tailwind configuration
- **/templates:** Content templates
- **/test:** Test utilities and mocks
- **/types:** TypeScript type definitions
- **/utils:** Utility functions
- **/workers:** Web workers and background processes

### /public

- Static assets (images, fonts, etc.)

### /docs

- Project documentation
- Architecture diagrams
- Guidelines and standards

### /**tests**

- Test files and test utilities

## Development Guidelines

### Code Organization

- Use Next.js 14 App Router conventions
- Implement server components by default
- Use client components only when necessary
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Leverage shadcn/UI components

### State Management

- Use Zustand for global state
- Implement React hooks for component state
- Use server components for data fetching

### Testing

- Write unit tests using Jest
- Test components in isolation
- Mock external dependencies

### AI Integration

- Use Anthropic's Claude AI for content processing
- Implement proper error handling for AI responses
- Cache AI results when appropriate

### Performance

- Optimize images using Next.js Image component
- Implement proper loading states
- Use proper caching strategies
- Optimize API calls and data fetching

### Security

- Follow security best practices
- Implement proper error handling
- Validate user input
- Protect sensitive data

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run development server: `npm run dev`
5. Run tests: `npm test`

## Additional Resources

- Next.js Documentation
- Tailwind CSS Documentation
- shadcn/UI Documentation
- TypeScript Documentation
- Claude AI Documentation
