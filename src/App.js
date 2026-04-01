import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopHeader from "./components/TopHeader";

import Dashboard from "./pages/Dashboard";
import DashboardLiveStatus from "./pages/LiveStatus";
import DashboardOverview from "./pages/Overview";
import Reservation from "./pages/Reservation";
import ExpressArrival from "./pages/Arrival"

import ManageRooms from "./pages/ManageRooms";
import RoomTypes from "./pages/RoomTypes";
import RoomNumbers from "./pages/RoomNumbers";
import ViewRooms from "./pages/ViewRooms";
import ViewAllRooms from "./pages/ViewAllRooms";
import AddRoom from "./pages/AddRoom";
import EditRoom from "./pages/EditRoom";

import Inventory from "./pages/inventory-calendar";

import StaffManagement from "./pages/StaffManagement";
import GeneralSettings from "./pages/GeneralSettings";
import FrontendSettings from "./pages/FrontendSettings";
import Languages from "./components/Languages";
import EmailSettings from "./pages/EmailSettings";
import SmsSettings from "./pages/SmsSetting";

import QRCodeManagement from "./pages/QRcode";
import Rules from "./pages/Rules";
import { LanguageProvider } from "./context/LanguageContext";
import BookRoom from "./pages/BookRoom";
import SuperAdminDashboard from "./pages/SuperAdmin";
import ComplianceRoutes from "./compliance/ComplianceRoutes";
import "./index.css" 

export default function App() {
  return (
    <LanguageProvider>
      <div className="layout" >
        <Sidebar />

        <div className="main">
          <TopHeader />

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/live-status" element={<DashboardLiveStatus />} />
            <Route path="/dashboard/overview" element={<DashboardOverview />} />

            <Route path="/reservation" element={<Reservation />} />
            <Route path="/arrivals" element={<ExpressArrival />} />
<Route path="/arrivals/:id" element={<ExpressArrival />} />
            <Route path="/rooms/manage" element={<ManageRooms />} />
            <Route path="/rooms/add" element={<AddRoom />} />
            <Route path="/rooms/types" element={<RoomTypes />} />
            <Route path="/rooms/numbers" element={<RoomNumbers />} />
            <Route path="/rooms/manage/view/:roomNo" element={<ViewRooms />} />
            <Route path="/rooms/manage/edit/:no" element={<EditRoom />} />

<Route path="/rooms/manage/book/:roomNo" element={<BookRoom />} />
            <Route path="/rooms/viewall" element={<ViewAllRooms />} />

            <Route path="/staff" element={<StaffManagement />} />
            <Route path="/inventory" element={<Inventory/>} />
            <Route path="/control/rules" element={<Rules />} />
            <Route path="/settings/general" element={<GeneralSettings />} />
            <Route path="/settings/frontend" element={<FrontendSettings />} />
          <Route path="/settings/languages" element={<Languages />} />
<Route path="/settings/email" element={<EmailSettings />} />
<Route path="/settings/sms" element={<SmsSettings />} />

            <Route path="/qr" element={<QRCodeManagement />} />
             <Route path="/super-admin" element={<SuperAdminDashboard />} />
             <Route path="/compliance/*" element={<ComplianceRoutes />} />
          </Routes>
        </div>
      </div>
    </LanguageProvider>
  );
}
