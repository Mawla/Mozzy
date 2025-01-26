# API Mapping Guide

## Overview

This document maps the existing Next.js API routes to their Rails counterparts, including authentication changes, versioning strategy, and response format differences.

## API Versioning Strategy

### Version Format

```ruby
# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # Current API endpoints
    end

    # Future versions
    namespace :v2 do
      # Next generation endpoints
    end
  end
end
```

### Compatibility Layer

1. **Request Format Translation**

   ```ruby
   # app/controllers/concerns/request_compatibility.rb
   module RequestCompatibility
     extend ActiveSupport::Concern

     def transform_params
       # Transform Next.js style params to Rails format
       @transformed_params = {
         # Mapping logic
       }
     end
   end
   ```

2. **Response Format Consistency**
   ```ruby
   # app/controllers/concerns/response_compatibility.rb
   module ResponseCompatibility
     extend ActiveSupport::Concern

     def render_compatible_response(data, status: :ok)
       render json: {
         data: data,
         status: status,
         timestamp: Time.current
       }, status: status
     end
   end
   ```

## Authentication Endpoints

### Current (Next.js)

```typescript
// app/api/auth/[...nextauth]/route.ts
POST / api / auth / signin;
POST / api / auth / signout;
GET / api / auth / session;
```

### New (Rails)

```ruby
# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post 'auth/sign_in', to: 'sessions#create'
      delete 'auth/sign_out', to: 'sessions#destroy'
      get 'auth/session', to: 'sessions#show'
    end
  end
end
```

## Core Processing Endpoints

### Podcast Processing

#### Current (Next.js)

```typescript
POST /api/podcasts/upload
POST /api/podcasts/:id/process
GET  /api/podcasts/:id/status
```

#### New (Rails)

```ruby
# config/routes.rb
namespace :api do
  namespace :v1 do
    resources :podcasts do
      member do
        post :upload
        post :process
        get :status
      end
    end
  end
end
```

### Social Posts

#### Current (Next.js)

```typescript
POST /api/posts/create
PUT  /api/posts/:id
GET  /api/posts/:id/status
```

#### New (Rails)

```ruby
# config/routes.rb
namespace :api do
  namespace :v1 do
    resources :posts do
      member do
        get :status
      end
    end
  end
end
```

## Response Format Changes

### Error Responses

#### Current (Next.js)

```json
{
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

#### New (Rails)

```ruby
# app/controllers/concerns/error_handling.rb
module ErrorHandling
  extend ActiveSupport::Concern

  included do
    rescue_from StandardError do |e|
      render_error(e)
    end
  end

  private

  def render_error(error)
    render json: {
      error: {
        message: error.message,
        code: error_code_for(error),
        details: error_details_for(error)
      }
    }, status: error_status_for(error)
  end
end
```

## Authentication Changes

### Token Management

1. **Current (Next.js with Supabase)**

```typescript
// Supabase token handling
const supabase = createServerClient(...)
```

2. **New (Rails with JWT)**

```ruby
# app/controllers/concerns/jwt_authentication.rb
module JwtAuthentication
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_jwt!
  end

  private

  def authenticate_jwt!
    token = extract_token_from_headers
    @current_user = User.find_by_jwt(token)
  rescue JWT::DecodeError
    render_unauthorized
  end
end
```

## Migration Process

1. **Phase 1: Parallel Operation**

   - Deploy Rails API alongside Next.js
   - Route traffic based on feature flags
   - Monitor for errors and performance

2. **Phase 2: Gradual Migration**

   - Migrate endpoints one feature at a time
   - Validate each endpoint thoroughly
   - Keep compatibility layer for old clients

3. **Phase 3: Cleanup**
   - Remove old Next.js routes
   - Clean up compatibility layer
   - Update all clients to new endpoints

## Testing Strategy

1. **Endpoint Testing**

   ```ruby
   # spec/requests/api/v1/podcasts_spec.rb
   RSpec.describe "API V1 Podcasts", type: :request do
     describe "POST /api/v1/podcasts/:id/process" do
       it "processes the podcast" do
         # Test implementation
       end
     end
   end
   ```

2. **Compatibility Testing**
   ```ruby
   # spec/requests/compatibility/podcasts_spec.rb
   RSpec.describe "Legacy API Compatibility", type: :request do
     it "handles legacy request format" do
       # Test implementation
     end
   end
   ```

## Monitoring & Validation

1. **Performance Metrics**

   ```ruby
   # config/initializers/instrumentation.rb
   ActiveSupport::Notifications.subscribe "process_action.action_controller" do |*args|
     event = ActiveSupport::Notifications::Event.new(*args)
     # Log performance metrics
   end
   ```

2. **Error Tracking**
   ```ruby
   # config/initializers/error_tracking.rb
   Sentry.init do |config|
     config.dsn = ENV['SENTRY_DSN']
     config.environment = Rails.env
   end
   ```

## Rollback Procedures

1. **Quick Rollback**

   - Revert to Next.js routes
   - Restore old authentication
   - Log all rollback actions

2. **Gradual Rollback**
   - Feature-by-feature reversion
   - Data consistency checks
   - Client notification

## Documentation Updates

When adding new endpoints:

1. Update this mapping document
2. Add controller documentation
3. Update API client libraries
4. Update integration tests
