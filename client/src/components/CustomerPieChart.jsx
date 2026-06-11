import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
} from "recharts";

const CustomerPieChart = ({
  active,
  inactive,
}) => {
  const data = [
    {
      name: "Active",
      value: active,
    },
    {
      name: "Inactive",
      value: inactive,
    },
  ];

  return (
    <PieChart
      width={400}
      height={300}
    >
      <Pie
        data={data}
        dataKey="value"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label
      />

      <Tooltip />

      <Legend />
    </PieChart>
  );
};

export default CustomerPieChart;