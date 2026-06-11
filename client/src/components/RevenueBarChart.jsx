import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const RevenueBarChart = ({
  stats,
}) => {

  const data = [
    {
      name: "Revenue",
      value:
        stats.totalRevenue,
    },

    {
      name: "Customers",
      value:
        stats.totalCustomers,
    },

    {
      name: "VIP",
      value:
        stats.vipCustomers,
    },
  ];

  return (
    <BarChart
      width={500}
      height={300}
      data={data}
    >
      <XAxis
        dataKey="name"
      />

      <YAxis />

      <Tooltip />

      <Legend />

      <Bar
        dataKey="value"
      />
    </BarChart>
  );
};

export default RevenueBarChart;