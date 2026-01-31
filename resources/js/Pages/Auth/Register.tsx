import { useState, useEffect } from "react";
import { Link, useForm, Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { toast } from "sonner";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    return () => {
      reset("password", "password_confirmation");
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("register"), {
        onSuccess: () => toast.success("Registrasi berhasil!"),
        onError: () => toast.error("Registrasi gagal, periksa data Anda."),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Head title="Daftar" />
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Daftar</CardTitle>
          <CardDescription>
            Buat akun baru untuk memulai
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                required
                autoFocus
              />
              {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                value={data.username}
                onChange={(e) => setData("username", e.target.value)}
                required
              />
              {errors.username && <span className="text-sm text-red-500">{errors.username}</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@example.com"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                required
              />
              {errors.email && <span className="text-sm text-red-500">{errors.email}</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password && <span className="text-sm text-red-500">{errors.password}</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
              <Input
                id="password_confirmation"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={data.password_confirmation}
                onChange={(e) => setData("password_confirmation", e.target.value)}
                required
              />
              {errors.password_confirmation && <span className="text-sm text-red-500">{errors.password_confirmation}</span>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={processing}>
              {processing ? (
                "Loading..."
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Daftar
                </>
              )}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Sudah punya akun?{" "}
              <Link href={route("login")} className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
