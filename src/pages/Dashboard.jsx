import OccupancyCards from "../components/Occupancy";

import Performance from "../components/Performance";
import CustomSection from "../components/CustomSection";
import Tooltip from "../components/common/Tooltip";
import "../styles/dashboard.css";
import Housekeeping from "../components/HouseKeepingDashboard";
import MiniCalendar from "../components/MiniCalendar";
import UpcomingReservations from "../components/UpcomingReservation";
import BookingSources from "../components/BookingSources";
import RevenueOverview from "../components/RevenueOverview";
const Dashboard = () => {
  return (
    <div className="dashboard-page">
      
     
      <h2 className="dashboard-title">
        Dashboard
        
      </h2>

      <OccupancyCards/>
      <RevenueOverview/>
      <UpcomingReservations/>
<Housekeeping/>
     <BookingSources/>
      
      <MiniCalendar />
      
  
    </div>
  );
};

export default Dashboard;
