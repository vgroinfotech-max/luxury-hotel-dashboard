import "../styles/EmailSettings.css";
import {
  FaEnvelope,
  FaPaperPlane,
  FaCheckCircle,
  FaCog,
} from "react-icons/fa";

export default function EmailSettings() {
  return (
    <div className="email-settings-page">
      <h2 className="page-title">
        <FaEnvelope /> Email Settings
      </h2>
      <p className="page-subtitle">
        Configure your email server, templates, and automation rules
      </p>

      {/* SMTP CONFIG */}
      <div className="card">
        <div className="card-header blue">
          <FaCog /> SMTP Server Configuration
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>SMTP Host</label>
            <input type="text" placeholder="smtp.gmail.com" />
          </div>

          <div className="form-group">
            <label>SMTP Port</label>
            <input type="number" placeholder="587" />
          </div>

          <div className="form-group">
            <label>SMTP Username</label>
            <input type="email" placeholder="noreply@luxuryhotel.com" />
          </div>

          <div className="form-group">
            <label>SMTP Password</label>
            <input type="password" placeholder="••••••••" />
          </div>
        </div>

        <div className="checkbox">
          <input type="checkbox" defaultChecked />
          <span>Use TLS Encryption</span>
        </div>

        <div className="btn-row">
          <button className="btn green">Test SMTP Connection</button>
          <button className="btn blue">Save SMTP Settings</button>
        </div>
      </div>

      {/* EMAIL TEMPLATES */}
      <div className="card">
        <div className="card-header gradient">
          <FaPaperPlane /> Email Templates
        </div>

        <div className="template-grid">
          {[
            "Booking Confirmation",
            "Check-in Reminder",
            "Payment Receipt",
            "Welcome Email",
          ].map((item) => (
            <div className="template-card" key={item}>
              <h4>{item}</h4>
              <span className="status">
                <FaCheckCircle /> Active
              </span>
            </div>
          ))}
        </div>

        <button className="btn outline">Manage All Templates</button>
      </div>

      {/* EMAIL AUTOMATION */}
      <div className="card">
        <div className="card-header green">Email Automation</div>

        <div className="automation">
          <label>
            <input type="checkbox" defaultChecked />
            Automatically send booking confirmations
          </label>

          <label>
            <input type="checkbox" defaultChecked />
            Automatically send payment receipts
          </label>

          <label>
            <input type="checkbox" />
            Send check-in reminders (24 hours before)
          </label>

          <label>
            <input type="checkbox" defaultChecked />
            Send welcome emails to new users
          </label>
        </div>

        <button className="btn blue">Save Automation Settings</button>
      </div>

      {/* TEST EMAIL */}
      <div className="card">
        <div className="card-header pink">Test Email</div>

        <div className="grid-2">
          <div className="form-group">
            <label>Test Email Address</label>
            <input type="email" placeholder="test@example.com" />
          </div>

          <div className="form-group">
            <label>Subject</label>
            <input type="text" placeholder="Test Email from LuxuryHotel" />
          </div>
        </div>

        <div className="form-group">
          <label>Message</label>
          <textarea
            rows="4"
            placeholder="This is a test email from your hotel booking system..."
          />
        </div>

        <button className="btn green">Send Test Email</button>
      </div>
    </div>
  );
}
