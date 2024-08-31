import { Facebook, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProductGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <ProductCard key={i} index={i} />
      ))}
    </div>
  );
}

function ProductCard({ index }: { index: number }) {
  return (
    <Card className="border-gray-200 hover:border-gray-300 transition-colors">
      <CardHeader>
        <CardTitle>Product {index + 1}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center space-x-4">
          <ShareButton icon={Linkedin} label="Share on LinkedIn" />
          <ShareButton icon={Twitter} label="Share on Twitter" />
          <ShareButton icon={Facebook} label="Share on Facebook" />
        </div>
      </CardContent>
    </Card>
  );
}

function ShareButton({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <Button variant="outline" size="icon" aria-label={label}>
      <Icon className="h-4 w-4" />
    </Button>
  );
}
