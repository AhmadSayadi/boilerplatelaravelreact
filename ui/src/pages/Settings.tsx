import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <SettingsIcon className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Pengaturan sistem dan preferensi</p>
      </div>
    </DashboardLayout>
  );
}
