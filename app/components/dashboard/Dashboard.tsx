import { ProductGrid } from "./ProductGrid";
import { Button } from "../../../components/ui/button";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Dashboard() {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
            <Button className="ml-auto">Add Product</Button>
          </div>
          <ProductGrid />
        </main>
      </div>
    </div>
  );
}
