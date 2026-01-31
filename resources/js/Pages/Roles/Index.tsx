import { useState, useEffect } from "react";
import { router, Head } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CrudDataTable, PaginatedData } from "@/components/crud/CrudDataTable";
import { Role } from "./Types";
import { usePermission } from "@/hooks/usePermission";
import { DeleteConfirmDialog, PageSkeleton, TableSkeleton } from "@/components/crud";

interface RolesIndexProps {
  roles: PaginatedData<Role>;
}

const statusFilters = [
  { value: "all", label: "Semua Status" },
  { value: "Active", label: "Aktif" },
  { value: "Inactive", label: "Tidak Aktif" },
];

const RolesIndex = ({ roles }: RolesIndexProps) => {
  const { hasPermission } = usePermission();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const columns = [
    {
      accessor: "name" as keyof Role,
      title: "Nama Role",
      sortable: true,
    },
    {
      accessor: "group_name" as keyof Role,
      title: "Group",
      sortable: true,
      render: (role: Role) => role.group_name || "-",
    },
    {
      accessor: "permissions" as keyof Role,
      title: "Permissions",
      render: (role: Role) => (
        <div className="flex flex-wrap gap-1">
          {role.permissions.slice(0, 3).map((permission) => (
            <Badge key={permission.id} variant="outline" className="text-xs">
              {permission.display_name || permission.name}
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
      accessor: "created_at" as keyof Role,
      title: "Tanggal Dibuat",
      sortable: true,
      render: (role: Role) => new Date(role.created_at).toLocaleDateString("id-ID"),
    },
  ];

  const handleView = (role: Role) => {
    router.visit(`/roles/view/${role.id}`);
  };

  const handleEdit = (role: Role) => {
    router.visit(`/roles/edit/${role.id}`);
  };

  const handleDelete = (role: Role) => {
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (roleToDelete) {
      router.delete(`/roles/${roleToDelete.id}`, {
        onSuccess: () => {
          toast.success("Peran berhasil dihapus");
          setDeleteDialogOpen(false);
          setRoleToDelete(null);
        },
        onError: () => {
          toast.error("Gagal menghapus peran");
        },
      });
    }
  };

  const handleBulkDelete = (selectedRoles: Role[]) => {
    if (confirm(`Apakah Anda yakin ingin menghapus ${selectedRoles.length} peran yang dipilih?`)) {
      const ids = selectedRoles.map(r => r.id);
      router.post('/roles/bulk-delete', { ids }, {
        onSuccess: () => {
          toast.success(`${selectedRoles.length} peran berhasil dihapus`);
        },
        onError: () => {
          toast.error("Gagal menghapus beberapa peran");
        }
      });
    }
  };

  return (
    <DashboardLayout>
      <Head title="Manajemen Peran" />
      <div className="space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            <PageSkeleton />
            <TableSkeleton />
          </div>
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Daftar Peran</CardTitle>
                <CardDescription>
                  Daftar semua peran yang tersedia dalam sistem.
                </CardDescription>
              </div>
              {hasPermission("create-roles") && (
                <Button onClick={() => router.visit("/roles/create")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Peran
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <CrudDataTable
                data={roles}
                columns={columns}
                searchKeys={["name", "group_name"]}
                filters={[
                  {
                    key: "status",
                    placeholder: "Filter Status",
                    options: statusFilters.map((sf) => ({ value: sf.value, label: sf.label })),
                  },
                ]}
                entityName="role"
          onView={hasPermission("view-roles") ? handleView : undefined}
          onEdit={hasPermission("edit-roles") ? handleEdit : undefined}
          onDelete={hasPermission("delete-roles") ? handleDelete : undefined}
          onBulkDelete={hasPermission("delete-roles") ? handleBulkDelete : undefined}
        />
            </CardContent>
          </Card>
        )}

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
