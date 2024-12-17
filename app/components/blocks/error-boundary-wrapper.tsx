"use client";

import * as React from "react";
import { ErrorBoundary } from "@/app/components/error-boundary";

interface ErrorBoundaryWrapperProps {
  children: React.ReactNode;
  name?: string;
}

export function ErrorBoundaryWrapper({
  children,
  name,
}: ErrorBoundaryWrapperProps) {
  return <ErrorBoundary name={name}>{children}</ErrorBoundary>;
}
