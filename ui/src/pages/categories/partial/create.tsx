import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

export default function CategoryCreate() {
  const navigate = useNavigate();
  const { addCategory } = useCategoryStore();
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
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (values: CategoryFormValues) => {
    addCategory({
      name: values.name,
      slug: values.name.toLowerCase().replace(/\s+/g, "-"),
      description: values.description || "",
      status: values.status,
      productCount: 0,
    });
    toast.success("Kategori berhasil ditambahkan");
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
            <h1 className="text-2xl font-bold tracking-tight">Tambah Kategori</h1>
            <p className="text-muted-foreground">Buat kategori produk baru</p>
          </div>
        </div>

        {isLoading ? (
          <FormSkeleton fields={3} showHeader={false} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kategori</CardTitle>
              <CardDescription>Masukkan detail kategori baru</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <CategoryForm form={form} />
                  <div className="flex gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={() => navigate("/categories")}>
                      Batal
                    </Button>
                    <Button type="submit">Tambah Kategori</Button>
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
