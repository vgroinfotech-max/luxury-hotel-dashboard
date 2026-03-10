import React, { useEffect, useState } from "react";
import "../styles/occupancy.css";
const Dashboard = () => {

  const [data, setData] = useState({
    total_rooms: 0,
    occupied: 0,
    available: 0,
    cleaning: 0,
    maintenance: 0,
    oos: 0,
    checkins: 0,
    checkouts: 0,
    stayovers: 0,
    noshows: 0,
    walkins: 0
  });

  useEffect(() => {
    fetch("http://127.0.0.1:5000/dashboard")
      .then(res => res.json())
      .then(result => setData(result))
      .catch(err => console.log(err));
  }, []);

  const occupiedPercent = data.total_rooms
    ? (data.occupied / data.total_rooms) * 100
    : 0;

  const availablePercent = data.total_rooms
    ? (data.available / data.total_rooms) * 100
    : 0;

  const cleaningPercent = data.total_rooms
    ? (data.cleaning / data.total_rooms) * 100
    : 0;

  const maintenancePercent = data.total_rooms
    ? (data.maintenance / data.total_rooms) * 100
    : 0;

  const oosPercent = data.total_rooms
    ? (data.oos / data.total_rooms) * 100
    : 0;

  return (
    <div>

      {/* Occupancy Section */}
      <div className="section-label">Occupancy & Room Status</div>

      <div className="occ-bar-wrap card">

        <div style={{display:"flex",justifyContent:"space-between"}}>
          <span>{data.total_rooms} Rooms Total</span>
          <span>Live</span>
        </div>

        <div className="occ-bar">

          <div className="occ-segment" style={{width:`${occupiedPercent}%`,background:"#ef4444"}} />
          <div className="occ-segment" style={{width:`${availablePercent}%`,background:"#22c55e"}} />
          <div className="occ-segment" style={{width:`${cleaningPercent}%`,background:"#f59e0b"}} />
          <div className="occ-segment" style={{width:`${maintenancePercent}%`,background:"#64748b"}} />
          <div className="occ-segment" style={{width:`${oosPercent}%`,background:"#9ca3af"}} />

        </div>

        <div className="occ-bar-legend">
          <div>🔴 Occupied {data.occupied}</div>
          <div>🟢 Available {data.available}</div>
          <div>🟡 Cleaning {data.cleaning}</div>
          <div>⚫ Maintenance {data.maintenance}</div>
          <div>⚪ Out of Service {data.oos}</div>
        </div>

      </div>

      {/* Room Cards */}

      <div className="occ-grid">

        <div className="occ-card total">
          <span>🏨</span>
          <div className="occ-value">{data.total_rooms}</div>
          <div>Total Rooms</div>
        </div>

        <div className="occ-card occupied">
          <span>🔴</span>
          <div className="occ-value">{data.occupied}</div>
          <div>Occupied</div>
        </div>

        <div className="occ-card available">
          <span>🟢</span>
          <div className="occ-value">{data.available}</div>
          <div>Available</div>
        </div>

        <div className="occ-card cleaning">
          <span>🧹</span>
          <div className="occ-value">{data.cleaning}</div>
          <div>Cleaning</div>
        </div>

        <div className="occ-card maintenance">
          <span>🛠</span>
          <div className="occ-value">{data.maintenance}</div>
          <div>Maintenance</div>
        </div>

        <div className="occ-card oos">
          <span>⛔</span>
          <div className="occ-value">{data.oos}</div>
          <div>Out of Service</div>
        </div>

      </div>

      {/* Today Activity */}

      <div className="section-label">Today's Activity Snapshot</div>

      <div className="activity-grid">

        <div className="act-card">
          <span>🛬</span>
          <div className="act-value">{data.checkins}</div>
          <div>Check-ins Today</div>
        </div>

        <div className="act-card">
          <span>🛫</span>
          <div className="act-value">{data.checkouts}</div>
          <div>Check-outs Today</div>
        </div>

        <div className="act-card">
          <span>🏠</span>
          <div className="act-value">{data.stayovers}</div>
          <div>Stayovers</div>
        </div>

        <div className="act-card">
          <span>❌</span>
          <div className="act-value">{data.noshows}</div>
          <div>No Shows</div>
        </div>

        <div className="act-card">
          <span>🚶</span>
          <div className="act-value">{data.walkins}</div>
          <div>Walk-ins</div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;