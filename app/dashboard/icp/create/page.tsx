import { IcpFullPageFormUpdated } from "@/components/icp-full-page-form-updated";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const PostsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"></div>
      <IcpFullPageFormUpdated />
    </div>
  );
};

export default PostsPage;
