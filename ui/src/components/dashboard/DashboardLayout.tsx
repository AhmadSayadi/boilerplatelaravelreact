import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div
        className={cn(
          "transition-all duration-300",
          "lg:ml-64",
          sidebarCollapsed && "lg:ml-[72px]"
        )}
      >
        <Navbar onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="p-4 md:p-6">{children}</main>
        <footer className="p-4 md:p-6 border-t border-border text-center text-sm text-muted-foreground">
          © 2024 AdminPanel. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
