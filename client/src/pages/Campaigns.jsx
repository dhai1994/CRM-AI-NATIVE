import {
  useEffect,
  useState,
} from "react";

import API from "../api/axios";

import Sidebar from "../components/Sidebar";

import {
 useNavigate
}
from "react-router-dom";

const Campaigns = () => {

  const [campaigns,
    setCampaigns] =
    useState([]);

  useEffect(() => {

    fetchCampaigns();

  }, []);

  const navigate =
 useNavigate();

  const fetchCampaigns =
    async () => {

      try {

        const { data } =
          await API.get(
            "/campaigns"
          );

        setCampaigns(data);

      } catch (error) {

        console.log(error);

      }
    };

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          padding: "20px",
          background:
            "#111827",
          color: "white",
          minHeight:
            "100vh",
        }}
      >
        <h1>
          Campaign History
        </h1>

        <table
          border="1"
          cellPadding="10"
        >
          <thead>
  <tr>
    <th>Name</th>
    <th>Goal</th>
    <th>Status</th>
    <th>View</th>
    <th>Send</th>
  </tr>
</thead>

          <tbody>
  {campaigns.map((campaign) => (
    <tr key={campaign._id}>
      <td>{campaign.campaignName}</td>

      <td>{campaign.goal}</td>

      <td>

 <span
  style={{
   color:
    campaign.status ===
    "Sent"

    ? "#22c55e"

    : campaign.status ===
      "Failed"

    ? "#ef4444"

    : "#f59e0b",

   fontWeight:"bold"
  }}
 >

  {campaign.status}

 </span>

</td>

      <td>
        <button  style={{

 background:
  "#2563eb",

 color:"white",

 border:"none",

 padding:
  "10px 20px",

 borderRadius:
  "10px",

 cursor:
  "pointer"
}}
          onClick={() =>
            navigate(
              `/campaign/${campaign._id}`
            )
          }
        >
          View
        </button>
      </td>

      <td>
        <button style={{

 background:
  "#2563eb",

 color:"white",

 border:"none",

 padding:
  "10px 20px",

 borderRadius:
  "10px",

 cursor:
  "pointer"
}}
          onClick={() =>
            sendCampaign(
              campaign
            )
          }
        >
          Send
        </button>
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>
    </div>
  );
};

export default Campaigns;
