import { useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  ArrowUpDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const users = [
  { id: "USR001", name: "John Doe", email: "john@example.com", status: "active", role: "Admin", created: "2024-01-15" },
  { id: "USR002", name: "Jane Smith", email: "jane@example.com", status: "active", role: "Editor", created: "2024-02-20" },
  { id: "USR003", name: "Bob Johnson", email: "bob@example.com", status: "inactive", role: "Viewer", created: "2024-03-10" },
  { id: "USR004", name: "Alice Brown", email: "alice@example.com", status: "active", role: "Editor", created: "2024-03-15" },
  { id: "USR005", name: "Charlie Wilson", email: "charlie@example.com", status: "pending", role: "Viewer", created: "2024-04-01" },
  { id: "USR006", name: "Diana Miller", email: "diana@example.com", status: "active", role: "Admin", created: "2024-04-10" },
  { id: "USR007", name: "Edward Davis", email: "edward@example.com", status: "inactive", role: "Viewer", created: "2024-04-15" },
  { id: "USR008", name: "Fiona Garcia", email: "fiona@example.com", status: "active", role: "Editor", created: "2024-05-01" },
];

const statusStyles = {
  active: "bg-success/10 text-success border-success/20",
  inactive: "bg-muted text-muted-foreground border-border",
  pending: "bg-warning/10 text-warning border-warning/20",
};

export function DataTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const itemsPerPage = 5;

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSelectAll = () => {
    if (selectedRows.length === paginatedUsers.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedUsers.map((u) => u.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-card rounded-xl card-shadow animate-fade-up" style={{ animationDelay: "500ms" }}>
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Users</h3>
            <p className="text-sm text-muted-foreground">Manage your user accounts</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-[200px]"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="p-4 text-left">
                <Checkbox
                  checked={selectedRows.length === paginatedUsers.length && paginatedUsers.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </th>
              <th className="p-4 text-left">
                <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
                  ID <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="p-4 text-left">
                <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
                  Name <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Email</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Role</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Created</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr
                key={user.id}
                className={cn(
                  "border-b border-border hover:bg-secondary/30 transition-colors",
                  selectedRows.includes(user.id) && "bg-primary/5"
                )}
              >
                <td className="p-4">
                  <Checkbox
                    checked={selectedRows.includes(user.id)}
                    onCheckedChange={() => toggleSelectRow(user.id)}
                  />
                </td>
                <td className="p-4 text-sm font-mono text-muted-foreground">{user.id}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-muted-foreground">{user.email}</td>
                <td className="p-4">
                  <Badge
                    variant="outline"
                    className={cn("capitalize", statusStyles[user.status as keyof typeof statusStyles])}
                  >
                    {user.status}
                  </Badge>
                </td>
                <td className="p-4 text-sm">{user.role}</td>
                <td className="p-4 text-sm text-muted-foreground">{user.created}</td>
                <td className="p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="cursor-pointer">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-border flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} entries
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
