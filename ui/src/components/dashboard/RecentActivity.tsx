import {
  UserPlus,
  ShoppingCart,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    type: "user",
    icon: UserPlus,
    title: "New user registered",
    description: "John Doe created an account",
    time: "2 minutes ago",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: 2,
    type: "order",
    icon: ShoppingCart,
    title: "New order placed",
    description: "Order #1234 - $299.00",
    time: "15 minutes ago",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    id: 3,
    type: "payment",
    icon: CreditCard,
    title: "Payment received",
    description: "Invoice #5678 paid - $1,250.00",
    time: "1 hour ago",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    id: 4,
    type: "alert",
    icon: AlertTriangle,
    title: "Low stock alert",
    description: "Product SKU-001 is running low",
    time: "2 hours ago",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    id: 5,
    type: "system",
    icon: CheckCircle,
    title: "System backup completed",
    description: "Daily backup finished successfully",
    time: "3 hours ago",
    color: "text-muted-foreground",
    bgColor: "bg-secondary",
  },
  {
    id: 6,
    type: "pending",
    icon: Clock,
    title: "Order pending review",
    description: "Order #1235 needs approval",
    time: "4 hours ago",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
];

export function RecentActivity() {
  return (
    <div className="bg-card rounded-xl p-6 card-shadow animate-fade-up" style={{ animationDelay: "600ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Latest system events and logs</p>
        </div>
        <button className="text-sm text-primary font-medium hover:underline">
          View all
        </button>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <div className={cn("p-2 rounded-lg", activity.bgColor)}>
              <activity.icon className={cn("h-4 w-4", activity.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{activity.title}</p>
              <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
