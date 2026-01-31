import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, useTheme } from "next-themes";
import { MantineProvider, createTheme } from "@mantine/core";
import Index from "./pages/Index";
import Users from "./pages/Users";
import Products from "./pages/Products";
import ProductView from "./pages/ProductView";
import ProductEdit from "./pages/ProductEdit";
import CategoriesIndex from "./pages/categories/index";
import CategoryShow from "./pages/categories/partial/show";
import CategoryEdit from "./pages/categories/partial/edit";
import CategoryCreate from "./pages/categories/partial/create";
import RolesIndex from "./pages/roles/index";
import RoleShow from "./pages/roles/partial/show";
import RoleEdit from "./pages/roles/partial/edit";
import RoleCreate from "./pages/roles/partial/create";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Orders from "./pages/Orders";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Components from "./pages/Components";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const mantineTheme = createTheme({
  primaryColor: "indigo",
  fontFamily: "Inter, sans-serif",
});

function MantineWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  
  return (
    <MantineProvider 
      theme={mantineTheme} 
      forceColorScheme={resolvedTheme === "dark" ? "dark" : "light"}
    >
      {children}
    </MantineProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MantineWrapper>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/add" element={<Users />} />
              <Route path="/users/roles" element={<RolesIndex />} />
              <Route path="/users/roles/create" element={<RoleCreate />} />
              <Route path="/users/roles/view/:id" element={<RoleShow />} />
              <Route path="/users/roles/edit/:id" element={<RoleEdit />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/add" element={<ProductEdit />} />
              <Route path="/products/view/:id" element={<ProductView />} />
              <Route path="/products/edit/:id" element={<ProductEdit />} />
              <Route path="/products/inventory" element={<Products />} />
              <Route path="/categories" element={<CategoriesIndex />} />
              <Route path="/categories/create" element={<CategoryCreate />} />
              <Route path="/categories/view/:id" element={<CategoryShow />} />
              <Route path="/categories/edit/:id" element={<CategoryEdit />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/reports/sales" element={<Reports />} />
              <Route path="/reports/export" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/components" element={<Components />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </MantineWrapper>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
