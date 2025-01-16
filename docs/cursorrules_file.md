markdown

Cursor Rules for Project

# Project Overview

*   **Project Name:** PodcastFlow Pro

*   **Description:** PodcastFlow Pro is designed to transform audio recordings into engaging web content, providing podcasters with tools for transcript processing, theme extraction, and visual storytelling.

*   **Tech Stack:** Frontend built with Next.js, TypeScript, Tailwind CSS, shadcn/UI, Radix UI, Lucide Icons. Backend with Supabase for database, authentication, and storage. AI integrates with Claude AI and GPT-4.

*   **Key Features:**

    *   Secure user accounts with roles (Admin & Creator)
    *   Episode processing and visualization tools
    *   Integration with third-party platforms
    *   AI-driven recommendations and insights
    *   Flexibility in content layout and design

# Project Structure

## Root Directory:

*   Contains: Main configuration files, README, and license documents.

## /frontend:

*   Purpose: Houses the frontend codebase, structured for visual and interactive elements of PodcastFlow Pro.

    *   **/components:**

        *   AuthComponents (e.g., Login, Signup)
        *   EpisodeVisualization (e.g., InteractiveCharts, Infographics)
        *   Layouts (e.g., DashboardLayout, EpisodePageLayout)

    *   **/assets:**

        *   Icons and images specific to PodcastFlow Pro branding
        *   Diagram resources for interactive content

    *   **/styles:**

        *   Tailwind CSS setup and specific styling files
        *   Theme customizations

## /backend:

*   Purpose: Contains backend logic, including API endpoints and database interaction layers.

    *   **/controllers:**

        *   UserController (Handles user management and authentication)
        *   EpisodeController (Manages CRUD operations for episodic content)

    *   **/models:**

        *   UserModel
        *   EpisodeModel
        *   TranscriptModel

    *   **/routes:**

        *   /api/auth (User authentication routes)
        *   /api/episodes (Episode management routes)

    *   **/config:**

        *   Environment setup, database connection configuration

## /tests:

*   Purpose: To ensure the integrity and functionality of the codebase through comprehensive testing.

    *   Unit tests and integration tests for both frontend and backend modules

# Development Guidelines

*   **Coding Standards:**

    *   Follow TypeScript best practices with strict typing.
    *   Use Tailwind CSS for all styling with preference to shadcn/UI component library.

*   **Component Organization:**

    *   Components should be modular with high reusability.
    *   Use Radix UI for baseline accessible components, modifying with Tailwind where necessary.

# Cursor IDE Integration

*   **Setup Instructions:**

    *   Clone the project repository
    *   Install dependencies using `npm install`
    *   Set up environment variables as prescribed in `/config`

*   **Key Commands:**

    *   `npm start` for local development
    *   `npm test` for running test suites

# Additional Context

*   **User Roles:**

    *   Admins: Comprehensive system management capabilities
    *   Creators: Content creation and modification permissions

*   **Accessibility Considerations:**

    *   Ensure all text elements support screen readers
    *   Keyboard navigability and ARIA labels for interactives
