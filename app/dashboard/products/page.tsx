import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Linkedin, Twitter, Facebook } from "lucide-react";

const ProductsPage = () => {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
        <Button className="ml-auto">Add Product</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>Product {i + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default ProductsPage;
