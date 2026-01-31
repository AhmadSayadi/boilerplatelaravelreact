import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User } from "@/pages/Users";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const userSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(100, "Nama maksimal 100 karakter"),
  email: z.string().email("Email tidak valid").max(255, "Email maksimal 255 karakter"),
  phone: z.string().min(10, "No HP minimal 10 digit").max(15, "No HP maksimal 15 digit"),
  address: z.string().min(3, "Alamat minimal 3 karakter").max(255, "Alamat maksimal 255 karakter"),
  role: z.enum(["Admin", "User", "Moderator"]),
  status: z.enum(["Active", "Inactive"]),
  avatar: z.string().optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit" | "view";
  user: User | null;
  onSave: (data: Omit<User, "id" | "createdAt">) => void;
}

export function UserDialog({ open, onOpenChange, mode, user, onSave }: UserDialogProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      role: "User",
      status: "Active",
      avatar: "",
    },
  });

  useEffect(() => {
    if (user && (mode === "edit" || mode === "view")) {
      form.reset({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        status: user.status,
        avatar: user.avatar || "",
      });
    } else {
      form.reset({
        name: "",
        email: "",
        phone: "",
        address: "",
        role: "User",
        status: "Active",
        avatar: "",
      });
    }
  }, [user, mode, form]);

  const handleSubmit = (values: UserFormValues) => {
    onSave({
      name: values.name,
      email: values.email,
      phone: values.phone,
      address: values.address,
      role: values.role,
      status: values.status,
      avatar: values.avatar,
    });
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const title = mode === "create" ? "Tambah User Baru" : mode === "edit" ? "Edit User" : "Detail User";

  // View mode
  if (mode === "view" && user) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex gap-2">
              <Badge
                variant="outline"
                className={cn(
                  user.role === "Admin" && "border-primary text-primary",
                  user.role === "Moderator" && "border-warning text-warning",
                  user.role === "User" && "border-muted-foreground text-muted-foreground"
                )}
              >
                {user.role}
              </Badge>
              <Badge
                className={cn(
                  "rounded-full",
                  user.status === "Active"
                    ? "bg-success/10 text-success"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {user.status}
              </Badge>
            </div>
            <div className="w-full border-t border-border pt-4 mt-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">No HP</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Alamat</p>
                  <p className="font-medium">{user.address}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">ID</p>
                  <p className="font-medium">{user.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tanggal Dibuat</p>
                  <p className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Create/Edit mode
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Masukkan email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No HP</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan no HP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan alamat" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Moderator">Moderator</SelectItem>
                        <SelectItem value="User">User</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL (opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/avatar.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button type="submit">
                {mode === "create" ? "Tambah" : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
