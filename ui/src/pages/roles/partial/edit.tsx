import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { useRoleStore } from "@/stores/roleStore";
import { RoleFormFields } from "./form";
import { RoleFormValues } from "../types";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { FormSkeleton } from "@/components/crud";

const formSchema = z.object({
  name: z.string().min(1, "Nama role harus diisi"),
  description: z.string().min(1, "Deskripsi harus diisi"),
  permissions: z.array(z.string()).min(1, "Pilih minimal 1 permission"),
  status: z.enum(["Active", "Inactive"]),
});

const RoleEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRoleById, updateRole } = useRoleStore();
  const [isLoading, setIsLoading] = useState(true);

  const role = getRoleById(id || "");

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
      status: "Active",
    },
  });

  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        status: role.status,
      });
    }
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [role, form]);

  if (!role) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Role tidak ditemukan</p>
        </div>
      </DashboardLayout>
    );
  }

  const onSubmit = (values: RoleFormValues) => {
    updateRole(id!, values);
    toast.success("Role berhasil diperbarui");
    navigate("/users/roles");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/users/roles")}>
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
                  <RoleFormFields form={form} />
                  <div className="flex gap-4">
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Simpan
                    </Button>
                    <Button type="button" variant="outline" onClick={() => navigate("/users/roles")}>
                      Batal
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
