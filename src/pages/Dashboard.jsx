import StatsCards from "../components/StatsCards";
import Operations from "../components/Operations";
import Performance from "../components/Performance";
import CustomSection from "../components/CustomSection";
import Tooltip from "../components/common/Tooltip";
import "../styles/dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      
     
      <h2 className="dashboard-title">
        Dashboard
        
      </h2>

      <StatsCards />
      <Operations />
      <Performance />
      <CustomSection />

    </div>
  );
};

export default Dashboard;
