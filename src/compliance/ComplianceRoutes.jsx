import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./layout/AppShell";

import Overview from "./pages/Overview";
import Register from "./pages/Register";
import Evidence from "./pages/Evidence";
import Violations from "./pages/Violations";
import Audit from "./pages/Audit";
import Reports from "./pages/Reports";
import ComplianceDashboard from "./pages/ComplianceDashboard";
import "./styles/compliance.css";

/**
 * Compliance Route Boundary
 * Keeps compliance isolated from other dashboards
 */
export default function ComplianceRoutes({ currentUser = {} }) {
  return (
    <AppShell userRole={currentUser?.role}>
      <Routes>
        <Route path="/" element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="register" element={<Register />} />
        <Route path="evidence" element={<Evidence />} />
        <Route path="violations" element={<Violations />} />
        <Route path="dashboard" element={<ComplianceDashboard />} />
        <Route path="audit" element={<Audit />} />
        <Route path="reports" element={<Reports />} />
      </Routes>
    </AppShell>
  );
}

