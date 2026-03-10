import OccupancyCards from "../components/Occupancy";

import Performance from "../components/Performance";
import CustomSection from "../components/CustomSection";
import Tooltip from "../components/common/Tooltip";
import "../styles/dashboard.css";
import Housekeeping from "../components/HouseKeepingDashboard";

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      
     
      <h2 className="dashboard-title">
        Dashboard
        
      </h2>

      <OccupancyCards/>
<Housekeeping/>
     
      <Performance />
      <CustomSection />

    </div>
  );
};

export default Dashboard;
