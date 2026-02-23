import "../styles/SmsSettings.css";
import {
  FaSms,
  FaCog,
  FaCheckCircle,
  FaPaperPlane,
} from "react-icons/fa";

export default function SmsSettings() {
  return (
    <div className="sms-settings-page">
      <h2 className="page-title">
        <FaSms /> SMS Settings
      </h2>
      <p className="page-subtitle">
        Configure SMS gateway, templates, and automation rules
      </p>

      {/* SMS GATEWAY */}
      <div className="card">
        <div className="card-header blue">
          <FaCog /> SMS Gateway Configuration
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>Gateway Provider</label>
            <input type="text" placeholder="Twilio / MSG91 / Fast2SMS" />
          </div>

          <div className="form-group">
            <label>Sender ID</label>
            <input type="text" placeholder="LUXHTL" />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="************" />
          </div>

         
        </div>

        <div className="checkbox">
          <input type="checkbox" defaultChecked />
          <span>Enable SMS Service</span>
        </div>

        <div className="btn-row">
          <button className="btn green">Test SMS Gateway</button>
          <button className="btn blue">Save SMS Settings</button>
        </div>
      </div>

      {/* SMS TEMPLATES */}
      <div className="card">
        <div className="card-header gradient">
          <FaPaperPlane /> SMS Templates
        </div>

        <div className="template-grid">
          {[
            "Booking Confirmation",
            "Check-in Reminder",
            "Payment Confirmation",
            "OTP Verification",
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

      {/* SMS AUTOMATION */}
      <div className="card">
        <div className="card-header green">SMS Automation</div>

        <div className="automation">
          <label>
            <input type="checkbox" defaultChecked />
            Send booking confirmation SMS
          </label>

          <label>
            <input type="checkbox" defaultChecked />
            Send payment confirmation SMS
          </label>

          <label>
            <input type="checkbox" />
            Send check-in reminder (24 hours before)
          </label>

          <label>
            <input type="checkbox" defaultChecked />
            Send OTP for login & verification
          </label>
        </div>

        <button className="btn blue">Save Automation Settings</button>
      </div>

      {/* TEST SMS */}
      <div className="card">
        <div className="card-header pink">Test SMS</div>

        <div className="grid-2">
          <div className="form-group">
            <label>Mobile Number</label>
            <input type="text" placeholder="+91 9876543210" />
          </div>

          <div className="form-group">
            <label>Message Type</label>
            <input type="text" placeholder="Test SMS" />
          </div>
        </div>

        <div className="form-group">
          <label>Message Content</label>
          <textarea
            rows="3"
            placeholder="This is a test SMS from your hotel booking system."
          />
        </div>

        <button className="btn green">Send Test SMS</button>
      </div>
    </div>
  );
}
