import { useEffect, useState } from "react";

import API from "../api/axios";

import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";

const Dashboard = () => {

const [stats, setStats] = useState({
totalCustomers: 0,
vipCustomers: 0,
totalRevenue: 0,
});

const [recommendation, setRecommendation] =
useState("");

const [recentCustomers, setRecentCustomers] =
useState([]);

const [recentCampaigns, setRecentCampaigns] =
useState([]);

useEffect(() => {
fetchStats();
fetchRecentData();
fetchRecommendation();
}, []);

const fetchStats = async () => {


try {

  const { data } =
    await API.get(
      "/dashboard/stats"
    );

  setStats(data);

} catch (error) {

  console.log(error);

}


};

const fetchRecentData = async () => {


try {

  const { data } =
    await API.get(
      "/dashboard/recent"
    );

  setRecentCustomers(
    data.customers || []
  );

  setRecentCampaigns(
    data.campaigns || []
  );

} catch (error) {

  console.log(error);

}


};

const fetchRecommendation =
async () => {


  try {

    const { data } =
      await API.get(
        "/dashboard/recommendation"
      );

    setRecommendation(
      data.recommendation
    );

  } catch (error) {

    console.log(error);

  }

};


return (
<div
style={{
display: "flex",
}}
> <Sidebar />


  <div
    style={{
      flex: 1,
      padding: "20px",
      background: "#111827",
      color: "white",
      minHeight: "100vh",
    }}
  >

    <h1>
      Dashboard
    </h1>

    <div
      style={{
        display: "flex",
        gap: "20px",
        marginTop: "20px",
        flexWrap: "wrap",
      }}
    >

      <StatCard
        title="Customers"
        value={
          stats.totalCustomers
        }
      />

      <StatCard
        title="VIP Customers"
        value={
          stats.vipCustomers
        }
      />

      <StatCard
        title="Revenue"
        value={`₹${stats.totalRevenue}`}
      />

    </div>

    <div
      style={{
        display: "flex",
        gap: "20px",
        marginTop: "30px",
        flexWrap: "wrap",
      }}
    >

      <div
        style={{
          flex: 1,
          minWidth: "300px",
          background: "#1f2937",
          padding: "20px",
          borderRadius: "12px",
        }}
      >

        <h2>
          Recent Customers
        </h2>

        {recentCustomers.map(
          (customer) => (
            <p
              key={customer._id}
            >
              {customer.name}
            </p>
          )
        )}

      </div>

      <div
        style={{
          flex: 1,
          minWidth: "300px",
          background: "#1f2937",
          padding: "20px",
          borderRadius: "12px",
        }}
      >

        <h2>
          Recent Campaigns
        </h2>

        {recentCampaigns.map(
          (campaign) => (
            <p
              key={campaign._id}
            >
              {
                campaign.campaignName
              }
            </p>
          )
        )}

      </div>

    </div>

    <div
      style={{
        background: "#1f2937",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "30px",
      }}
    >

      <h2>
         AI Recommendation
      </h2>

      <pre
        style={{
          whiteSpace:
            "pre-wrap",
          fontFamily:
            "inherit",
        }}
      >
        {
          recommendation
        }
      </pre>

    </div>

  </div>
</div>


);
};

export default Dashboard;
