import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ShoppingCart } from "lucide-react";

export default function Orders() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <ShoppingCart className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Orders Management</h1>
        <p className="text-muted-foreground">Kelola transaksi dan pesanan</p>
      </div>
    </DashboardLayout>
  );
}
