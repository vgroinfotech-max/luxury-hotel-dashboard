import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";

export default function UpcomingReservations() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/reservations")
      .then(res => res.json())
      .then(res => setData(res))
      .catch(err => console.log(err));
  }, []);

  return (
    <>
      <div className="section-label">Upcoming Reservations</div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">
            📋 Today's Arrivals & Active Bookings
          </div>
          <span className="card-action">All reservations →</span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Guest</th>
                <th>Room</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Nights</th>
                <th>Source</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="guest-name">
                      {item.guestName}
                      {item.isVIP && <span className="vip-tag">VIP</span>}
                    </div>
                    <div className="guest-meta">
                      {item.phone} · {item.visits}
                    </div>
                  </td>

                  <td>
                    <strong>{item.roomNumber}</strong>
                    <div style={{ fontSize: "11px" }}>
                      {item.roomType}
                    </div>
                  </td>

                  <td>{item.checkIn}</td>
                  <td>{item.checkOut}</td>
                  <td>{item.nights}</td>

                  <td>{item.source}</td>

                  <td>
                    <span className={`status-pill ${item.status}`}>
                      {item.status}
                    </span>
                  </td>

                  <td>
                   <div className="action-btns">
  <button className="action-btn primary">
    Check-in
  </button>
  <button className="action-btn primary">
    View
  </button>
</div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </>
  );
}