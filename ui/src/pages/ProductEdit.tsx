import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useProductStore, Product } from "@/stores/productStore";
import { useEffect } from "react";

const productSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(100, "Nama maksimal 100 karakter"),
  sku: z.string().min(3, "SKU minimal 3 karakter").max(50, "SKU maksimal 50 karakter"),
  category: z.string().min(1, "Kategori harus dipilih"),
  price: z.coerce.number().min(0, "Harga tidak boleh negatif"),
  stock: z.coerce.number().int().min(0, "Stok tidak boleh negatif"),
  description: z.string().max(500, "Deskripsi maksimal 500 karakter").optional(),
  status: z.enum(["Active", "Inactive"]),
  image: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const CATEGORIES = ["Elektronik", "Fashion", "Makanan", "Minuman", "Kesehatan", "Kecantikan", "Olahraga", "Otomotif", "Peralatan Rumah", "Lainnya"];

export default function ProductEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const products = useProductStore((state) => state.products);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const addProduct = useProductStore((state) => state.addProduct);
  
  const isEditMode = !!id;
  const product = isEditMode ? products.find((p) => p.id === id) : null;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      category: "",
      price: 0,
      stock: 0,
      description: "",
      status: "Active",
      image: "",
    },
  });

  useEffect(() => {
    if (product && isEditMode) {
      form.reset({
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: product.price,
        stock: product.stock,
        description: product.description || "",
        status: product.status,
        image: product.image || "",
      });
    }
  }, [product, isEditMode, form]);

  const handleSubmit = (values: ProductFormValues) => {
    if (isEditMode && product) {
      updateProduct(product.id, values);
      toast.success("Produk berhasil diperbarui");
    } else {
      const newProduct: Product = {
        name: values.name,
        sku: values.sku,
        category: values.category,
        price: values.price,
        stock: values.stock,
        description: values.description,
        status: values.status,
        image: values.image,
        id: String(Date.now()),
        createdAt: new Date().toISOString().split("T")[0],
      };
      addProduct(newProduct);
      toast.success("Produk berhasil ditambahkan");
    }
    navigate("/products");
  };

  if (isEditMode && !product) {
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
            <h1 className="text-2xl font-bold">{isEditMode ? "Edit Produk" : "Tambah Produk"}</h1>
            <p className="text-muted-foreground">
              {isEditMode ? "Perbarui informasi produk" : "Tambahkan produk baru ke inventaris"}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informasi Produk</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Produk</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan nama produk" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan SKU" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kategori</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CATEGORIES.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Harga (IDR)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stok</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi (opsional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Masukkan deskripsi produk" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL (opsional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => navigate("/products")}>
                    Batal
                  </Button>
                  <Button type="submit">
                    {isEditMode ? "Simpan Perubahan" : "Tambah Produk"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
