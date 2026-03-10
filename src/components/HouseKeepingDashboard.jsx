import React, { useEffect, useState } from "react";

const HousekeepingAlerts = () => {

  const [rooms, setRooms] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {

    fetch("http://127.0.0.1:5000/housekeeping")
      .then(res => res.json())
      .then(data => setRooms(data));

    fetch("http://127.0.0.1:5000/alerts")
      .then(res => res.json())
      .then(data => setAlerts(data));

  }, []);

  return (

<div className="two-col" style={{marginTop:0}}>

{/* ---------------- HOUSEKEEPING ---------------- */}

<div>
<div className="section-label">Housekeeping Status</div>

<div className="card" style={{animationDelay:"0.4s"}}>

<div className="card-header">
<div className="card-title">🧹 Room Attendance</div>
<span className="card-action">Full status →</span>
</div>

<table>
<thead>
<tr>
<th>Room</th>
<th>Type</th>
<th>Status</th>
<th>Attendant</th>
<th>Updated</th>
</tr>
</thead>

<tbody>

{rooms.map((room,index)=>(
<tr key={index}>
<td><strong>{room.room_number}</strong></td>

<td style={{fontSize:"11px",color:"var(--text3)"}}>
{room.room_type}
</td>

<td>
<span className={`room-badge room-${room.status}`}>
{room.status}
</span>
</td>

<td>{room.attendant}</td>

<td style={{
fontFamily:"'JetBrains Mono',monospace",
fontSize:"11px",
color:"var(--text4)"
}}>
{room.updated_time}
</td>

</tr>
))}

</tbody>
</table>

</div>
</div>


{/* ---------------- ALERTS ---------------- */}

<div>

<div className="section-label">Alerts & Notifications</div>

<div className="card" style={{animationDelay:"0.45s"}}>

<div className="card-header">
<div className="card-title">🔔 Live Alerts</div>
<span className="card-action">Mark all read</span>
</div>

<div className="alerts-list">

{alerts.map((alert,index)=>(

<div className="alert-item" key={index}>

<div className={`alert-icon ${alert.type}`}>
{alert.icon}
</div>

<div className="alert-text">

<div className="alert-title">
{alert.title}
</div>

<div className="alert-desc">
{alert.description}
</div>

</div>

<div className="alert-time">
{alert.alert_time}
</div>

</div>

))}

</div>

</div>

</div>

</div>

  );
};

export default HousekeepingAlerts;