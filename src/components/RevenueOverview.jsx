import React, { useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "../styles/dashboard.css"
export default function RevenueOverview() {

  const chartData = {
    labels: ["1 Mar", "5 Mar", "10 Mar", "15 Mar", "20 Mar", "25 Mar", "30 Mar"],
    datasets: [
      {
        label: "Revenue",
        data: [120000, 180000, 150000, 220000, 240000, 210000, 260000],
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        backgroundColor: "rgba(59,130,246,0.1)",
        borderColor: "#3b82f6"
      }
    ]
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#eee" } }
    }
  };

  return (
    <>
      <div className="section-label">Revenue Overview</div>

      <div className="revenue-grid">

        {/* LEFT CARD */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📈 Revenue Trend — March 2026</div>
            <span className="card-action">Full report →</span>
          </div>

          {/* METRICS */}
          <div className="rev-metrics">
            <div className="rev-metric">
              <div className="rev-metric-label">Today's Revenue</div>
              <div className="rev-metric-value">₹2,40,000</div>
              <div className="rev-metric-change up">↑ 12% vs yesterday</div>
            </div>

            <div className="rev-metric">
              <div className="rev-metric-label">Month to Date</div>
              <div className="rev-metric-value">₹48,60,000</div>
              <div className="rev-metric-change up">↑ 8%</div>
            </div>

            <div className="rev-metric">
              <div className="rev-metric-label">ADR</div>
              <div className="rev-metric-value">₹3,500</div>
              <div className="rev-metric-change up">↑ ₹180</div>
            </div>

            <div className="rev-metric">
              <div className="rev-metric-label">RevPAR</div>
              <div className="rev-metric-value">₹2,100</div>
              <div className="rev-metric-change down">↓ 3%</div>
            </div>
          </div>

          {/* CHART */}
          <div className="chart-wrap">
            <Line data={chartData} options={options} />
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">💰 Key Metrics</div>
          </div>

          <div className="kpi-list">

            <div className="kpi-row">
              <div>
                <div className="kpi-label">Occupancy Rate</div>
                <div className="kpi-label-sub">TONIGHT</div>
              </div>
              <div>
                <div className="kpi-value">72%</div>
                <div className="kpi-badge green">On Target</div>
              </div>
            </div>

            <div className="kpi-row">
              <div>
                <div className="kpi-label">Average Daily Rate</div>
              </div>
              <div>
                <div className="kpi-value">₹3,500</div>
                <div className="kpi-badge green">+₹180</div>
              </div>
            </div>

            <div className="kpi-row">
              <div>
                <div className="kpi-label">RevPAR</div>
              </div>
              <div>
                <div className="kpi-value">₹2,100</div>
                <div className="kpi-badge amber">−3%</div>
              </div>
            </div>

            <div className="kpi-row">
              <div>
                <div className="kpi-label">F&B Revenue</div>
              </div>
              <div>
                <div className="kpi-value">₹38,000</div>
                <div className="kpi-badge green">+22%</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}