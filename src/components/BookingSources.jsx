import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import "../styles/dashboard.css"

export default function BookingSources() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/booking-sources")
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const chartData = {
    labels: data.map(d => d.source),
    datasets: [
      {
        data: data.map(d => d.count),
        backgroundColor: [
          "#3b82f6",
          "#0ea5e9",
          "#f59e0b",
          "#8b5cf6",
          "#10b981",
          "#f43f5e"
        ]
      }
    ]
  };

  return (
    <>
      <div className="section-label">Booking Sources</div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">
            🌐 Channel Distribution — March 2026
          </div>
          <span className="card-action">Channel manager →</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 200px" }}>
          
          {/* LEFT LIST */}
          <div style={{ padding: "16px 20px" }}>
            {data.map((item, i) => (
              <div className="source-item" key={i}>
                <div
                  className="source-color"
                  style={{
                    background: chartData.datasets[0].backgroundColor[i]
                  }}
                ></div>

                <div className="source-name">{item.source}</div>

                <div style={{ textAlign: "right" }}>
                  <div className="source-pct">{item.percent}%</div>
                  <div className="source-count">
                    {item.count} bookings
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PIE CHART */}
          <div style={{ padding: "20px" }}>
            
            <Pie 
  data={chartData}
  options={{
    maintainAspectRatio: false
  }}
/>
          </div>

        </div>
      </div>
    </>
  );
}