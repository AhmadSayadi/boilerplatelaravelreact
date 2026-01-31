import { useMemo } from "react";
import { router } from "@inertiajs/react";
import { Product } from "@/stores/productStore";
import { CrudDataTable, FilterConfig } from "@/components/crud";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductsTableProps {
  products: Product[];
  onDelete: (product: Product) => void;
  onBulkDelete?: (products: Product[]) => void;
}

export function ProductsTable({ products, onDelete, onBulkDelete }: ProductsTableProps) {
  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))];
    return cats.sort();
  }, [products]);

  const filters: FilterConfig[] = [
    {
      key: "status",
      placeholder: "Status",
      options: [
        { value: "all", label: "Semua Status" },
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
    },
    {
      key: "category",
      placeholder: "Kategori",
      options: [
        { value: "all", label: "Semua Kategori" },
        ...categories.map((cat) => ({ value: cat, label: cat })),
      ],
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <CrudDataTable<Product>
      data={products}
      idAccessor="id"
      entityName="produk"
      searchPlaceholder="Cari nama atau SKU..."
      searchKeys={["name", "sku"]}
      filters={filters}
      defaultSortKey="createdAt"
      defaultSortDirection="desc"
      onView={(product) => router.visit(`/products/view/${product.id}`)}
      onEdit={(product) => router.visit(`/products/edit/${product.id}`)}
      onDelete={onDelete}
      onBulkDelete={onBulkDelete}
      columns={[
        {
          accessor: "name",
          title: "Produk",
          sortable: true,
          width: 220,
          render: (product) => (
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
          accessor: "category",
          title: "Kategori",
          sortable: true,
          width: 130,
          render: (product) => (
            <Badge variant="outline" className="border-primary/50 text-primary">
              {product.category}
            </Badge>
          ),
        },
        {
          accessor: "price",
          title: "Harga",
          sortable: true,
          width: 140,
          render: (product) => (
            <span className="font-medium">{formatCurrency(product.price)}</span>
          ),
        },
        {
          accessor: "stock",
          title: "Stok",
          sortable: true,
          width: 100,
          render: (product) => (
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
          accessor: "status",
          title: "Status",
          sortable: true,
          width: 100,
          render: (product) => (
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
      ]}
    />
  );
}
