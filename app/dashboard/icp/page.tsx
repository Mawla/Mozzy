import ICPInfo from "@/components/icp-info";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const IcpPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Posts</h1>
        <Link href="/dashboard/icp/create">
          <Button>Create New ICP</Button>
        </Link>
      </div>
      <ICPInfo />
    </div>
  );
};

export default IcpPage;
