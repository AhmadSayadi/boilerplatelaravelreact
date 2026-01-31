import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DeleteConfirmDialog, PageSkeleton, TableSkeleton } from "@/components/crud";
import { CrudDataTable } from "@/components/crud/CrudDataTable";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useCategoryStore, Category } from "@/stores/categoryStore";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const statusFilters = [
  { value: "all", label: "Semua Status" },
  { value: "Active", label: "Aktif" },
  { value: "Inactive", label: "Tidak Aktif" },
];

export default function CategoriesIndex() {
  const navigate = useNavigate();
  const { categories, deleteCategory, bulkDeleteCategories } = useCategoryStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCategory) {
      deleteCategory(selectedCategory.id);
      toast.success("Kategori berhasil dihapus");
      setDeleteDialogOpen(false);
      setSelectedCategory(null);
    }
  };

  const handleBulkDelete = (records: Category[]) => {
    const ids = records.map((r) => r.id);
    bulkDeleteCategories(ids);
    toast.success(`${records.length} kategori berhasil dihapus`);
  };

  const columns = [
    {
      accessor: "name" as keyof Category,
      title: "Nama Kategori",
      sortable: true,
    },
    {
      accessor: "description" as keyof Category,
      title: "Deskripsi",
      render: (record: Category) => (
        <span className="text-muted-foreground line-clamp-1">
          {record.description || "-"}
        </span>
      ),
    },
    {
      accessor: "productCount" as keyof Category,
      title: "Jumlah Produk",
      sortable: true,
      render: (record: Category) => <span>{record.productCount} produk</span>,
    },
    {
      accessor: "status" as keyof Category,
      title: "Status",
      sortable: true,
      render: (record: Category) => (
        <Badge variant={record.status === "Active" ? "default" : "secondary"}>
          {record.status === "Active" ? "Aktif" : "Tidak Aktif"}
        </Badge>
      ),
    },
    {
      accessor: "updatedAt" as keyof Category,
      title: "Terakhir Diperbarui",
      sortable: true,
      render: (record: Category) =>
        format(new Date(record.updatedAt), "dd MMM yyyy", { locale: idLocale }),
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <PageSkeleton showCard={false}>
          <Card>
            <CardHeader>
              <TableSkeleton rows={5} columns={5} />
            </CardHeader>
          </Card>
        </PageSkeleton>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Kategori</h1>
            <p className="text-muted-foreground">Kelola kategori produk Anda</p>
          </div>
          <Button onClick={() => navigate("/categories/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kategori
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Kategori</CardTitle>
            <CardDescription>
              Total {categories.length} kategori terdaftar
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <CrudDataTable
              data={categories}
              columns={columns}
              searchPlaceholder="Cari kategori..."
              searchKeys={["name", "description"]}
              filters={[{ key: "status", placeholder: "Status", options: statusFilters }]}
              entityName="kategori"
              defaultSortKey="updatedAt"
              onView={(record) => navigate(`/categories/view/${record.id}`)}
              onEdit={(record) => navigate(`/categories/edit/${record.id}`)}
              onDelete={handleDelete}
              onBulkDelete={handleBulkDelete}
            />
          </CardContent>
        </Card>

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          title="Hapus Kategori"
          description={`Apakah Anda yakin ingin menghapus kategori "${selectedCategory?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        />
      </div>
    </DashboardLayout>
  );
}
