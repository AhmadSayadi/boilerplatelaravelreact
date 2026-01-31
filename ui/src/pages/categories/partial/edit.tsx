import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { useCategoryStore } from "@/stores/categoryStore";
import { CategoryForm } from "./form";
import { CategoryFormValues } from "../types";
import { FormSkeleton } from "@/components/crud";

const categorySchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi"),
  description: z.string().optional().default(""),
  status: z.enum(["Active", "Inactive"]),
});

export default function CategoryEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories, updateCategory } = useCategoryStore();
  const category = categories.find((c) => c.id === id);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      status: "Active",
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description,
        status: category.status,
      });
    }
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [category, form]);

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

  const handleSubmit = (values: CategoryFormValues) => {
    updateCategory(id!, {
      name: values.name,
      description: values.description || "",
      status: values.status,
    });
    toast.success("Kategori berhasil diperbarui");
    navigate("/categories");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/categories")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Kategori</h1>
            <p className="text-muted-foreground">Perbarui informasi kategori</p>
          </div>
        </div>

        {isLoading ? (
          <FormSkeleton fields={3} showHeader={false} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kategori</CardTitle>
              <CardDescription>Edit detail kategori</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <CategoryForm form={form} />
                  <div className="flex gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={() => navigate("/categories")}>
                      Batal
                    </Button>
                    <Button type="submit">Simpan Perubahan</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
