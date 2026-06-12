import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts";

const CustomerPieChart = ({ active, inactive }) => {
  const data = [
    { name: "Active",   value: active   || 0 },
    { name: "Inactive", value: inactive || 0 },
  ];

  const COLORS = ["#46D369", "#E50914"];

  return (
    <div style={{ width: "100%", height: "240px" }}>
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
            stroke="#0a0a0a"
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
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
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", color: "#888", paddingTop: "8px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomerPieChart;
