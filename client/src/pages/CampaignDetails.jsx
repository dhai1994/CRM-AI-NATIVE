import {
 useEffect,
 useState
} from "react";

import {
 useParams
} from "react-router-dom";

import API from "../api/axios";

import Sidebar from "../components/Sidebar";

const CampaignDetails = () => {

 const { id } =
  useParams();

 const [campaign,
 setCampaign] =
 useState(null);

 useEffect(() => {

  fetchCampaign();

 }, []);

 const fetchCampaign =
 async ()=>{

  try{

   const { data } =
    await API.get(
      `/campaigns/${id}`
    );

   setCampaign(data);

  }catch(error){

   console.log(error);

  }

 };

 if(!campaign)
  return <h1>
   Loading...
  </h1>;

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
     Campaign Details
    </h1>

    <h2>
     {campaign.campaignName}
    </h2>

    <p>
     Goal:
     {campaign.goal}
    </p>

    <p>
     Status:
     {campaign.status}
    </p>

    <hr />

    <h2>
     Planner Agent
    </h2>

    <pre>
     {campaign.planner}
    </pre>

    <h2>
     Segment Agent
    </h2>

    <pre>
     {campaign.segment}
    </pre>

    <h2>
     Campaign Content
    </h2>

    <pre>
     {campaign.campaignContent}
    </pre>

   </div>

  </div>

 );

};

export default CampaignDetails;