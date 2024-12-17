"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { logger } from "@/app/services/logger";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  name?: string; // Component name for better error tracking
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error using our logger service
    logger.error(`Error in ${this.props.name || "unknown component"}`, error, {
      componentStack: errorInfo.componentStack,
      name: this.props.name,
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        this.props.fallback || (
          <Alert variant="destructive" className="my-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription className="mt-2 flex flex-col gap-2">
              <p>
                {this.state.error?.message ||
                  "An unexpected error occurred. Please try again."}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => this.setState({ hasError: false, error: null })}
              >
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        )
      );
    }

    return this.props.children;
  }
}

// Higher-order component to wrap components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: React.ReactNode;
    name?: string;
  }
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={options?.fallback} name={options?.name}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
