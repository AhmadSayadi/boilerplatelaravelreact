import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useRoleStore } from "@/stores/roleStore";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CrudDataTable, DeleteConfirmDialog, PageSkeleton, TableSkeleton } from "@/components/crud";
import { Role, availablePermissions } from "./types";

const statusFilters = [
  { value: "all", label: "Semua Status" },
  { value: "Active", label: "Aktif" },
  { value: "Inactive", label: "Tidak Aktif" },
];

const RolesIndex = () => {
  const navigate = useNavigate();
  const { roles, deleteRole, bulkDeleteRoles } = useRoleStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const getPermissionLabel = (value: string) => {
    return availablePermissions.find((p) => p.value === value)?.label || value;
  };

  const columns = [
    {
      accessor: "name" as keyof Role,
      title: "Nama Role",
      sortable: true,
    },
    {
      accessor: "description" as keyof Role,
      title: "Deskripsi",
      sortable: true,
    },
    {
      accessor: "permissions" as keyof Role,
      title: "Permissions",
      render: (role: Role) => (
        <div className="flex flex-wrap gap-1">
          {role.permissions.slice(0, 3).map((permission) => (
            <Badge key={permission} variant="outline" className="text-xs">
              {getPermissionLabel(permission)}
            </Badge>
          ))}
          {role.permissions.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{role.permissions.length - 3}
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessor: "status" as keyof Role,
      title: "Status",
      sortable: true,
      render: (role: Role) => (
        <Badge variant={role.status === "Active" ? "default" : "secondary"}>
          {role.status}
        </Badge>
      ),
    },
    {
      accessor: "createdAt" as keyof Role,
      title: "Tanggal Dibuat",
      sortable: true,
    },
  ];

  const handleView = (role: Role) => {
    navigate(`/users/roles/view/${role.id}`);
  };

  const handleEdit = (role: Role) => {
    navigate(`/users/roles/edit/${role.id}`);
  };

  const handleDelete = (role: Role) => {
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (roleToDelete) {
      deleteRole(roleToDelete.id);
      toast.success("Role berhasil dihapus");
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
    }
  };

  const handleBulkDelete = (records: Role[]) => {
    const ids = records.map((r) => r.id);
    bulkDeleteRoles(ids);
    toast.success(`${records.length} role berhasil dihapus`);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <PageSkeleton>
          <TableSkeleton rows={5} columns={5} />
        </PageSkeleton>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-2xl font-bold">Roles</CardTitle>
              <CardDescription>Kelola role dan permissions</CardDescription>
            </div>
            <Button onClick={() => navigate("/users/roles/create")}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Role
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <CrudDataTable<Role>
              data={roles}
              columns={columns}
              searchPlaceholder="Cari role..."
              searchKeys={["name", "description"]}
              filters={[{ key: "status", placeholder: "Status", options: statusFilters }]}
              entityName="role"
              defaultSortKey="createdAt"
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onBulkDelete={handleBulkDelete}
            />
          </CardContent>
        </Card>

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          title="Hapus Role"
          description={`Apakah Anda yakin ingin menghapus role "${roleToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        />
      </div>
    </DashboardLayout>
  );
};

export default RolesIndex;
