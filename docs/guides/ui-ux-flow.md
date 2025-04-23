# Mozzy UI/UX Flow Documentation

_Last Updated: 2025-02-08 15:47_

## Overview

This document outlines the user interface and experience flow of the Mozzy platform, detailing the main user journeys, interfaces, and interaction patterns that make up the application.

## User Journeys

### 1. Content Creator Journey: Podcast Transformation

#### Login & Dashboard Access

1. User logs in via `/login`
2. Redirected to Dashboard (`/dashboard`)

#### Podcast Processing Flow

1. **Navigation**

   - Access Podcasts Section via Dashboard sidebar
   - Navigate to New Podcast Page (`/dashboard/podcasts/new`)

2. **Content Input**

   - **Podcast Input Component** with multiple tabs:
     - Paste Transcript Tab
     - Podcast URL Tab
     - Search Podcast Tab
   - Real-time token counting
   - Audio recording capability

3. **Processing & Feedback**

   - Processing Pipeline View showing:
     - Overall progress
     - Step-by-step status
     - Chunk visualization
     - Processing logs

4. **Results Review**
   - Processed content display via Block Renderer
   - Analysis components:
     - Overview Block
     - Key Points Block
     - Summary Block
     - Timeline Block
     - Topic Block
   - Export and sharing options

### 2. Content Creator Journey: Social Post Creation

#### Post Creation Flow

1. **Initiation**

   - Navigate to Posts Section (`/dashboard/posts`)
   - Click "Create New Post"

2. **Content Input & Editing** (`/dashboard/posts/create`)

   - Post Header Component
   - Post Content Component with tabs:
     - Content Tab (TipTap Editor)
     - Template Tab
     - Merge Tab
   - Progress tracking
   - Content import options

3. **Post Management**
   - Posts listing with card grid layout
   - Individual post views
   - Edit functionality

### 3. Admin User Journey: ICP Management

#### ICP Management Flow

1. **Access**

   - Navigate to ICP Section (`/dashboard/icp`)

2. **ICP Interface**

   - List view of ICPs
   - Creation and editing forms
   - Detailed ICP views

3. **ICP Operations**
   - Create new ICPs
   - Edit existing ICPs
   - Delete ICPs
   - View ICP details

## Main Interfaces

### Core Pages

1. **Dashboard** (`/dashboard`)

   - Central navigation hub
   - Quick actions
   - Overview metrics

2. **Posts Management**

   - Posts Listing Page
   - Create Post Page
   - View Post Page
   - Edit Post Page

3. **Podcast Management**

   - Podcasts Page
   - New Podcast Page
   - Podcast Results Page

4. **System Pages**
   - Settings Page
   - Login Page
   - ICP Page
   - Content Bank Page

## Interaction Patterns

### Navigation & Layout

1. **Tabbed Navigation**

   - Content/Template/Merge tabs
   - Dashboard section tabs

2. **Card Grids**
   - Posts display
   - Templates display
   - Products display
   - Podcasts display

### User Input

1. **Forms**

   - Authentication forms
   - ICP management forms
   - Content creation forms

2. **Rich Text Editing**
   - TipTap Editor integration
   - Token counting
   - Template merging

### Modal Interactions

1. **Content Import Modal**

   - External content import
   - Content hub integration

2. **Template Selection Modal**
   - Template browsing
   - Template application

### Progress & Feedback

1. **Processing Pipeline**

   - Step status indicators
   - Progress visualization
   - Error handling

2. **Notifications**
   - Success messages
   - Error alerts
   - Processing updates

## Component Architecture

### Layout Components

```typescript
interface BlockLayoutProps {
  children: React.ReactNode;
  navigation?: React.ReactNode;
  actions?: React.ReactNode;
}
```

### Content Components

```typescript
interface BlockRendererProps {
  content: ContentBlock[];
  onBlockUpdate?: (block: ContentBlock) => void;
  readOnly?: boolean;
}
```

### Form Components

```typescript
interface ContentFormProps {
  initialData?: ContentData;
  onSubmit: (data: ContentData) => Promise<void>;
  isProcessing?: boolean;
}
```

## Best Practices

### UI Principles

1. **Consistency**

   - Use standard component patterns
   - Maintain consistent spacing
   - Follow color system

2. **Feedback**

   - Show loading states
   - Provide error messages
   - Indicate progress

3. **Accessibility**
   - Maintain ARIA labels
   - Ensure keyboard navigation
   - Support screen readers

### UX Guidelines

1. **Navigation**

   - Clear hierarchy
   - Breadcrumb trails
   - Back buttons

2. **Content Creation**

   - Auto-save drafts
   - Preview capabilities
   - Undo/redo support

3. **Processing**
   - Clear progress indication
   - Cancelable operations
   - Error recovery

## Related Documentation

- [Component Documentation](../components/README.md)
- [API Documentation](../api/README.md)
- [Architecture Documentation](../architecture/README.md)

## Version History

- 2025-02-08: Initial UI/UX flow documentation
- Future updates will be logged here
