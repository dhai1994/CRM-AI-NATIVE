// src/components/RevenueBarChart.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const RevenueBarChart = ({ stats }) => {
  const data = [
    {
      name: "Revenue",
      value: stats.totalRevenue || 0,
    },
    {
      name: "Customers",
      value: stats.totalCustomers || 0,
    },
    {
      name: "VIP",
      value: stats.vipCustomers || 0,
    },
  ];

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -15, bottom: 10 }}
        >
          <CartesianGrid
            stroke="#111827"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            axisLine={{ stroke: "#27272f" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            axisLine={{ stroke: "#27272f" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              border: "1px solid #27272f",
              borderRadius: "0.75rem",
              fontSize: "11px",
              color: "#e5e7eb",
            }}
          />
          <Legend
            wrapperStyle={{
              fontSize: "11px",
              color: "#9ca3af",
            }}
          />
          <Bar
            dataKey="value"
            name="Value"
            radius={[6, 6, 0, 0]}
            fill="#6366f1"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueBarChart;