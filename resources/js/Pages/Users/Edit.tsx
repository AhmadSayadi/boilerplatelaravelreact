import { useEffect, useState } from "react";
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
import { UserFormValues, User } from "./Types";
import { Role } from "../Roles/Types";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { FormSkeleton } from "@/components/crud";

const formSchema = z.object({
  name: z.string().min(1, "Nama lengkap harus diisi"),
  username: z.string().min(1, "Username harus diisi"),
  email: z.string().email("Email tidak valid"),
  location: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  password: z.string().optional(),
  password_confirmation: z.string().optional(),
  roles: z.array(z.number()).min(1, "Pilih minimal 1 role"),
}).refine((data) => {
  if (data.password && data.password !== data.password_confirmation) {
    return false;
  }
  return true;
}, {
  message: "Password tidak sama",
  path: ["password_confirmation"],
});

interface UserEditProps {
  user: User;
  roles: Role[];
}

const UserEdit = ({ user, roles }: UserEditProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
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
    if (user) {
      form.reset({
        name: user.name,
        username: user.username,
        email: user.email,
        location: user.location || "",
        status: user.status,
        roles: user.roles.map((r) => r.id),
      });
    }
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [user, form]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (values: UserFormValues) => {
    const submitValues = { ...values };
    if (!submitValues.password) {
      delete submitValues.password;
      delete submitValues.password_confirmation;
    }

    setIsSubmitting(true);
    router.put(`/users/${user.username}`, submitValues as any, {
      onSuccess: () => {
        toast.success("User berhasil diperbarui");
      },
      onError: (errors) => {
        toast.error("Gagal memperbarui user");
        console.error(errors);
      },
      onFinish: () => setIsSubmitting(false),
    });
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">User tidak ditemukan</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Head title={`Edit User - ${user.name}`} />
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.visit("/users")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit User</h1>
            <p className="text-muted-foreground">Edit data user {user.name}</p>
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
                  <UserFormFields form={form} roles={roles} isEdit />
                  <div className="flex gap-4 justify-end">
                    <Button type="button" variant="outline" onClick={() => router.visit("/users")} disabled={isSubmitting}>
                      Batal
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Menyimpan..." : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Simpan
                        </>
                      )}
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

export default UserEdit;
