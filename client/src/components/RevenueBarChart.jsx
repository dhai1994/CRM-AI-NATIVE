import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  Legend, ResponsiveContainer, CartesianGrid,
} from "recharts";

const RevenueBarChart = ({ stats }) => {
  const data = [
    { name: "Revenue",   value: stats.totalRevenue    || 0 },
    { name: "Customers", value: stats.totalCustomers  || 0 },
    { name: "VIP",       value: stats.vipCustomers    || 0 },
  ];

  return (
    <div style={{ width: "100%", height: "240px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 10 }}>
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
          />
          <Tooltip
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
          <Legend wrapperStyle={{ fontSize: "12px", color: "#888", paddingTop: "8px" }} />
          <Bar dataKey="value" name="Value" radius={[6, 6, 0, 0]} fill="#6366F1" maxBarSize={56} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueBarChart;