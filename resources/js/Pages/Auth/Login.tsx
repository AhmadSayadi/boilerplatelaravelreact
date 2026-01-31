import { useState, useEffect } from "react";
import { useForm, Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    username: "",
    password: "",
    remember: false,
  });

  useEffect(() => {
    return () => {
      reset("password");
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("login"), {
        onSuccess: () => toast.success("Login berhasil!"),
        onError: () => toast.error("Login gagal, periksa kredensial Anda."),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Masukkan username dan password untuk login
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="username"
                value={data.username}
                onChange={(e) => setData("username", e.target.value)}
                required
                autoFocus
              />
              {errors.username && <span className="text-sm text-red-500">{errors.username}</span>}
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
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={processing}>
              {processing ? (
                "Loading..."
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
