import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const RevenueBarChart = ({ stats }) => {
  const data = [
    {
      name: "Total Revenue",
      value: Number(stats.totalRevenue || 0),
      fill: "#46D369",
    },
  ];

  const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

  return (
    <div style={{ width: "100%", height: "240px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <CartesianGrid stroke="#1a1a1a" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "#666", fontSize: 11 }}
            axisLine={{ stroke: "#2a2a2a" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#666", fontSize: 11 }}
            axisLine={{ stroke: "#2a2a2a" }}
            tickLine={false}
            tickFormatter={(value) => {
              if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
              if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
              if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
              return `₹${value}`;
            }}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(value), "Revenue"]}
            contentStyle={{
              backgroundColor: "#141414",
              border: "1px solid #2a2a2a",
              borderRadius: "10px",
              fontSize: "12px",
              color: "#e8e8e8",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            }}
            itemStyle={{ color: "#e8e8e8" }}
            labelStyle={{ color: "#888" }}
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
          />
          <Bar dataKey="value" name="Revenue" radius={[8, 8, 0, 0]} maxBarSize={88}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueBarChart;