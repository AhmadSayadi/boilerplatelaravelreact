import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { category: "Electronics", orders: 420, revenue: 52000 },
  { category: "Clothing", orders: 380, revenue: 28000 },
  { category: "Food", orders: 290, revenue: 18500 },
  { category: "Books", orders: 180, revenue: 12000 },
  { category: "Home", orders: 250, revenue: 34000 },
  { category: "Sports", orders: 210, revenue: 26500 },
];

export function OrdersChart() {
  return (
    <div className="bg-card rounded-xl p-6 card-shadow animate-fade-up" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Orders by Category</h3>
          <p className="text-sm text-muted-foreground">Top performing categories</p>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" vertical={false} />
            <XAxis
              dataKey="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(220, 9%, 46%)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(220, 9%, 46%)", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(220, 13%, 91%)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: number, name: string) => [
                name === "orders" ? value : `$${value.toLocaleString()}`,
                name === "orders" ? "Orders" : "Revenue",
              ]}
            />
            <Bar
              dataKey="orders"
              fill="hsl(239, 84%, 67%)"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
