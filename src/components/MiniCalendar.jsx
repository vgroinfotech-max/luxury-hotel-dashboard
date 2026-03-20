import React, { useEffect, useState, useMemo } from "react";
import "../styles/dashboard.css";

export default function MiniCalendar() {
  const [data, setData] = useState([]);
  const [rooms, setRooms] = useState([]);

  // ✅ FIXED: correct date format (matches MySQL)
  const weekDates = useMemo(() => {
    const today = new Date();
    const dates = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);

      // 🔥 FIX: use local format instead of ISO
      dates.push(d.toLocaleDateString("en-CA"));
    }

    return dates;
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/occupancy")
      .then(res => res.json())
      .then(res => {
        console.log("API DATA:", res); // debug

        setData(res);

        // unique rooms
        const uniqueRooms = [...new Set(res.map(d => d.room))];
        setRooms(uniqueRooms.sort((a, b) => a - b));
      });
  }, []);

  // ✅ FIX: correct status mapping
  const getStatus = (room, date) => {
    const found = data.find(d => d.room === room && d.date === date);

    if (!found) return "empty";

    // 🔥 FIX: map available → empty
    if (found.status === "available") return "empty";

    return found.status;
  };

  const getClass = (status) => {
    switch (status) {
      case "occupied":
        return "cal-cell occ";
      case "vip":
        return "cal-cell occ-vip";
      case "checkin":
        return "cal-cell checkin";
      case "checkout":
        return "cal-cell checkout";
      default:
        return "cal-cell empty";
    }
  };

  // ✅ FIXED today check
  const isToday = (date) =>
    date === new Date().toLocaleDateString("en-CA");

  if (!rooms.length) {
    return <div className="card">Loading calendar...</div>;
  }

  return (
    <>
      <div className="section-label">Booking Calendar — Week View</div>

      <div className="card" style={{ marginBottom: "32px" }}>
        <div className="card-header">
          <div className="card-title">📅 7-Day Occupancy Map</div>
          <span className="card-action">Full calendar →</span>
        </div>

        <div className="calendar-grid">
          {/* Header */}
          <div className="cal-header">
            <div className="cal-day-label">Room</div>

            {weekDates.map((date) => (
              <div
                key={date}
                className="cal-day-label"
                style={
                  isToday(date)
                    ? { color: "var(--navy)", fontWeight: "700" }
                    : {}
                }
              >
                {new Date(date)
                  .toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "numeric"
                  })
                  .toUpperCase()}
              </div>
            ))}
          </div>

          {/* Rows */}
          {rooms.map(room => (
            <div className="cal-row" key={room}>
              <div className="cal-room-label">{room}</div>

              {weekDates.map(date => {
                const status = getStatus(room, date);

                return (
                  <div
                    key={date}
                    className={`${getClass(status)} ${
                      isToday(date) ? "today-col" : ""
                    }`}
                    title={`${room} | ${date} | ${status}`}
                  ></div>
                );
              })}
            </div>
          ))}

          {/* Legend */}
          <div className="cal-legend">
            <div className="legend-item">
              <div className="legend-dot" style={{ background: "#3b82f6" }}></div> Occupied
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: "var(--amber)" }}></div> VIP
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: "var(--green-mid)" }}></div> Check-in
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: "#3b82f6", opacity: 0.5 }}></div> Check-out
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: "var(--border2)" }}></div> Available
            </div>
            <div className="legend-item">
              <div style={{ width: "8px", height: "8px", border: "2px solid var(--navy)", borderRadius: "2px" }}></div> Today
            </div>
          </div>
        </div>
      </div>
    </>
  );
}