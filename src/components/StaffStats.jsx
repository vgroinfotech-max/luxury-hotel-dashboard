import { FaUsers, FaUserCheck, FaUserClock, FaUserTie } from "react-icons/fa";
import "../styles/staff.css";

export default function StaffStats({ staff }) {
  const total = staff.length;
  const active = staff.filter(s => s.status === "Active").length;
  const onLeave = staff.filter(s => s.status === "On Leave").length;
  const roles = new Set(staff.map(s => s.role)).size;

  const stats = [
    { label: "Total Staff", value: total, icon: <FaUsers className="stat-icon total" /> },
    { label: "Active", value: active, icon: <FaUserCheck className="stat-icon active" /> },
    { label: "On Leave", value: onLeave, icon: <FaUserClock className="stat-icon on-leave" /> },
    { label: "Roles", value: roles, icon: <FaUserTie className="stat-icon roles" /> },
  ];

  return (
    <div className="stats-grid">
      {stats.map((s, idx) => (
        <div key={idx} className="stat-card">
          <div>
            <h4 className="stat-label">{s.label}</h4>
            <h2 className="stat-value">{s.value}</h2>
          </div>
          <div>{s.icon}</div>
        </div>
      ))}
    </div>
  );
}
