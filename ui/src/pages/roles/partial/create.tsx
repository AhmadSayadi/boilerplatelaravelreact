import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const RoleCreate = () => {
  const navigate = useNavigate();
  const { addRole } = useRoleStore();
  const [isLoading, setIsLoading] = useState(true);

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
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = (values: RoleFormValues) => {
    addRole(values);
    toast.success("Role berhasil ditambahkan");
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
            <h1 className="text-3xl font-bold">Tambah Role</h1>
            <p className="text-muted-foreground">Tambah role baru ke sistem</p>
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

export default RoleCreate;
