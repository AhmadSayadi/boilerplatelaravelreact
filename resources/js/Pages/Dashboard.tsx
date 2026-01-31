import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Head } from "@inertiajs/react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { OrdersChart } from "@/components/dashboard/OrdersChart";
import { UsersChart } from "@/components/dashboard/UsersChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { DollarSign, ShoppingBag, Users, Activity } from "lucide-react";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Head title="Dashboard" />
      
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back to your admin panel.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value="$45,231.89"
            change={20.1}
            icon={DollarSign}
            variant="primary"
            delay={0}
          />
          <StatCard
            title="Active Orders"
            value="+2350"
            change={180.1}
            icon={ShoppingBag}
            variant="success"
            delay={100}
          />
          <StatCard
            title="Total Users"
            value="12,234"
            change={19}
            icon={Users}
            variant="warning"
            delay={200}
          />
          <StatCard
            title="Active Now"
            value="+573"
            change={201}
            icon={Activity}
            variant="danger"
            delay={300}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <RevenueChart />
          </div>
          <div className="col-span-3">
            <UsersChart />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-3">
             <OrdersChart />
          </div>
          <div className="col-span-4">
            <RecentActivity />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
