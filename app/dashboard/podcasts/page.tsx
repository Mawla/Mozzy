"use client";

import React from "react";
import { PodcastGrid } from "@/app/components/dashboard/podcasts/PodcastGrid";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

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

export default function PodcastsPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Podcasts</h1>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/dashboard/podcasts/new">Add Podcast</Link>
        </Button>
      </div>

      <Suspense fallback={<PodcastGridSkeleton />}>
        <PodcastGrid />
      </Suspense>
    </div>
  );
}
