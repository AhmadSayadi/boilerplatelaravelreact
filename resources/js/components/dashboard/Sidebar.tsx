import { useState, useEffect, useMemo, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
  LayoutDashboard,
  Users,
  LogOut,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Zap,
  UserCog,
  Shield,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePermission } from "@/hooks/usePermission";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

interface MenuItem {
  icon: any;
  label: string;
  path?: string;
  children?: MenuItem[];
  permission?: string;
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", permission: "view-dashboard" },
  {
    icon: Users,
    label: "Manajemen Pengguna",
    children: [
      { icon: UserCog, label: "Pengguna", path: "/users", permission: "view-users" },
      { icon: Shield, label: "Peran", path: "/roles", permission: "view-roles" },
    ],
  },
];

// Helper to get all paths from menu items
const getAllPaths = (items: MenuItem[]): string[] => {
  return items.reduce((acc, item) => {
    if (item.path) acc.push(item.path);
    if (item.children) acc.push(...getAllPaths(item.children));
    return acc;
  }, [] as string[]);
};

const allPaths = getAllPaths(menuItems);

export function Sidebar({ isCollapsed, onToggle, isMobileOpen, onMobileClose }: SidebarProps) {
  const { url } = usePage();
  const { hasPermission } = usePermission();

  const visibleMenuItems = useMemo(() => {
    return menuItems
      .map((item) => {
        if (item.children) {
          const visibleChildren = item.children.filter(
            (child) => !child.permission || hasPermission(child.permission)
          );
          if (visibleChildren.length === 0) return null;
          return { ...item, children: visibleChildren };
        }
        
        if (item.permission && !hasPermission(item.permission)) {
          return null;
        }
        
        return item;
      })
      .filter((item): item is MenuItem => item !== null);
  }, [hasPermission]); // menuItems is constant
  
  // Find the best matching path (longest prefix match)
  const bestMatch = useMemo(() => {
    const matching = allPaths.filter(path => 
      path === "/" ? url === "/" : 
      url === path || url.startsWith(path + "/")
    );
    // Sort by length descending to get most specific
    matching.sort((a, b) => b.length - a.length);
    return matching[0];
  }, [url]);

  // Find which parent menu should be open based on current route
  const getActiveParent = () => {
    if (!bestMatch) return null;
    
    for (const item of visibleMenuItems) {
      if (item.children) {
        const isChildActive = item.children.some((child) => 
          child.path === bestMatch || (child.path && bestMatch.startsWith(child.path + "/"))
        );
        if (isChildActive) return item.label;
      }
    }
    return null;
  };

  const [openMenu, setOpenMenu] = useState<string | null>(() => {
    // Only check initially against visible items might be tricky if state persists but permission lost.
    // But localstorage is for UX.
    if (typeof window !== 'undefined') {
      return localStorage.getItem("sidebarOpenMenu");
    }
    return null;
  });

  const lastActiveParent = useRef<string | null>(null);

  // Sync openMenu with current route
  useEffect(() => {
    const activeParent = getActiveParent();
    if (activeParent && activeParent !== lastActiveParent.current) {
      setOpenMenu(activeParent);
      localStorage.setItem("sidebarOpenMenu", activeParent);
    }
    lastActiveParent.current = activeParent;
  }, [url, visibleMenuItems]); // added visibleMenuItems dependency

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (onMobileClose) {
      onMobileClose();
    }
  }, [url]);

  const toggleMenu = (label: string) => {
    setOpenMenu((prev) => {
      const newState = prev === label ? null : label;
      if (newState) {
        localStorage.setItem("sidebarOpenMenu", newState);
      } else {
        localStorage.removeItem("sidebarOpenMenu");
      }
      return newState;
    });
  };

  const isActiveRoute = (path?: string) => {
    return path === bestMatch;
  };

  const isParentActive = (children?: MenuItem[]) => {
    if (!children) return false;
    return children.some((child) => child.path && isActiveRoute(child.path));
  };

  const NavItem = ({ item, isChild = false }: { item: MenuItem; isChild?: boolean }) => {
    const Icon = item.icon;
    const isActive = isActiveRoute(item.path);
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openMenu === item.label;
    const parentActive = isParentActive(item.children);
    const showLabels = !isCollapsed || isMobileOpen;

    if (hasChildren) {
      if (isCollapsed && !isMobileOpen) {
        return (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer",
                  parentActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              <div className="space-y-1">
                <p className="font-semibold">{item.label}</p>
                {item.children?.map((child) => (
                  <Link
                    key={child.path}
                    href={child.path!}
                    className={cn(
                      "block px-2 py-1 rounded text-sm hover:bg-muted",
                      isActiveRoute(child.path) && "bg-primary text-primary-foreground"
                    )}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        );
      }

      return (
        <Collapsible open={isOpen} onOpenChange={() => toggleMenu(item.label)}>
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                "flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-all duration-200 group",
                parentActive
                  ? "bg-sidebar-primary/10 text-sidebar-foreground"
                  : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("h-5 w-5 flex-shrink-0", parentActive && "text-sidebar-primary")} />
                {showLabels && <span className="font-medium text-sm">{item.label}</span>}
              </div>
              {showLabels && (
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 mt-1 space-y-1">
            {item.children?.map((child) => (
              <NavItem key={child.path} item={child} isChild />
            ))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    const content = (
      <Link
        href={item.path!}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
          isChild && "py-2",
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent"
        )}
      >
        <Icon className={cn("h-5 w-5 flex-shrink-0", isChild && "h-4 w-4", isActive && "text-sidebar-primary-foreground")} />
        {showLabels && (
          <span className={cn("font-medium text-sm truncate", isChild && "text-sm")}>{item.label}</span>
        )}
        {isActive && !isChild && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sidebar-primary-foreground rounded-r-full" />
        )}
      </Link>
    );

    if (isCollapsed && !isChild && !isMobileOpen) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            {/* Wrap Link in a div to ensure ref forwarding works correctly and avoid warnings */}
            <div className="w-full">
              {content}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className={cn(
        "flex items-center h-16 px-4 border-b border-sidebar-border",
        isCollapsed && !isMobileOpen ? "justify-center" : "justify-between"
      )}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <span className="font-bold text-lg text-sidebar-foreground">AdminPanel</span>
          )}
        </div>
        {isMobileOpen && onMobileClose && (
          <Button variant="ghost" size="icon" onClick={onMobileClose} className="lg:hidden h-8 w-8">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-3 space-y-1">
          {visibleMenuItems.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </nav>
      </ScrollArea>

      {/* Logout */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-all duration-200",
            "text-sidebar-muted hover:text-destructive hover:bg-destructive/10"
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {(!isCollapsed || isMobileOpen) && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-sidebar flex-col border-r border-sidebar-border transition-all duration-300 z-50 hidden lg:flex",
          isCollapsed ? "w-[72px]" : "w-64"
        )}
      >
        {sidebarContent}
        
        <Button
          onClick={onToggle}
          className={cn(
            "absolute -right-3 top-7 z-50 hidden h-6 w-6 rounded-full border bg-background p-0 shadow-md lg:flex items-center justify-center",
            "hover:bg-accent hover:text-accent-foreground"
          )}
          variant="outline"
          size="icon"
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-sidebar flex flex-col border-r border-sidebar-border transition-transform duration-300 z-50 lg:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
