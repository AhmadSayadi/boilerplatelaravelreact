import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCategoryStore } from "@/stores/categoryStore";

export default function CategoryShow() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories } = useCategoryStore();
  const category = categories.find((c) => c.id === id);

  if (!category) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
          <h2 className="text-xl font-semibold">Kategori tidak ditemukan</h2>
          <Button onClick={() => navigate("/categories")}>Kembali ke Kategori</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/categories")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Detail Kategori</h1>
              <p className="text-muted-foreground">Informasi lengkap kategori</p>
            </div>
          </div>
          <Button onClick={() => navigate(`/categories/edit/${category.id}`)}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Kategori
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{category.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">ID Kategori</p>
                <p className="font-medium">{category.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={category.status === "Active" ? "default" : "secondary"}>
                  {category.status === "Active" ? "Aktif" : "Tidak Aktif"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Jumlah Produk</p>
                <p className="font-medium">{category.productCount} produk</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Terakhir Diperbarui</p>
                <p className="font-medium">
                  {format(new Date(category.updatedAt), "dd MMMM yyyy, HH:mm", { locale: idLocale })}
                </p>
              </div>
            </div>
            {category.description && (
              <div>
                <p className="text-sm text-muted-foreground">Deskripsi</p>
                <p className="font-medium">{category.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
