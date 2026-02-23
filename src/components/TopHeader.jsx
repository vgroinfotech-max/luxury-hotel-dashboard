import { FaBell } from "react-icons/fa";
import { AU_COLOR } from "../theme";

export default function TopHeader() {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday:"long", day:"2-digit", month:"2-digit", year:"numeric"
  });

  return (
    <div className="top-header">
      <div>
        <h3>Hotel-name</h3>
        <small>Mumbai, Maharashtra</small>
      </div>

      <span>Today, <br /> {today}</span>

      <div className="admin">
        <FaBell />
        <div className="avatar" style={{background:AU_COLOR}}>AU</div>
        <div>
          <b>Admin User</b>
          <br />
          <small>Manager</small>
        </div>
      </div>
    </div>
  );
}