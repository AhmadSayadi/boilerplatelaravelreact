import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Premium", value: 2400, color: "hsl(239, 84%, 67%)" },
  { name: "Standard", value: 4567, color: "hsl(142, 76%, 36%)" },
  { name: "Basic", value: 1398, color: "hsl(38, 92%, 50%)" },
  { name: "Free", value: 3200, color: "hsl(220, 9%, 46%)" },
];

export function UsersChart() {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="bg-card rounded-xl p-6 card-shadow animate-fade-up" style={{ animationDelay: "400ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">User Distribution</h3>
          <p className="text-sm text-muted-foreground">By subscription tier</p>
        </div>
      </div>
      <div className="h-[300px] flex items-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(220, 13%, 91%)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: number) => [
                `${value.toLocaleString()} (${((value / total) * 100).toFixed(1)}%)`,
                "Users",
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-muted-foreground">{item.name}</span>
            <span className="text-sm font-medium ml-auto">{item.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
