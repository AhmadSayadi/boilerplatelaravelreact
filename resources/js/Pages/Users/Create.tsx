import { useState, useEffect } from "react";
import { router, Head } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { UserFormFields } from "./Partial/Form";
import { UserFormValues } from "./Types";
import { Role } from "../Roles/Types";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { FormSkeleton } from "@/components/crud";

const formSchema = z.object({
  name: z.string().min(1, "Nama lengkap harus diisi"),
  username: z.string().min(1, "Username harus diisi"),
  email: z.string().email("Email tidak valid"),
  location: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  password: z.string().min(8, "Password minimal 8 karakter"),
  password_confirmation: z.string().min(8, "Konfirmasi password minimal 8 karakter"),
  roles: z.array(z.number()).min(1, "Pilih minimal 1 role"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Password tidak sama",
  path: ["password_confirmation"],
});

interface UserCreateProps {
  roles: Role[];
}

const UserCreate = ({ roles }: UserCreateProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: "",
      username: "",
      email: "",
      location: "",
      status: "active",
      password: "",
      password_confirmation: "",
      roles: [],
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = (values: UserFormValues) => {
    router.post("/users", values as any, {
      onSuccess: () => {
        toast.success("User berhasil ditambahkan");
      },
      onError: (errors) => {
        toast.error("Gagal menambahkan user");
        console.error(errors);
      },
    });
  };

  return (
    <DashboardLayout>
      <Head title="Tambah User Baru" />
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.visit("/users")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Tambah User</h1>
            <p className="text-muted-foreground">Tambah pengguna baru ke sistem</p>
          </div>
        </div>

        {isLoading ? (
          <FormSkeleton fields={6} showHeader={false} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Form User</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <UserFormFields form={form as any} roles={roles} />
                  <div className="flex gap-4 justify-end">
                    <Button type="button" variant="outline" onClick={() => router.visit("/users")}>
                      Batal
                    </Button>
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Simpan
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserCreate;
