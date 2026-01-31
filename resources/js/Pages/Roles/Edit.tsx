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
import { RoleFormFields } from "./Partial/Form";
import { RoleFormValues, Role, Permission } from "./Types";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { FormSkeleton } from "@/components/crud";

const formSchema = z.object({
  name: z.string().min(1, "Nama role harus diisi"),
  group_name: z.string().optional(),
  permissions: z.array(z.number()).min(1, "Pilih minimal 1 permission"),
  status: z.enum(["Active", "Inactive"]),
});

interface RoleEditProps {
  role: Role;
  permissions: Record<string, Permission[]>;
}

const RoleEdit = ({ role, permissions }: RoleEditProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      group_name: "",
      permissions: [],
      status: "Active",
    },
  });

  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name,
        group_name: role.group_name || "",
        permissions: role.permissions.map((p) => p.id),
        status: role.status,
      });
    }
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [role, form]);

  const onSubmit = (values: RoleFormValues) => {
    router.put(`/roles/${role.id}`, values as any, {
      onSuccess: () => {
        toast.success("Role berhasil diperbarui");
      },
      onError: (errors) => {
        toast.error("Gagal memperbarui role");
        console.error(errors);
      },
    });
  };

  if (!role) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Role tidak ditemukan</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Head title={`Edit Role - ${role.name}`} />
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.visit("/roles")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Role</h1>
            <p className="text-muted-foreground">Edit data role {role.name}</p>
          </div>
        </div>

        {isLoading ? (
          <FormSkeleton fields={4} showHeader={false} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Form Role</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <RoleFormFields form={form} permissions={permissions} />
                  <div className="flex gap-4 justify-end">
                    <Button type="button" variant="outline" onClick={() => router.visit("/roles")}>
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

export default RoleEdit;
