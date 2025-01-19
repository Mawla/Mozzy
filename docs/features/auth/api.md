# Authentication API Documentation

## Overview

The authentication API provides a comprehensive set of server actions and routes for handling user authentication in Mozzy. It uses Supabase Auth with Next.js 14's server components and middleware for secure, SSR-compatible authentication.

## Server Actions

Server actions are the primary way to interact with authentication functionality in Mozzy. These functions are located in `/app/actions/auth.ts` and provide a type-safe interface for authentication operations.

### Sign In

The sign-in action authenticates users using their email and password. It creates a new session and sets up the necessary cookies for persistent authentication.

```typescript
async function signIn(email: string, password: string): Promise<AuthResponse>;
```

**Parameters:**

- `email`: User's email address
- `password`: User's password

**Returns:**

- `AuthResponse` containing the session and user data or an error

**Example Usage:**

```typescript
const { data, error } = await signIn("user@example.com", "password");
```

### Sign Out

The sign-out action terminates the current user session, clears authentication cookies, and redirects to the login page.

```typescript
async function signOut(): Promise<void>;
```

**Security Considerations:**

- Cleans up all session data
- Invalidates tokens on the server
- Removes client-side state

### Get Session

Retrieves the current authentication session. This is useful for checking authentication status and accessing user data.

```typescript
async function getSession(): Promise<Session | null>;
```

**Use Cases:**

- Checking authentication status
- Retrieving user information
- Validating token expiration

### Get User

A convenience method that extracts the user information from the current session.

```typescript
async function getUser(): Promise<User | null>;
```

**Common Use Cases:**

- Displaying user information
- Checking user roles
- Personalizing content

## API Routes

The authentication system includes several API routes for handling different aspects of the authentication flow.

### Callback Handler

Located at `/app/auth/callback/route.ts`, this route handles OAuth callbacks and session establishment.

**Purpose:**

- Processes authentication callbacks
- Exchanges temporary codes for sessions
- Handles redirect flows

**Implementation Details:**

```typescript
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
```

### Token Refresh

Located at `/app/api/auth/refresh/route.ts`, this route manages token refresh operations.

**Features:**

- Automatic token refresh
- Session persistence
- Error recovery

**Error Handling:**

- Handles expired tokens
- Manages refresh failures
- Provides fallback mechanisms

## Middleware

The authentication middleware (`/middleware.ts`) provides route protection and session validation.

**Key Features:**

- Route protection
- Session validation
- Redirect handling
- Performance optimization

**Protected Routes:**

- Dashboard routes (`/dashboard/*`)
- API routes (`/api/*`)
- User-specific content

## Error Handling

The API implements comprehensive error handling with clear error messages and status codes.

### Common Error Types

1. **Invalid Credentials**

   - Occurs during failed login attempts
   - Provides user-friendly error messages
   - Includes retry guidance

2. **Session Expiration**

   - Handles expired sessions gracefully
   - Attempts automatic refresh
   - Provides clear user feedback

3. **Token Validation**
   - Validates token integrity
   - Checks token expiration
   - Handles refresh token errors

## Security Measures

### Cookie Management

The API uses secure cookie-based token storage with the following features:

**Cookie Structure:**

```typescript
interface AuthCookies {
  "sb-127-auth-token": string; // Access token
  "sb-127-auth-token.0": string; // Refresh token
  "sb-127-auth-token.1": string; // User data
}
```

**Security Features:**

- HTTP-only cookies
- Secure flag in production
- SameSite policy enforcement
- Path restrictions

### Rate Limiting

To prevent abuse, the API implements rate limiting:

**Limits:**

- Login attempts: 5 per minute
- Token refresh: 10 per minute
- Password reset: 3 per hour

**Implementation:**

- IP-based tracking
- Sliding window algorithm
- Automatic lockout protection

### Security Headers

The API enforces security headers to protect against common vulnerabilities:

**Header Configuration:**

```typescript
const securityHeaders = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Content-Security-Policy": "default-src 'self'",
};
```

**Protection Against:**

- Clickjacking
- MIME type sniffing
- Cross-site scripting
- Information disclosure

## Testing

Comprehensive testing documentation and examples are available in [testing.md](./testing.md).

**Test Coverage:**

- Unit tests for all actions
- Integration tests for flows
- Security testing
- Performance testing
