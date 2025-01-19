# Core Processing Feature

## Overview

The Core Processing feature is a shared module that handles content transformation across different features in Mozzy. It provides a unified approach to processing various content types (podcasts, posts, etc.) into structured, visual experiences.

## Status

- Current State: Migration Planned
- Migration Task: [core-processing-migration-20240320]
- Current Location: `/app/core/processing`
- Target Location: `/app/features/core-processing`

## Purpose and Goals

- Provide unified content processing capabilities
- Enable content transformation across features
- Maintain consistent processing patterns
- Reduce code duplication
- Enable feature-specific adaptations

## Key Functionalities

- Content analysis
- Structure extraction
- Format transformation
- Template application
- Visual content generation

## Dependencies

- Text processing services
- Media transformation APIs
- Template engine
- Storage services

## Quick Links

- [Architecture](./architecture.md)
- [Components](./components.md)
- [API Documentation](./api.md)
- [Testing](./testing.md)

## Migration Status

This feature is currently being migrated from the podcast feature to become a shared core feature. See the migration task plan in `/docs/working-memory/open/core-processing-migration-20240320/.plan` for details.
