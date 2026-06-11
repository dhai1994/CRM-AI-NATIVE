import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      style={{
        width: "220px",
        height: "100vh",
        background: "#111827",
        color: "white",
        padding: "20px",
      }}
    >
      <h2>AI CRM</h2>

      
         <nav
 style={{
  display:"flex",
  flexDirection:"column",
  gap:"20px",
  marginTop:"30px"
 }}
>

 <NavLink
  to="/dashboard"
 >
  📊 Dashboard
 </NavLink>

 <NavLink
  to="/customers"
 >
  👥 Customers
 </NavLink>

 <NavLink
  to="/agent"
 >
  🤖 AI Agent
 </NavLink>

 <NavLink
  to="/campaigns"
 >
  📢 Campaigns
 </NavLink>

 <NavLink
  to="/analytics"
 >
  📈 Analytics
 </NavLink>

</nav>
    </div>
  );
};

export default Sidebar;