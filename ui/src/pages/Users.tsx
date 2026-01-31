import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { UsersTable } from "@/components/users/UsersTable";
import { UserDialog } from "@/components/users/UserDialog";
import { DeleteUserDialog } from "@/components/users/DeleteUserDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: "Admin" | "User" | "Moderator";
  status: "Active" | "Inactive";
  createdAt: string;
  avatar?: string;
}

const initialUsers: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com", phone: "081234567890", address: "Jakarta Selatan", role: "Admin", status: "Active", createdAt: "2024-01-15", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", phone: "081234567891", address: "Bandung", role: "User", status: "Active", createdAt: "2024-02-20", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
  { id: "3", name: "Bob Wilson", email: "bob@example.com", phone: "081234567892", address: "Surabaya", role: "Moderator", status: "Active", createdAt: "2024-03-10" },
  { id: "4", name: "Alice Brown", email: "alice@example.com", phone: "081234567893", address: "Yogyakarta", role: "User", status: "Inactive", createdAt: "2024-01-25", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
  { id: "5", name: "Charlie Davis", email: "charlie@example.com", phone: "081234567894", address: "Semarang", role: "User", status: "Active", createdAt: "2024-04-05" },
  { id: "6", name: "Eva Martinez", email: "eva@example.com", phone: "081234567895", address: "Medan", role: "Admin", status: "Active", createdAt: "2024-02-14", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" },
  { id: "7", name: "Frank Lee", email: "frank@example.com", phone: "081234567896", address: "Makassar", role: "User", status: "Inactive", createdAt: "2024-03-22" },
  { id: "8", name: "Grace Kim", email: "grace@example.com", phone: "081234567897", address: "Denpasar", role: "Moderator", status: "Active", createdAt: "2024-01-08", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop" },
  { id: "9", name: "Henry Zhang", email: "henry@example.com", phone: "081234567898", address: "Malang", role: "User", status: "Active", createdAt: "2024-04-12", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
  { id: "10", name: "Ivy Chen", email: "ivy@example.com", phone: "081234567899", address: "Palembang", role: "User", status: "Active", createdAt: "2024-03-18" },
  { id: "11", name: "Jack Thompson", email: "jack@example.com", phone: "081234567800", address: "Balikpapan", role: "Moderator", status: "Active", createdAt: "2024-02-28", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
  { id: "12", name: "Karen White", email: "karen@example.com", phone: "081234567801", address: "Pontianak", role: "User", status: "Inactive", createdAt: "2024-01-30" },
  { id: "13", name: "Leo Garcia", email: "leo@example.com", phone: "081234567802", address: "Manado", role: "User", status: "Active", createdAt: "2024-04-02", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" },
  { id: "14", name: "Mia Johnson", email: "mia@example.com", phone: "081234567803", address: "Banjarmasin", role: "Admin", status: "Active", createdAt: "2024-03-05", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" },
  { id: "15", name: "Nathan Brown", email: "nathan@example.com", phone: "081234567804", address: "Batam", role: "User", status: "Active", createdAt: "2024-02-10" },
  { id: "16", name: "Olivia Taylor", email: "olivia@example.com", phone: "081234567805", address: "Pekanbaru", role: "User", status: "Inactive", createdAt: "2024-01-22", avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&h=100&fit=crop" },
  { id: "17", name: "Peter Anderson", email: "peter@example.com", phone: "081234567806", address: "Padang", role: "Moderator", status: "Active", createdAt: "2024-04-08" },
  { id: "18", name: "Quinn Harris", email: "quinn@example.com", phone: "081234567807", address: "Jambi", role: "User", status: "Active", createdAt: "2024-03-15", avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop" },
  { id: "19", name: "Rachel Clark", email: "rachel@example.com", phone: "081234567808", address: "Lampung", role: "User", status: "Active", createdAt: "2024-02-05" },
  { id: "20", name: "Sam Wilson", email: "sam@example.com", phone: "081234567809", address: "Cirebon", role: "User", status: "Inactive", createdAt: "2024-01-18", avatar: "https://images.unsplash.com/photo-1546961342-ea5f71b193f3?w=100&h=100&fit=crop" },
  { id: "21", name: "Tina Roberts", email: "tina@example.com", phone: "081234567810", address: "Solo", role: "Admin", status: "Active", createdAt: "2024-04-15", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop" },
  { id: "22", name: "Victor Lee", email: "victor@example.com", phone: "081234567811", address: "Bogor", role: "User", status: "Active", createdAt: "2024-03-28" },
  { id: "23", name: "Wendy Moore", email: "wendy@example.com", phone: "081234567812", address: "Tangerang", role: "Moderator", status: "Active", createdAt: "2024-02-22", avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop" },
  { id: "24", name: "Xavier Young", email: "xavier@example.com", phone: "081234567813", address: "Bekasi", role: "User", status: "Inactive", createdAt: "2024-01-12" },
  { id: "25", name: "Yuki Tanaka", email: "yuki@example.com", phone: "081234567814", address: "Depok", role: "User", status: "Active", createdAt: "2024-04-20", avatar: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=100&h=100&fit=crop" },
];

export default function Users() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">("create");

  const handleCreate = () => {
    setSelectedUser(null);
    setDialogMode("create");
    setIsDialogOpen(true);
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setDialogMode("view");
    setIsDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = (userData: Omit<User, "id" | "createdAt">) => {
    if (dialogMode === "create") {
      const newUser: User = {
        ...userData,
        id: String(Date.now()),
        createdAt: new Date().toISOString().split("T")[0],
      };
      setUsers([newUser, ...users]);
      toast.success("User berhasil ditambahkan");
    } else if (dialogMode === "edit" && selectedUser) {
      setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, ...userData } : u)));
      toast.success("User berhasil diperbarui");
    }
    setIsDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      toast.success("User berhasil dihapus");
    }
    setIsDeleteDialogOpen(false);
  };

  const handleBulkDelete = (usersToDelete: User[]) => {
    const ids = usersToDelete.map((u) => u.id);
    setUsers(users.filter((u) => !ids.includes(u.id)));
    toast.success(`${usersToDelete.length} user berhasil dihapus`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
            <div>
              <CardTitle className="text-2xl">Users Management</CardTitle>
              <CardDescription>Kelola data pengguna sistem</CardDescription>
            </div>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah User
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <UsersTable
              users={users}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onBulkDelete={handleBulkDelete}
            />
          </CardContent>
        </Card>

        {/* Dialogs */}
        <UserDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          mode={dialogMode}
          user={selectedUser}
          onSave={handleSave}
        />

        <DeleteUserDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          user={selectedUser}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </DashboardLayout>
  );
}
