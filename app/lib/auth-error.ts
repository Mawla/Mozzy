export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public description?: string
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export function handleSupabaseError(error: any): AuthError {
  // Handle Supabase specific errors
  if (error?.status === 401) {
    return new AuthError(
      "Authentication failed",
      401,
      error.error_description || "Invalid credentials or session expired"
    );
  }

  if (error?.status === 403) {
    return new AuthError(
      "Access forbidden",
      403,
      "You do not have permission to access this resource"
    );
  }

  // Generic auth error
  return new AuthError(
    "Authentication error",
    500,
    error?.message || "An unexpected authentication error occurred"
  );
}
