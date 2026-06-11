import {
 useEffect,
 useState
} from "react";

import API from "../api/axios";

import Sidebar from "../components/Sidebar";
import CustomerPieChart from "../components/CustomerPieChart";

import RevenueBarChart from "../components/RevenueBarChart";

const Analytics = () => {

 const [stats,
 setStats] =
 useState({});

 const [insights,
 setInsights] =
 useState("");

 useEffect(() => {

  loadAnalytics();

 }, []);

 const loadAnalytics =
 async () => {

  try {

   const { data } =
    await API.get(
      "/analytics"
    );

   setStats(data);

   const insightData =
    await API.post(
      "/analytics/insights",
      data
    );

   setInsights(
    insightData.data.insights
   );

  } catch(error){

   console.log(error);

  }
 };

 return (
  <div
   style={{
    display:"flex"
   }}
  >

   <Sidebar />

   <div
    style={{
     flex:1,
     padding:"20px",
     background:"#111827",
     color:"white",
     minHeight:"100vh"
    }}
   >

    <h1>
     Analytics
    </h1>

    <h3>
     Total Customers:
     {stats.totalCustomers}
    </h3>

    <h3>
     VIP Customers:
     {stats.vipCustomers}
    </h3>

    <h3>
     Active Customers:
     {stats.activeCustomers}
    </h3>

    <h3>
     Inactive Customers:
     {stats.inactiveCustomers}
    </h3>

    <h3>
 Revenue:
 ₹{stats.totalRevenue}
</h3>

<hr />

<h2>Customer Distribution</h2>

<CustomerPieChart
 active={stats.activeCustomers}
 inactive={stats.inactiveCustomers}
/>

<hr />

<h2>Revenue Analytics</h2>

<RevenueBarChart
 stats={stats}
/>

<hr />

    <hr />

    <h2>
     AI Insights
    </h2>

    <pre>
     {insights}
    </pre>

   </div>
  </div>
 );
};

export default Analytics;