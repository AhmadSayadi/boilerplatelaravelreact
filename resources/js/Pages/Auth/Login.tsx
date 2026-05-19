import { useState, useEffect } from "react";
import { useForm, Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowRight, Building2 } from "lucide-react";
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
    <div className="min-h-screen flex">
      <Head title="Login" />

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#f5f2eb] items-center justify-center p-12">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">Pesantren SuperApp</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground leading-tight mb-6">
            Selamat Datang di Ekosistem Digital Pesantren
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Menjembatani nilai-nilai spiritual yang luhur dengan presisi teknologi modern. Silakan masuk untuk mengakses layanan dan informasi terkini.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile branding */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Building2 className="h-7 w-7 text-primary" />
              <span className="text-lg font-bold text-primary">Pesantren SuperApp</span>
            </div>
            <h1 className="text-2xl font-bold">Selamat Datang</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan username Anda"
                value={data.username}
                onChange={(e) => setData("username", e.target.value)}
                required
                autoFocus
                className="h-12"
              />
              {errors.username && <span className="text-sm text-red-500">{errors.username}</span>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Kata Sandi</Label>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Lupa Kata Sandi?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  required
                  className="h-12"
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

            <Button type="submit" className="w-full h-12 text-base" disabled={processing}>
              {processing ? (
                "Memproses..."
              ) : (
                <>
                  Masuk Sekarang
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

         
        </div>
      </div>
    </div>
  );
};

export default Login;
