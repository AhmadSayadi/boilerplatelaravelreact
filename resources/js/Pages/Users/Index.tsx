import { useState, useEffect } from "react";
import { router, Head } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CrudDataTable, PaginatedData } from "@/components/crud/CrudDataTable";
import { User } from "./Types";
import { usePermission } from "@/hooks/usePermission";
import { DeleteConfirmDialog } from "@/components/crud/DeleteConfirmDialog";
import { PageSkeleton, TableSkeleton } from "@/components/crud";

interface UsersIndexProps {
  users: PaginatedData<User>;
}

const statusFilters = [
  { value: "all", label: "Semua Status" },
  { value: "active", label: "Aktif" },
  { value: "inactive", label: "Tidak Aktif" },
];

const UsersIndex = ({ users }: UsersIndexProps) => {
  const { hasPermission } = usePermission();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const columns = [
    {
      accessor: "name" as keyof User,
      title: "Nama",
      sortable: true,
      render: (user: User) => (
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-xs text-muted-foreground">@{user.username}</div>
        </div>
      ),
    },
    {
      accessor: "email" as keyof User,
      title: "Email",
      sortable: true,
    },
    {
      accessor: "roles" as keyof User,
      title: "Roles",
      render: (user: User) => (
        <div className="flex flex-wrap gap-1">
          {user.roles.map((role) => (
            <Badge key={role.id} variant="outline" className="text-xs">
              {role.name}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessor: "location" as keyof User,
      title: "Lokasi",
      sortable: true,
      render: (user: User) => user.location || "-",
    },
    {
      accessor: "status" as keyof User,
      title: "Status",
      sortable: true,
      render: (user: User) => (
        <Badge variant={user.status === "active" ? "default" : "secondary"}>
          {user.status === "active" ? "Aktif" : "Tidak Aktif"}
        </Badge>
      ),
    },
    {
      accessor: "created_at" as keyof User,
      title: "Tanggal Dibuat",
      sortable: true,
      render: (user: User) => new Date(user.created_at).toLocaleDateString("id-ID"),
    },
  ];

  const handleView = (user: User) => {
    router.visit(`/users/view/${user.username}`);
  };

  const handleEdit = (user: User) => {
    router.visit(`/users/edit/${user.username}`);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      router.delete(`/users/${userToDelete.username}`, {
        onSuccess: () => {
          toast.success("User berhasil dihapus");
          setDeleteDialogOpen(false);
          setUserToDelete(null);
        },
        onError: () => {
          toast.error("Gagal menghapus user");
        },
      });
    }
  };

  const handleBulkDelete = (selectedUsers: User[]) => {
    if (confirm(`Apakah Anda yakin ingin menghapus ${selectedUsers.length} user yang dipilih?`)) {
      const usernames = selectedUsers.map(u => u.username);
      router.post('/users/bulk-delete', { usernames }, {
        onSuccess: () => {
          toast.success(`${selectedUsers.length} user berhasil dihapus`);
        },
        onError: () => {
          toast.error("Gagal menghapus beberapa user");
        }
      });
    }
  };

  return (
    <DashboardLayout>
      <Head title="Manajemen Pengguna" />
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
                <CardTitle>Daftar Pengguna</CardTitle>
                <CardDescription>
                  Daftar semua pengguna yang terdaftar dalam sistem.
                </CardDescription>
              </div>
              {hasPermission("create-users") && (
                <Button onClick={() => router.visit("/users/create")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Pengguna
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <CrudDataTable
                data={users}
                columns={columns}
                idAccessor="username"
                searchKeys={["name", "username", "email", "location"]}
                filters={[
                  {
                    key: "status",
                    placeholder: "Filter Status",
                    options: statusFilters.map((sf) => ({ value: sf.value, label: sf.label })),
                  },
                ]}
                entityName="user"
          onView={hasPermission("view-users") ? handleView : undefined}
          onEdit={hasPermission("edit-users") ? handleEdit : undefined}
          onDelete={hasPermission("delete-users") ? handleDelete : undefined}
          onBulkDelete={hasPermission("delete-users") ? handleBulkDelete : undefined}
        />
            </CardContent>
          </Card>
        )}

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          title="Hapus User"
          description={`Apakah Anda yakin ingin menghapus user "${userToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        />
      </div>
    </DashboardLayout>
  );
};

export default UsersIndex;
