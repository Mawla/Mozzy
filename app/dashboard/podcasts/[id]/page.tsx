import { Metadata } from "next";
import { notFound } from "next/navigation";

interface PodcastDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: PodcastDetailPageProps): Promise<Metadata> {
  // In a real app, fetch the podcast data and use it for the metadata
  return {
    title: `Podcast Details | AI Chat`,
    description: "View and manage your podcast details",
  };
}

const PodcastDetailPage = ({ params }: PodcastDetailPageProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Getting Started with AI</h1>
          <p className="text-gray-600">
            Learn the basics of artificial intelligence and how it can help your
            business.
          </p>
        </div>

        <div className="mb-6">
          <div className="bg-gray-100 rounded-lg p-4">
            {/* Audio player will go here */}
            <div className="text-center text-gray-500">
              Audio Player Coming Soon
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Duration: 25:30</span>
          <span>Created: March 20, 2024</span>
        </div>
      </div>
    </div>
  );
};

export default PodcastDetailPage;
