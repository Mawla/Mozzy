# Podcast Feature API

## Endpoints

### Upload Podcast

```typescript
POST /api/podcasts/upload
Content-Type: multipart/form-data

{
  file: File,
  metadata: {
    title: string,
    description: string,
    tags: string[]
  }
}
```

### Get Podcasts

```typescript
GET /api/podcasts
Response: {
  podcasts: PodcastData[]
}
```

### Get Podcast Status

```typescript
GET /api/podcasts/:id/status
Response: {
  status: 'processing' | 'completed' | 'error',
  progress?: number,
  error?: string
}
```

## Processing Pipeline

### Core Processing Integration

The podcast feature utilizes the shared core processing module located at `/app/core/processing`. This module is responsible for:

1. Audio Processing

   - Speech-to-text conversion
   - Segment identification
   - Metadata extraction

2. Content Transformation

   - Text structuring
   - Case study generation
   - Wiki-style formatting

3. Visual Generation
   - Template application
   - Media enhancement
   - Layout optimization

## Error Handling

### HTTP Status Codes

- 200: Successful operation
- 400: Invalid request
- 401: Unauthorized
- 403: Forbidden
- 404: Resource not found
- 500: Server error

### Error Response Format

```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

## Security

### Authentication

- Required for all endpoints
- JWT token validation
- Role-based access control

### Rate Limiting

- Upload limits: 10 requests per minute
- API calls: 100 requests per minute
- File size limit: 500MB

## Testing Guidelines

### API Test Cases

1. Upload validation
2. Status tracking
3. Error scenarios
4. Processing pipeline
5. Security checks
