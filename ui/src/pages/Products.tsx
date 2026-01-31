import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ProductsTable } from "@/components/products/ProductsTable";
import { DeleteProductDialog } from "@/components/products/DeleteProductDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useProductStore, Product } from "@/stores/productStore";

export default function Products() {
  const navigate = useNavigate();
  const products = useProductStore((state) => state.products);
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const bulkDeleteProducts = useProductStore((state) => state.bulkDeleteProducts);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProduct) {
      deleteProduct(selectedProduct.id);
      toast.success("Produk berhasil dihapus");
    }
    setIsDeleteDialogOpen(false);
  };

  const handleBulkDelete = (productsToDelete: Product[]) => {
    const ids = productsToDelete.map((p) => p.id);
    bulkDeleteProducts(ids);
    toast.success(`${productsToDelete.length} produk berhasil dihapus`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
            <div>
              <CardTitle className="text-2xl">Products Management</CardTitle>
              <CardDescription>Kelola produk dan inventaris</CardDescription>
            </div>
            <Button onClick={() => navigate("/products/add")} className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Produk
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ProductsTable
              products={products}
              onDelete={handleDelete}
              onBulkDelete={handleBulkDelete}
            />
          </CardContent>
        </Card>

        <DeleteProductDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          product={selectedProduct}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </DashboardLayout>
  );
}

export type { Product };
