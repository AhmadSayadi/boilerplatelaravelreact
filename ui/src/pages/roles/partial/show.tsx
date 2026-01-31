import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from "lucide-react";
import { useRoleStore } from "@/stores/roleStore";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { availablePermissions } from "../types";

const RoleShow = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRoleById } = useRoleStore();

  const role = getRoleById(id || "");

  if (!role) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Role tidak ditemukan</p>
        </div>
      </DashboardLayout>
    );
  }

  const getPermissionLabel = (value: string) => {
    return availablePermissions.find((p) => p.value === value)?.label || value;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/users/roles")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Detail Role</h1>
              <p className="text-muted-foreground">Informasi lengkap role</p>
            </div>
          </div>
          <Button onClick={() => navigate(`/users/roles/edit/${role.id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
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
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={role.status === "Active" ? "default" : "secondary"}>
                  {role.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tanggal Dibuat</p>
                <p className="font-medium">{role.createdAt}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Deskripsi</p>
              <p className="font-medium">{role.description}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Permissions</p>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission) => (
                  <Badge key={permission} variant="outline">
                    {getPermissionLabel(permission)}
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
