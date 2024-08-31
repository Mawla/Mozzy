import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PostPageProps {
  params: {
    id: string;
  };
}

export default function Post({ params }: PostPageProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Post {params.id}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This is the content of post {params.id}. You can fetch and display the
          actual post data here.
        </p>
      </CardContent>
    </Card>
  );
}
