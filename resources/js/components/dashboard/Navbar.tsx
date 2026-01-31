import { useState } from "react";
import { useTheme } from "next-themes";
import { usePage, router } from "@inertiajs/react";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Moon,
  Sun,
  Menu,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { auth } = usePage().props as any;
  const user = auth.user;
  const [notificationCount] = useState(5);
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    router.post(route('logout'));
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Left side - Hamburger + Search */}
        <div className="flex items-center gap-3 flex-1">
          {/* Hamburger Menu - Mobile Only */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search */}
          <div className="relative w-full max-w-md hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari sesuatu..."
              className="pl-10 bg-secondary/50 border-transparent focus:border-primary focus:bg-card h-10"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile Search Button */}
          <Button variant="ghost" size="icon" className="sm:hidden">
            <Search className="h-5 w-5" />
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                {notificationCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs font-medium flex items-center justify-center animate-pulse-soft">
                    {notificationCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-popover">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="font-semibold">Notifications</span>
                <Badge variant="secondary">{notificationCount} new</Badge>
              </div>
              <div className="py-2">
                {[
                  { title: "New user registered", time: "2 min ago", type: "info" },
                  { title: "Order #1234 completed", time: "1 hour ago", type: "success" },
                  { title: "Payment failed", time: "3 hours ago", type: "error" },
                ].map((notif, i) => (
                  <DropdownMenuItem key={i} className="px-4 py-3 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full mt-2",
                        notif.type === "success" && "bg-success",
                        notif.type === "error" && "bg-destructive",
                        notif.type === "info" && "bg-primary"
                      )} />
                      <div>
                        <p className="text-sm font-medium">{notif.title}</p>
                        <p className="text-xs text-muted-foreground">{notif.time}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <div className="p-2 border-t border-border">
                <Button variant="ghost" className="w-full text-primary text-sm">
                  Lihat semua notifikasi
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.roles?.[0]?.name || "User"}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover">
              <div className="px-3 py-2 border-b border-border">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <DropdownMenuItem className="cursor-pointer" onClick={() => router.visit(route('profile.edit'))}>
                <User className="h-4 w-4 mr-2" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
