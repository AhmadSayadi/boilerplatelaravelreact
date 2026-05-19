import { router, Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Pencil } from "lucide-react";
import { User } from "./Types";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { usePermission } from "@/hooks/usePermission";

interface UserShowProps {
  user: User;
}

const UserShow = ({ user }: UserShowProps) => {
  const { hasPermission } = usePermission();

  return (
    <DashboardLayout>
      <Head title={`Detail User - ${user.name}`} />
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.visit("/users")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Detail User</h1>
            <p className="text-muted-foreground">Detail informasi user {user.name}</p>
          </div>
          <div className="ml-auto">
            {hasPermission("edit-users") && (
              <Button onClick={() => router.visit(`/users/edit/${user.username}`)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informasi User</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Nama Lengkap</h3>
                <p className="text-lg font-medium">{user.name}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Username</h3>
                <p className="text-lg">{user.username}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                <p className="text-lg">{user.email}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Lokasi</h3>
                <p className="text-lg">{user.location || "-"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                <Badge variant={user.status === "active" ? "default" : "secondary"}>
                  {user.status === "active" ? "Aktif" : "Tidak Aktif"}
                </Badge>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Roles</h3>
                <div className="flex flex-wrap gap-2">
                  {user.roles.map((role) => (
                    <Badge key={role.id} variant="outline">
                      {role.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Tanggal Dibuat</h3>
                <p className="text-lg">{new Date(user.created_at).toLocaleDateString("id-ID", {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Terakhir Diupdate</h3>
                <p className="text-lg">{new Date(user.updated_at).toLocaleDateString("id-ID", {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UserShow;
