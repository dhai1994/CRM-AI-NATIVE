import { useState } from "react";

import API from "../api/axios";

import Sidebar from "../components/Sidebar";

import AgentCard from "../components/AgentCard";

import { TailSpin } from "react-loader-spinner";

const Agent = () => {

const [goal, setGoal] =
useState("");

const [loading, setLoading] =
useState(false);

const [logs, setLogs] =
useState([]);

const [result, setResult] =
useState(null);

const addLog = (message) => {


const time =
  new Date()
    .toLocaleTimeString();

setLogs((prev) => [
  ...prev,
  `${time} - ${message}`,
]);


};

const generateCampaign =
async () => {


  try {

    setLoading(true);

    setResult(null);

    setLogs([]);

    addLog(
      "Planner Agent Started"
    );

    const planner =
      await API.post(
        "/ai/planner",
        { goal }
      );

    addLog(
      "Planner Agent Completed"
    );

    addLog(
      "Segment Agent Started"
    );

    const segment =
      await API.post(
        "/ai/segment",
        { goal }
      );

    addLog(
      "Segment Agent Completed"
    );

    addLog(
      "Campaign Agent Started"
    );

    const campaign =
      await API.post(
        "/ai/campaign",
        { goal }
      );

    addLog(
      "Campaign Agent Completed"
    );

    addLog(
      "Analytics Agent Started"
    );

    const stats =
      await API.get(
        "/analytics"
      );

    const analytics =
      await API.post(
        "/ai/analytics",
        {
          goal,
          stats:
            stats.data,
        }
      );

    addLog(
      "Analytics Agent Completed"
    );

    addLog(
      "Campaign Generated Successfully"
    );

    setResult({
      planner:
        planner.data,
      segment:
        segment.data,
      campaign:
        campaign.data,
      analytics:
        analytics.data,
    });

  } catch (error) {

    console.log(error);

    addLog(
      "Agent Failed"
    );

  } finally {

    setLoading(false);

  }

};


const saveCampaign =
async () => {


  try {

    await API.post(
      "/campaigns",
      {
        campaignName:
          "AI Generated Campaign",

        goal,

        planner:
          typeof result.planner ===
          "string"
            ? result.planner
            : JSON.stringify(
                result.planner
              ),

        segment:
          typeof result.segment ===
          "string"
            ? result.segment
            : JSON.stringify(
                result.segment
              ),

        campaignContent:
          typeof result.campaign ===
          "string"
            ? result.campaign
            : JSON.stringify(
                result.campaign
              ),
      }
    );

    alert(
      "Campaign Saved"
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

```
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
      AI Agent
    </h1>

    <div
      style={{
        background:
          "#1f2937",
        padding:
          "15px",
        borderRadius:
          "10px",
        marginTop:
          "20px",
      }}
    >

      <h3>
        Agent Timeline
      </h3>

      {logs.map(
        (
          log,
          index
        ) => (
          <div
            key={index}
            style={{
              background:
                "#374151",
              padding:
                "10px",
              marginBottom:
                "8px",
              borderRadius:
                "8px",
            }}
          >
            {log}
          </div>
        )
      )}

    </div>

    <textarea
      rows="5"
      style={{
        width: "100%",
        marginTop:
          "20px",
        padding:
          "10px",
      }}
      placeholder="Enter Business Goal"
      value={goal}
      onChange={(e) =>
        setGoal(
          e.target.value
        )
      }
    />

    <button
      onClick={
        generateCampaign
      }
      style={{
        marginTop:
          "10px",
        padding:
          "10px 20px",
      }}
    >
      Generate Campaign
    </button>

    
    {loading && (
  <div
    style={{
      background: "#1f2937",
      padding: "20px",
      borderRadius: "12px",
      marginTop: "20px",
      textAlign: "center",
    }}
  >
    <TailSpin
      height="50"
      width="50"
      color="#3b82f6"
      ariaLabel="loading"
    />

    <h3>
      AI Agents Working...
    </h3>

    <p>
      Planner → Segment →
      Campaign → Analytics
    </p>
  </div>
)}

    {result && (
      <>

        <AgentCard
          title="Planner Agent"
          content={
            typeof result.planner ===
            "string"
              ? result.planner
              : JSON.stringify(
                  result.planner,
                  null,
                  2
                )
          }
        />

        <AgentCard
          title="Segment Agent"
          content={
            typeof result.segment ===
            "string"
              ? result.segment
              : JSON.stringify(
                  result.segment,
                  null,
                  2
                )
          }
        />

        <AgentCard
          title="Campaign Agent"
          content={
            typeof result.campaign ===
            "string"
              ? result.campaign
              : JSON.stringify(
                  result.campaign,
                  null,
                  2
                )
          }
        />

        <AgentCard
          title="Analytics Agent"
          content={
            typeof result.analytics ===
            "string"
              ? result.analytics
              : JSON.stringify(
                  result.analytics,
                  null,
                  2
                )
          }
        />

        <button
          onClick={
            saveCampaign
          }
          style={{
            marginTop:
              "20px",
            padding:
              "12px 20px",
            borderRadius:
              "10px",
            cursor:
              "pointer",
          }}
        >
          Save Campaign
        </button>

      </>
    )}

  </div>
</div>


);
};

export default Agent;
