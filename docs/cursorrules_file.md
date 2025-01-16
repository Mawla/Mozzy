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

## Development Prompt

### Key Requirements

1. Do not delete existing functionality unless necessary for the current task
2. Use App Router: All components within `app` directory
3. Implement Server Components by default
4. Use modern TypeScript syntax
5. Follow responsive design principles with Tailwind CSS
6. Create modular, reusable components
7. Implement efficient data fetching with server components
8. Use Next.js 14's metadata API for SEO
9. Use Next.js Image component
10. Ensure accessibility with ARIA attributes
11. Implement error handling with error.tsx
12. Use loading.tsx for loading states
13. Use route handlers (route.ts) for API routes
14. Implement SSG/SSR appropriately
15. Focus only on task-related changes

### Component Structure

1. Client Components:

```tsx
"use client";

const ComponentName = () => {
  // Component logic
};
```

2. Props Interface:

```tsx
interface ComponentNameProps {
  // Props definition
}

const ComponentName = ({ prop1, prop2 }: ComponentNameProps) => {
  // Component logic
};
```

3. Named Exports:

```tsx
export const ComponentName = () => {
  // Component logic
};
```

4. Page Components:

```tsx
const Page = () => {
  // Page logic
};

export default Page;
```

### Data Fetching

1. Server Components:

```tsx
async function getData() {
  const res = await fetch("https://api.example.com/data", {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
}

export default async function Page() {
  const data = await getData();
  // Render with data
}
```

2. Metadata:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Title",
  description: "Page description",
};
```

### Error Handling

```tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

### Development Process

1. Always check `docs/plan.md` and `docs/plan-podcast.md` for current state
2. Output plan updates before starting work
3. Reference plan number in communications
4. Add new tasks to plan instead of suggesting next steps
5. Use git commit command format: `git add . && git commit -m "type(scope): description" && git push`

### Self-Improvement and Documentation Maintenance

1. Documentation Updates:

   - Update cursorrules_file.md when new patterns or best practices emerge
   - Add solutions for recurring issues to prevent future occurrences
   - Document any workarounds or fixes that could benefit future development
   - Keep code examples current with latest implementations

2. Plan Maintenance:

   - Regularly review and update plan files
   - Mark completed tasks with completion dates
   - Add new tasks discovered during development
   - Update task descriptions with learned insights
   - Remove or archive obsolete tasks
   - Add notes about successful approaches or pitfalls to avoid

3. Knowledge Capture:

   - Document common errors and their solutions
   - Add new TypeScript patterns that prove effective
   - Update component examples with real-world usage
   - Document performance improvements and their impact
   - Add notes about API integration learnings

4. Continuous Improvement:

   - Review and update directory structure as it evolves
   - Keep tech stack information current
   - Update setup instructions based on new requirements
   - Add new testing strategies that prove effective
   - Document new security considerations

5. Issue Prevention:
   - Document type-checking patterns that prevent bugs
   - Add validation patterns that catch common errors
   - Document state management patterns that work well
   - Add notes about component optimization techniques
   - Document successful error handling strategies

### Best Practices

1. Use TypeScript for type safety
2. Use Tailwind CSS exclusively for styling
3. Implement functional components with hooks
4. Add clear comments for complex logic
5. Follow Next.js 14 file structure
6. Use environment variables appropriately
7. Optimize for performance
8. Ensure accessibility
9. Use shadcn/UI components from `/app/components/ui`
10. Let TypeScript infer types when possible

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
