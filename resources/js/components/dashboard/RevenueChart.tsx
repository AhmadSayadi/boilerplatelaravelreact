import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const data = [
  { month: "Jan", revenue: 4000, orders: 240 },
  { month: "Feb", revenue: 3000, orders: 198 },
  { month: "Mar", revenue: 5000, orders: 320 },
  { month: "Apr", revenue: 4500, orders: 278 },
  { month: "May", revenue: 6000, orders: 389 },
  { month: "Jun", revenue: 5500, orders: 349 },
  { month: "Jul", revenue: 7000, orders: 430 },
  { month: "Aug", revenue: 6500, orders: 401 },
  { month: "Sep", revenue: 8000, orders: 512 },
  { month: "Oct", revenue: 7500, orders: 478 },
  { month: "Nov", revenue: 9000, orders: 567 },
  { month: "Dec", revenue: 8500, orders: 534 },
];

export function RevenueChart() {
  return (
    <div className="bg-card rounded-xl p-6 card-shadow animate-fade-up" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Revenue Overview</h3>
          <p className="text-sm text-muted-foreground">Monthly revenue for 2024</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Revenue</span>
          </div>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(239, 84%, 67%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(239, 84%, 67%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(220, 9%, 46%)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(220, 9%, 46%)", fontSize: 12 }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(220, 13%, 91%)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(239, 84%, 67%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
