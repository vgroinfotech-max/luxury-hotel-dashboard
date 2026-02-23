import "../styles/GeneralSettings.css";
import { useState, useEffect } from "react";
import {
  FaHotel,
  FaCog,
  FaBell,
  FaShieldAlt,
} from "react-icons/fa";
import { useTooltip } from "../context/TooltipContext";

export default function GeneralSettings() {
  const { tooltipEnabled, setTooltipEnabled } = useTooltip();

  const [formData, setFormData] = useState({
    businessName: "Luxury Hotel",
    gst: "ABCD234889",
    contactPerson: "Mr S.K. Singh",
    contactPersonId: "abcd2345",
    phone: "9789757111",
    email: "luxuryhotel789@gmail.com",
    address: "",
    description: "",
  });

  const [timeZone, setTimeZone] = useState("Asia/Kolkata");
  const [currentTime, setCurrentTime] = useState("");

  const timeZones = [
    { value: "Asia/Kolkata", label: "Kolkata (IST)" },
    { value: "Asia/Tokyo", label: "Tokyo (JST)" },
    { value: "Europe/London", label: "London (GMT)" },
    { value: "America/New_York", label: "New York (EST)" },
    { value: "America/Los_Angeles", label: "Los Angeles (PST)" },
    { value: "Australia/Sydney", label: "Sydney (AEST)" },
  ];

  const [notifications, setNotifications] = useState({
    bookingEmail: true,
    checkinReminder: true,
    checkoutReminder: true,
  });

  const handleToggle = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const time = new Date().toLocaleString("en-US", { timeZone });
      setCurrentTime(time);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeZone]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("General settings saved successfully");
  };

  return (
    <div className="general-settings-page">
      <h2>General Settings</h2>

      {/* HOTEL INFORMATION */}
      <div className="settings-card">
        <h3><FaHotel /> Hotel Information</h3>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Business / Hotel Name *</label>
            <input name="businessName" value={formData.businessName} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>GST Number *</label>
            <input name="gst" value={formData.gst} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Contact Person</label>
            <input name="contactPerson" value={formData.contactPerson} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Employee ID</label>
            <input name="contactPersonId" value={formData.contactPersonId} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input name="phone" value={formData.phone} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>

          <div className="form-group full-width">
            <label>Address</label>
            <textarea name="address" rows="3" value={formData.address} onChange={handleChange} />
          </div>

          <div className="form-group full-width">
            <label>Description</label>
            <textarea name="description" rows="4" value={formData.description} onChange={handleChange} />
          </div>

          <button className="save-btn">Save Hotel Info</button>
        </form>
      </div>

      {/* SYSTEM CONFIGURATION */}
      <div className="settings-card">
        <h3><FaCog /> System Configuration</h3>

        <div className="settings-grid">
          <div className="settings-group">
            <label>Timezone</label>
            <select value={timeZone} onChange={(e) => setTimeZone(e.target.value)}>
              {timeZones.map((tz) => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
            <div className="clock-preview">{currentTime}</div>
          </div>

          <div className="settings-group">
            <label>Currency</label>
            <select><option>INR (₹)</option></select>
          </div>

          {/* 🔥 TOOLTIP ENABLE / DISABLE */}
          <div className="settings-group">
            <label>Enable Tooltips</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={tooltipEnabled}
                onChange={(e) => setTooltipEnabled(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
            <small style={{ color: "#6b7280", fontSize: "12px" }}>
              Show English help tooltips across the system
            </small>
          </div>

          <div className="settings-group">
            <label>Check-in Time</label>
            <input type="time" />
          </div>

          <div className="settings-group">
            <label>Check-out Time</label>
            <input type="time" />
          </div>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      

      {/* SECURITY */}
      <div className="settings-card">
        <h3><FaShieldAlt /> Security & Access</h3>

        <div className="settings-grid">
          <div className="settings-group">
            <label>Auto Logout (minutes)</label>
            <input type="number" placeholder="15" />
          </div>

          <div className="settings-group">
            <label>Multiple Login Allowed</label>
            <select>
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>

          <div className="settings-group">
            <label>Backup Frequency</label>
            <select>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
        </div>

        <button className="save-btn big">Save All Settings</button>
      </div>
    </div>
  );
}
