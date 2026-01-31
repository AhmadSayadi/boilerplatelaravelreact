import {
  Users,
  ShoppingCart,
  DollarSign,
  UserCheck,
  Clock,
  TrendingUp,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { OrdersChart } from "@/components/dashboard/OrdersChart";
import { UsersChart } from "@/components/dashboard/UsersChart";
import { DataTable } from "@/components/dashboard/DataTable";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

const stats = [
  { title: "Total Users", value: "12,456", change: 12.5, icon: Users, variant: "primary" as const },
  { title: "Total Orders", value: "8,234", change: 8.2, icon: ShoppingCart, variant: "success" as const },
  { title: "Total Revenue", value: "$284,520", change: 15.3, icon: DollarSign, variant: "warning" as const },
  { title: "Active Users", value: "4,521", change: -2.4, icon: UserCheck, variant: "primary" as const },
  { title: "Pending Orders", value: "126", change: -5.1, icon: Clock, variant: "danger" as const },
  { title: "Growth Rate", value: "23.5%", change: 18.7, icon: TrendingUp, variant: "success" as const },
];

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="animate-fade-up">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {stats.map((stat, index) => (
            <StatCard key={stat.title} {...stat} delay={index * 50} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart />
          <OrdersChart />
        </div>

        {/* Users Chart & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <UsersChart />
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
        </div>

        {/* Data Table */}
        <DataTable />
      </div>
    </DashboardLayout>
  );
};

export default Index;
