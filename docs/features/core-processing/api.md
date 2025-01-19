# Core Processing API

## Processing API

### Process Content

```typescript
POST /api/processing/process
Content-Type: application/json

{
  "content": {
    "type": "podcast" | "post",
    "data": any,
    "metadata": {
      "title": string,
      "description": string,
      "tags": string[]
    }
  },
  "config": {
    "analysisDepth": "basic" | "detailed",
    "outputFormat": "markdown" | "html" | "json",
    "templateId": string,
    "featureSpecific": Record<string, any>
  }
}

Response: {
  "taskId": string,
  "status": "queued" | "processing" | "completed" | "failed",
  "result?: ProcessedContent
}
```

### Get Processing Status

```typescript
GET /api/processing/:taskId/status

Response: {
  "taskId": string,
  "status": "queued" | "processing" | "completed" | "failed",
  "progress": number,
  "error"?: string
}
```

### Cancel Processing

```typescript
POST /api/processing/:taskId/cancel

Response: {
  "taskId": string,
  "status": "cancelled"
}
```

## Template API

### Get Available Templates

```typescript
GET /api/processing/templates

Response: {
  "templates": Array<{
    "id": string,
    "name": string,
    "description": string,
    "supportedTypes": string[]
  }>
}
```

### Get Template Details

```typescript
GET /api/processing/templates/:templateId

Response: {
  "id": string,
  "name": string,
  "description": string,
  "schema": object,
  "preview": string
}
```

## Configuration API

### Get Processing Configuration

```typescript
GET /api/processing/config

Response: {
  "defaultConfig": ProcessingConfig,
  "featureConfigs": Record<string, ProcessingConfig>,
  "limits": {
    "maxContentSize": number,
    "maxProcessingTime": number,
    "concurrentTasks": number
  }
}
```

### Update Feature Configuration

```typescript
PUT /api/processing/config/:feature
Content-Type: application/json

{
  "config": ProcessingConfig
}

Response: {
  "feature": string,
  "config": ProcessingConfig,
  "updated": boolean
}
```

## Core Processing Library API

### ContentProcessor

```typescript
interface ContentProcessor {
  // Process content end-to-end
  process(input: ContentInput): Promise<ProcessedContent>;

  // Individual processing steps
  analyze(content: RawContent): Promise<AnalyzedContent>;
  extract(analyzed: AnalyzedContent): Promise<StructuredContent>;
  transform(structured: StructuredContent): Promise<VisualContent>;

  // Configuration
  configure(config: ProcessingConfig): void;

  // Event handling
  on(event: ProcessingEvent, handler: EventHandler): void;
  off(event: ProcessingEvent, handler: EventHandler): void;
}
```

### FeatureAdapter

```typescript
interface FeatureAdapter {
  // Content adaptation
  adapt(input: any): ContentInput;
  transform(output: VisualContent): any;

  // Configuration
  getConfig(): ProcessingConfig;

  // Validation
  validateInput(input: any): boolean;
  validateOutput(output: any): boolean;
}
```

## Error Handling

### Error Types

```typescript
enum ProcessingErrorType {
  VALIDATION_ERROR = "validation_error",
  PROCESSING_ERROR = "processing_error",
  TIMEOUT_ERROR = "timeout_error",
  TEMPLATE_ERROR = "template_error",
  ADAPTER_ERROR = "adapter_error",
}

interface ProcessingError {
  type: ProcessingErrorType;
  message: string;
  details?: any;
  taskId?: string;
}
```

### Error Responses

```typescript
// Validation Error
{
  "error": {
    "type": "validation_error",
    "message": "Invalid input format",
    "details": {
      "field": "content.data",
      "issue": "missing_required_field"
    }
  }
}

// Processing Error
{
  "error": {
    "type": "processing_error",
    "message": "Failed to process content",
    "taskId": "task-123",
    "details": {
      "stage": "analysis",
      "reason": "content_too_large"
    }
  }
}
```

## WebSocket API

### Connection

```typescript
const ws = new WebSocket("/api/processing/ws");
```

### Events

```typescript
// Task Updates
{
  "type": "task_update",
  "taskId": string,
  "status": TaskStatus,
  "progress": number
}

// Processing Events
{
  "type": "processing_event",
  "event": ProcessingEvent,
  "data": any
}

// Error Events
{
  "type": "error",
  "error": ProcessingError
}
```

## Rate Limiting

- Maximum concurrent tasks: 5 per user
- Maximum content size: 100MB
- Processing timeout: 30 minutes
- API rate limits: 100 requests per minute

## Security

### Authentication

- Required for all endpoints
- JWT token in Authorization header
- WebSocket connection requires initial auth

### Input Validation

- Content size limits
- Format validation
- Sanitization rules
- Type checking

### Output Security

- Content sanitization
- XSS prevention
- Safe template rendering
- Output validation
