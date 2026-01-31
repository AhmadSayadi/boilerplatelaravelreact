import { router, Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Role } from "./Types";
import { usePermission } from "@/hooks/usePermission";

interface RoleShowProps {
  role: Role;
}

const RoleShow = ({ role }: RoleShowProps) => {
  const { hasPermission } = usePermission();

  return (
    <DashboardLayout>
      <Head title={`Detail Role - ${role.name}`} />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.visit("/roles")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Detail Role</h1>
              <p className="text-muted-foreground">Informasi lengkap role</p>
            </div>
          </div>
          {hasPermission("edit-roles") && (
            <Button onClick={() => router.visit(`/roles/edit/${role.id}`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{role.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Nama Role</p>
                <p className="font-medium">{role.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Group</p>
                <p className="font-medium">{role.group_name || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={role.status === "Active" ? "default" : "secondary"}>
                  {role.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tanggal Dibuat</p>
                <p className="font-medium">{new Date(role.created_at).toLocaleDateString("id-ID")}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Permissions</p>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission) => (
                  <Badge key={permission.id} variant="outline">
                    {permission.display_name || permission.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RoleShow;
