import { AU_COLOR } from "../theme";

export default function Operations() {

  const stats = [
    { label: "Check-ins Expected", value: 4 },
    { label: "Check-outs Expected", value: 3 },
    { label: "Rooms Ready", value: 21 },
    { label: "Maintenance Requests", value: 0 },
    { label: "Today's Booking", value: 0 },
    { label: "Today's Profit", value: "₹0" }
  ];

  const activities = [
    "Special request for extra towels",
    "Early check-in request approved",
    "Room service request received",
    "Late check-out request received",
    "Room inspected",
    "VIP guest arriving in 1 hour",
    "Room 402 inspected",
    "Room 404 inspected",
    "Room 203 cleaned"
  ];

  return (
    <div className="two-col">

      <div className="box">

        <h3>Operations Today</h3>

        
        <div className="mini-grid" style={{ marginBottom: "20px" }}>
          {stats.map((s, i) => (
            <div key={i} className="mini-card stat-box">
              <span className="stat-value">{s.value}</span>
              <p>{s.label}</p>
            </div>
          ))}
        </div>

        <h3 style={{ marginTop: "10px" }}>Housekeeping Status</h3>

        <div className="mini-grid">
          <div className="mini-card hk dirty">
            <h4>Dirty</h4>
            <span>0</span>
          </div>

          <div className="mini-card hk clean">
            <h4>Clean</h4>
            <span>0</span>
          </div>

          <div className="mini-card hk inspected">
            <h4>Inspected</h4>
            <span>0</span>
          </div>
        </div>
      </div>

      
      <div className="box">
        <h3>Recent Activity</h3>

       
        <ul className="activity-list">
          {activities.map((a, i) => (
            <li key={i}>
              <span className="dot">●</span>
              {a}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}