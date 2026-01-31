import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: LucideIcon;
  variant?: "primary" | "success" | "warning" | "danger";
  delay?: number;
}

const variantStyles = {
  primary: {
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  success: {
    iconBg: "bg-success/10",
    iconColor: "text-success",
  },
  warning: {
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
  },
  danger: {
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
  },
};

export function StatCard({ title, value, change, icon: Icon, variant = "primary", delay = 0 }: StatCardProps) {
  const isPositive = change >= 0;
  const styles = variantStyles[variant];

  return (
    <div
      className="bg-card rounded-xl p-6 card-shadow hover:card-shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium",
            isPositive ? "text-success" : "text-destructive"
          )}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{isPositive ? "+" : ""}{change}%</span>
            <span className="text-muted-foreground font-normal">vs last month</span>
          </div>
        </div>
        <div className={cn("p-3 rounded-xl", styles.iconBg)}>
          <Icon className={cn("h-6 w-6", styles.iconColor)} />
        </div>
      </div>
    </div>
  );
}
