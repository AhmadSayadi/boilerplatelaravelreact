import { User } from "@/pages/Users";
import { CrudDataTable, FilterConfig } from "@/components/crud";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UsersTableProps {
  users: User[];
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onBulkDelete?: (users: User[]) => void;
}

export function UsersTable({ users, onView, onEdit, onDelete, onBulkDelete }: UsersTableProps) {
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const filters: FilterConfig[] = [
    {
      key: "status",
      placeholder: "Status",
      options: [
        { value: "all", label: "Semua Status" },
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
    },
    {
      key: "role",
      placeholder: "Role",
      options: [
        { value: "all", label: "Semua Role" },
        { value: "Admin", label: "Admin" },
        { value: "Moderator", label: "Moderator" },
        { value: "User", label: "User" },
      ],
    },
  ];

  return (
    <CrudDataTable<User>
      data={users}
      idAccessor="id"
      entityName="user"
      searchPlaceholder="Cari nama atau email..."
      searchKeys={["name", "email"]}
      filters={filters}
      defaultSortKey="createdAt"
      defaultSortDirection="desc"
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
      onBulkDelete={onBulkDelete}
      columns={[
        {
          accessor: "name",
          title: "Pengguna",
          sortable: true,
          width: 200,
          render: (user) => (
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 flex-shrink-0">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <p className="font-medium truncate">{user.name}</p>
            </div>
          ),
        },
        {
          accessor: "role",
          title: "Peran",
          sortable: true,
          width: 120,
          render: (user) => (
            <Badge
              variant="outline"
              className={cn(
                user.role === "Admin" && "border-primary text-primary",
                user.role === "Moderator" && "border-warning text-warning",
                user.role === "User" && "border-muted-foreground text-muted-foreground",
              )}
            >
              {user.role}
            </Badge>
          ),
        },
        {
          accessor: "email",
          title: "Email",
          sortable: true,
          width: 220,
          render: (user) => <span className="text-muted-foreground">{user.email}</span>,
        },
        {
          accessor: "phone",
          title: "No HP",
          sortable: true,
          width: 150,
          render: (user) => <span className="text-muted-foreground">{user.phone}</span>,
        },
        {
          accessor: "address",
          title: "Alamat",
          sortable: true,
          width: 180,
          render: (user) => <span className="text-muted-foreground">{user.address}</span>,
        },
        {
          accessor: "status",
          title: "Status",
          sortable: true,
          width: 100,
          render: (user) => (
            <Badge
              className={cn(
                "rounded-full",
                user.status === "Active"
                  ? "bg-success/10 text-success hover:bg-success/20"
                  : "bg-muted text-muted-foreground hover:bg-muted",
              )}
            >
              {user.status}
            </Badge>
          ),
        },
      ]}
    />
  );
}
