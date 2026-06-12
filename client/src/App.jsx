import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Agent from "./pages/Agent";
import Campaigns from "./pages/Campaigns";
import Analytics from "./pages/Analytics";
import CampaignDetails from "./pages/CampaignDetails";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <Customers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/agent"
        element={
          <ProtectedRoute>
            <Agent />
          </ProtectedRoute>
        }
      />

      
<Route
 path="/campaign/:id"
 element={
  <ProtectedRoute>
   <CampaignDetails />
  </ProtectedRoute>
 }
/>
      

      <Route
        path="/campaigns"
        element={
          <ProtectedRoute>
            <Campaigns />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;