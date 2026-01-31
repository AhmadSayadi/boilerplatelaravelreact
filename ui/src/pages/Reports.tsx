import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { BarChart3 } from "lucide-react";

export default function Reports() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <BarChart3 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Reports & Analytics</h1>
        <p className="text-muted-foreground">Lihat laporan dan analitik</p>
      </div>
    </DashboardLayout>
  );
}
