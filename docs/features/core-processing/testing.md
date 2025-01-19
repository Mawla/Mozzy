# Core Processing Testing Documentation

## Overview

This document outlines the testing strategy and implementation for the Core Processing feature. It covers unit tests and integration tests.

## Test Structure

```
__tests__/core/processing/
├── service/
│   └── ProcessingService.test.ts
├── adapters/
│   ├── PodcastProcessingAdapter.test.ts
│   └── PostProcessingAdapter.test.ts
└── integration/
    └── ProcessingPipeline.test.ts
```

## Unit Tests

### ProcessingService Tests

Tests for the central processing service that manages adapters and coordinates processing.

```typescript
describe("ProcessingService", () => {
  // Adapter Registration
  it("should register adapters correctly");
  it("should throw error for unregistered format");

  // Processing
  it("should validate input before processing");
  it("should process valid input");
  it("should handle processing errors");

  // Status Management
  it("should return processing status");
  it("should handle status check errors");
});
```

### Adapter Tests

Common test cases for all format adapters:

```typescript
describe("ProcessingAdapter", () => {
  // Validation
  it("should return false for empty input");
  it("should return true for valid input");
  it("should handle validation errors");

  // Processing
  it("should process content with all analysis options");
  it("should process content without analysis options");
  it("should handle processing errors");

  // Status
  it("should return processing status");
});
```

## Integration Tests

Tests that verify the complete processing pipeline:

```typescript
describe("Processing Pipeline", () => {
  // End-to-End Processing
  it("should process content identically regardless of format");
  it("should handle large content in chunks");
  it("should extract entities consistently");

  // Format-Specific Features
  it("should include timeline for podcasts only");
  it("should handle speaker detection for podcasts");

  // Error Handling
  it("should handle invalid input consistently");
  it("should handle processing failures gracefully");
});
```

## Test Utilities

### Mock Adapter

```typescript
class MockAdapter implements ProcessingAdapter {
  mockValidate = jest.fn();
  mockProcess = jest.fn();
  mockGetStatus = jest.fn();

  async validate(input: string): Promise<boolean> {
    return this.mockValidate(input);
  }

  async process(
    input: string,
    options: ProcessingOptions
  ): Promise<ProcessingResult> {
    return this.mockProcess(input, options);
  }

  async getStatus(id: string): Promise<ProcessingResult> {
    return this.mockGetStatus(id);
  }
}
```

### Test Data

```typescript
const sampleText = `
  This is a sample text that could be either a podcast transcript
  or a blog post. The core processing should handle both the same way.
  
  It contains multiple paragraphs and potential entities like:
  - People: John Doe, Jane Smith
  - Organizations: Acme Corp, TechCo
  - Locations: New York, London
`;
```

## Test Coverage

Current test coverage requirements:

- Lines: >90%
- Functions: 100%
- Branches: >85%
- Statements: >90%

## Error Testing

### Test Cases

```typescript
describe("Error Handling", () => {
  it("should handle invalid input");
  it("should handle processing failures");
  it("should handle timeout errors");
});
```

### Error Scenarios

1. Input Validation

   - Empty input
   - Invalid format
   - Size limits
   - Malformed content

2. Processing Errors

   - Invalid state
   - Adapter failures

3. System Errors
   - External service failures

## Test Environment

### Setup

```typescript
beforeEach(() => {
  // Reset mocks
  jest.clearAllMocks();

  // Create fresh instances
  service = new ProcessingService();
  mockAdapter = new MockAdapter();

  // Register adapters
  service.registerAdapter("podcast", mockAdapter);
});
```

### Cleanup

```typescript
afterEach(() => {
  // Clear test data
  if (service) {
    service.clearAdapters();
  }

  // Reset mocks
  jest.resetAllMocks();
});
```

## Running Tests

### Commands

```bash
# Run all tests
npm test

# Run specific test file
npm test ProcessingService.test.ts

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### CI Integration

Tests are run in CI with the following stages:

1. Lint Check
2. Type Check
3. Unit Tests
4. Integration Tests
5. Coverage Report

## Test Guidelines

1. Test Organization

   - Group related tests
   - Use clear descriptions
   - Follow AAA pattern
   - Keep tests focused

2. Mock Usage

   - Mock external dependencies
   - Use type-safe mocks
   - Reset mocks between tests
   - Verify mock calls

3. Assertions

   - Use type-safe assertions
   - Check error cases
   - Verify state changes
   - Test edge cases

4. Documentation
   - Document test purpose
   - Explain complex setups
   - Note assumptions
   - Document limitations
