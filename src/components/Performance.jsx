import { AU_COLOR } from "../theme";

export default function Performance() {

  const perf = [
    "Room Occupancy",
    "Revenue Target",
    "Customer Satisfaction",
    "Staff Performance"
  ];

  return (
    <div style={{ marginTop: "30px" }}>

   
      <h3 style={{ marginBottom: "16px" }}>Hotel Performance</h3>

      <div className="two-col">

       
        <div className="grid">
          {perf.map((p, i) => (
            <div className="card small" key={i}>
              <h4>{p}</h4>
              <b>0%</b>
            </div>
          ))}
        </div>

        
        <div className="quick" style={{ background: AU_COLOR }}>
          <h3>⚡ Quick Actions</h3>

          {[
            "New Booking",
            "Manage Rooms",
            "Check-ins",
            "Check-outs",
            "View Report",
            "Staff Management"
          ].map((a, i) => (
            <button key={i} className="quick-btn">
              {a}
            </button>
          ))}

        </div>

      </div>
    </div>
  );
}