# Mozzy API Documentation

_Last Updated: 2025-02-08 15:43_

## Overview

This documentation covers the API endpoints and server actions available in the Mozzy platform. The API is built using Next.js 14 App Router and follows RESTful principles.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://mozzy.app/api`

## Authentication

All API endpoints require authentication using Supabase JWT tokens. Include the token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Content Processing

#### Start Content Processing

```http
POST /api/process
Content-Type: application/json
Authorization: Bearer <token>

{
  "type": "podcast|post",
  "content": {
    "url": "string",
    "text": "string",
    "title": "string"
  },
  "options": {
    "templates": ["string"],
    "platforms": ["string"],
    "customization": {}
  }
}
```

**Response**:

```json
{
  "id": "string",
  "status": "processing",
  "estimatedTime": "number"
}
```

#### Get Processing Status

```http
GET /api/process/:id
Authorization: Bearer <token>
```

**Response**:

```json
{
  "id": "string",
  "status": "processing|completed|failed",
  "progress": "number",
  "result": {}
}
```

### Templates

#### List Templates

```http
GET /api/templates
Authorization: Bearer <token>
```

**Response**:

```json
{
  "templates": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "platform": "string"
    }
  ]
}
```

#### Get Template

```http
GET /api/templates/:id
Authorization: Bearer <token>
```

**Response**:

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "platform": "string",
  "content": "string",
  "variables": []
}
```

### Content Management

#### List Content

```http
GET /api/content
Authorization: Bearer <token>
```

**Response**:

```json
{
  "content": [
    {
      "id": "string",
      "type": "podcast|post",
      "title": "string",
      "status": "string",
      "createdAt": "string"
    }
  ]
}
```

#### Get Content Details

```http
GET /api/content/:id
Authorization: Bearer <token>
```

**Response**:

```json
{
  "id": "string",
  "type": "podcast|post",
  "title": "string",
  "content": {},
  "processedContent": {},
  "status": "string",
  "createdAt": "string",
  "updatedAt": "string"
}
```

## Server Actions

### Content Processing

```typescript
// Start processing
async function startProcessing(
  data: ProcessingInput
): Promise<ProcessingResult>;

// Check processing status
async function getProcessingStatus(id: string): Promise<ProcessingStatus>;

// Cancel processing
async function cancelProcessing(id: string): Promise<void>;
```

### Template Management

```typescript
// Create template
async function createTemplate(data: TemplateInput): Promise<Template>;

// Update template
async function updateTemplate(
  id: string,
  data: TemplateInput
): Promise<Template>;

// Delete template
async function deleteTemplate(id: string): Promise<void>;
```

### Content Management

```typescript
// Create content
async function createContent(data: ContentInput): Promise<Content>;

// Update content
async function updateContent(id: string, data: ContentInput): Promise<Content>;

// Delete content
async function deleteContent(id: string): Promise<void>;
```

## Error Handling

### Error Responses

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

### Common Error Codes

- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `429`: Too Many Requests
- `500`: Internal Server Error

## Rate Limiting

- 100 requests per minute per user
- 1000 requests per hour per user
- Rate limit headers included in responses

## Webhooks

### Processing Completion Webhook

```http
POST {webhook_url}
Content-Type: application/json

{
  "type": "processing.completed",
  "data": {
    "id": "string",
    "status": "completed",
    "result": {}
  }
}
```

## TypeScript Types

See [Type Documentation](../types/README.md) for detailed type definitions.

## Related Documentation

- [Architecture Documentation](../architecture/README.md)
- [Type Documentation](../types/README.md)
- [Security Guidelines](../security/README.md)

## Version History

- 2025-02-08: Initial API documentation
- Future updates will be logged here
