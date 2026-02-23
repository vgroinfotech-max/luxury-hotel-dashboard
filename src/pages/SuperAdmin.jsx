import React, { useEffect, useState } from "react";
import "../styles/SuperAdmin.css";

export default function SuperAdminDashboard() {
  const [summary, setSummary] = useState({
    totalHotels: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingApprovals: 0
  });

  const [hotels, setHotels] = useState([]);

  // Fetch summary and hotels
  const fetchData = () => {
    fetch("http://localhost:5000/api/super-admin/summary")
      .then(res => res.json())
      .then(data => setSummary(data))
      .catch(err => console.error("Error fetching summary:", err));

    fetch("http://localhost:5000/api/super-admin/hotels")
      .then(res => res.json())
      .then(data => setHotels(data))
      .catch(err => console.error("Error fetching hotels:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Approve a hotel
  const approveHotel = (id) => {
    fetch(`http://localhost:5000/api/super-admin/approve-hotel/${id}`, {
      method: "PUT"
    })
      .then(res => res.json())
      .then(() => {
        alert("Hotel approved successfully!");
        fetchData(); // refresh data
      })
      .catch(err => console.error("Error approving hotel:", err));
  };

  // View reports
  const viewReports = () => {
    fetch("http://localhost:5000/api/super-admin/reports")
      .then(res => res.json())
      .then(data => {
        alert(
          `Reports:\nTotal Hotels: ${data.totalHotels}\nApproved: ${data.approvedHotels}\nTotal Revenue: ₹${data.totalRevenue}`
        );
      })
      .catch(err => console.error("Error fetching reports:", err));
  };

  // Dummy action for system settings
  const openSettings = () => {
    alert("Open system settings (dummy action)");
  };

  return (
    <div className="sa-container">
      <h1 className="sa-title">Super Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="sa-stats">
        <div className="sa-card">
          <h3>Total Hotels</h3>
          <p>{summary.totalHotels}</p>
        </div>
        <div className="sa-card">
          <h3>Total Users</h3>
          <p>{summary.totalUsers}</p>
        </div>
        <div className="sa-card">
          <h3>Total Revenue</h3>
          <p>₹{summary.totalRevenue}</p>
        </div>
        <div className="sa-card">
          <h3>Pending Approvals</h3>
          <p>{summary.pendingApprovals}</p>
        </div>
      </div>

      {/* Management Section */}
      <div className="sa-actions">
        <div className="sa-box">
          <h2>Role Management</h2>
          <p>Approve pending hotels</p>
          {hotels.filter(h => !h.approved).map(h => (
  <div key={h.id} className="hotel-item">
    <span>{h.name}</span>
    <button onClick={() => approveHotel(h.id)}>Approve</button>
  </div>
))}

          {summary.pendingApprovals === 0 && <p>No pending approvals</p>}
        </div>

        <div className="sa-box">
          <h2>Reports & Analytics</h2>
          <p>Bookings, revenue, growth reports</p>
          <button onClick={viewReports}>View Reports</button>
        </div>

        <div className="sa-box">
          <h2>System Settings</h2>
          <p>Security, configurations, platform rules</p>
          <button onClick={openSettings}>Open Settings</button>
        </div>
      </div>
    </div>
  );
}
