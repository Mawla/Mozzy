"use client";

import React from "react";
import { PodcastGrid } from "@/app/components/dashboard/podcasts/PodcastGrid";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";

// Loading skeleton component
const PodcastGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="h-48 animate-pulse bg-gray-100" />
      ))}
    </div>
  );
};

// Error component
const ErrorState = () => {
  return (
    <div className="text-center py-10">
      <h3 className="text-lg font-semibold text-gray-900">
        Something went wrong
      </h3>
      <p className="text-gray-500">
        Failed to load podcasts. Please try again later.
      </p>
    </div>
  );
};

const PodcastsPage = () => {
  const router = useRouter();

  const handleNewPodcast = () => {
    router.push("/dashboard/podcasts/new");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Podcasts</h1>
        <Button
          onClick={handleNewPodcast}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add Podcast
        </Button>
      </div>

      <Suspense fallback={<PodcastGridSkeleton />}>
        <ErrorBoundary fallback={<ErrorState />}>
          <div className="grid gap-6">
            <PodcastGrid podcasts={[]} />
          </div>
        </ErrorBoundary>
      </Suspense>
    </div>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default PodcastsPage;
