// src/components/CustomerPieChart.jsx
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts";

const CustomerPieChart = ({ active, inactive }) => {
  const data = [
    { name: "Active", value: active || 0 },
    { name: "Inactive", value: inactive || 0 },
  ];

  const COLORS = ["#22c55e", "#f97316"]; // emerald & orange for dark UI

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={50}
            paddingAngle={3}
            stroke="#020617"
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
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
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomerPieChart;