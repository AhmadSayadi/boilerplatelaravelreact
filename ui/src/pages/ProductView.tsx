import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProductStore } from "@/stores/productStore";

export default function ProductView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const products = useProductStore((state) => state.products);
  const product = products.find((p) => p.id === id);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (!product) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <h1 className="text-2xl font-bold mb-2">Produk tidak ditemukan</h1>
          <Button onClick={() => navigate("/products")} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Products
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate("/products")} variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Detail Produk</h1>
            <p className="text-muted-foreground">Informasi lengkap produk</p>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Informasi Produk</CardTitle>
            <Button onClick={() => navigate(`/products/edit/${product.id}`)} className="gap-2">
              <Pencil className="h-4 w-4" />
              Edit Produk
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Product Image */}
              <div className="flex-shrink-0">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-48 w-48 rounded-xl object-cover"
                  />
                ) : (
                  <div className="h-48 w-48 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-4xl font-bold">
                    {product.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">{product.name}</h2>
                  <p className="text-muted-foreground">{product.sku}</p>
                </div>

                <div className="flex gap-2">
                  <Badge variant="outline" className="border-primary/50 text-primary">
                    {product.category}
                  </Badge>
                  <Badge
                    className={cn(
                      "rounded-full",
                      product.status === "Active"
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {product.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Harga</p>
                    <p className="text-xl font-bold">{formatCurrency(product.price)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Stok</p>
                    <p className={cn(
                      "text-xl font-bold",
                      product.stock <= 10 && "text-destructive",
                      product.stock > 10 && product.stock <= 50 && "text-warning",
                      product.stock > 50 && "text-success"
                    )}>
                      {product.stock}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ID Produk</p>
                    <p className="font-medium">{product.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tanggal Dibuat</p>
                    <p className="font-medium">
                      {new Date(product.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {product.description && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Deskripsi</p>
                    <p className="text-foreground">{product.description}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
