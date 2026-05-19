import { useState, useEffect } from "react";
import { router, Head } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CrudDataTable, PaginatedData } from "@/components/crud/CrudDataTable";
import { DeleteConfirmDialog } from "@/components/crud/DeleteConfirmDialog";
import { PageSkeleton, TableSkeleton } from "@/components/crud";
import { cn } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
  image?: string;
  status: "Active" | "Inactive";
  created_at: string;
}

interface ProductsIndexProps {
  products: PaginatedData<Product>;
  categories: string[];
}

const statusFilters = [
  { value: "all", label: "Semua Status" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const ProductsIndex = ({ products, categories }: ProductsIndexProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const categoryFilters = [
    { value: "all", label: "Semua Kategori" },
    ...categories.map((cat) => ({ value: cat, label: cat })),
  ];

  const columns = [
    {
      accessor: "name" as keyof Product,
      title: "Produk",
      sortable: true,
      width: 220,
      render: (product: Product) => (
        <div className="flex items-center gap-3">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-10 w-10 rounded-lg object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-semibold">
              {product.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-xs text-muted-foreground">{product.sku}</p>
          </div>
        </div>
      ),
    },
    {
      accessor: "category" as keyof Product,
      title: "Kategori",
      sortable: true,
      width: 130,
      render: (product: Product) => (
        <Badge variant="outline" className="border-primary/50 text-primary">
          {product.category}
        </Badge>
      ),
    },
    {
      accessor: "price" as keyof Product,
      title: "Harga",
      sortable: true,
      width: 140,
      render: (product: Product) => (
        <span className="font-medium">{formatCurrency(product.price)}</span>
      ),
    },
    {
      accessor: "stock" as keyof Product,
      title: "Stok",
      sortable: true,
      width: 100,
      render: (product: Product) => (
        <span
          className={cn(
            "font-medium",
            product.stock <= 10 && "text-destructive",
            product.stock > 10 && product.stock <= 50 && "text-warning",
            product.stock > 50 && "text-success"
          )}
        >
          {product.stock}
        </span>
      ),
    },
    {
      accessor: "status" as keyof Product,
      title: "Status",
      sortable: true,
      width: 100,
      render: (product: Product) => (
        <Badge
          className={cn(
            "rounded-full",
            product.status === "Active"
              ? "bg-success/10 text-success hover:bg-success/20"
              : "bg-muted text-muted-foreground hover:bg-muted"
          )}
        >
          {product.status}
        </Badge>
      ),
    },
    {
      accessor: "created_at" as keyof Product,
      title: "Tanggal Dibuat",
      sortable: true,
      render: (product: Product) => new Date(product.created_at).toLocaleDateString("id-ID"),
    },
  ];

  const handleView = (product: Product) => {
    router.visit(`/products/view/${product.id}`);
  };

  const handleEdit = (product: Product) => {
    router.visit(`/products/edit/${product.id}`);
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      router.delete(`/products/${productToDelete.id}`, {
        onSuccess: () => {
          toast.success("Produk berhasil dihapus");
          setDeleteDialogOpen(false);
          setProductToDelete(null);
        },
        onError: () => {
          toast.error("Gagal menghapus produk");
        },
      });
    }
  };

  const handleBulkDelete = (selectedProducts: Product[]) => {
    const ids = selectedProducts.map((p) => p.id);
    router.post("/products/bulk-delete", { ids }, {
      onSuccess: () => {
        toast.success(`${selectedProducts.length} produk berhasil dihapus`);
      },
      onError: () => {
        toast.error("Gagal menghapus beberapa produk");
      },
    });
  };

  return (
    <DashboardLayout>
      <Head title="Manajemen Produk" />
      <div className="space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            <PageSkeleton />
            <TableSkeleton />
          </div>
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Daftar Produk</CardTitle>
                <CardDescription>
                  Daftar semua produk yang tersedia dalam sistem.
                </CardDescription>
              </div>
              <Button onClick={() => router.visit("/products/create")}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Produk
              </Button>
            </CardHeader>
            <CardContent>
              <CrudDataTable
                data={products}
                columns={columns}
                searchKeys={["name", "sku"]}
                searchPlaceholder="Cari nama atau SKU..."
                filters={[
                  {
                    key: "status",
                    placeholder: "Filter Status",
                    options: statusFilters,
                  },
                  {
                    key: "category",
                    placeholder: "Filter Kategori",
                    options: categoryFilters,
                  },
                ]}
                entityName="produk"
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onBulkDelete={handleBulkDelete}
              />
            </CardContent>
          </Card>
        )}

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          title="Hapus Produk"
          description={`Apakah Anda yakin ingin menghapus produk "${productToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        />
      </div>
    </DashboardLayout>
  );
};

export default ProductsIndex;
