"use client";

import { Card } from "@/components/ui/card";
import { Podcast } from "@/app/types/podcast";
import Link from "next/link";

interface PodcastCardProps {
  podcast: Podcast;
}

export const PodcastCard = ({ podcast }: PodcastCardProps) => {
  return (
    <Link href={`/dashboard/podcasts/${podcast.id}`}>
      <Card className="p-4 hover:shadow-lg transition-shadow">
        <h3 className="font-semibold">{podcast.title}</h3>
        <p className="text-sm text-gray-600">{podcast.description}</p>
        <div className="mt-2 text-xs text-gray-500">
          {podcast.duration && <span>{podcast.duration}</span>}
          <span className="ml-2">{podcast.status}</span>
        </div>
      </Card>
    </Link>
  );
};
