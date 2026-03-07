import { useEffect, useState } from "react";
import "../styles/compliance.css";

export default function ComplianceDashboard() {
  const [summary, setSummary] = useState(null);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // Mock Summary Data
    const mockSummary = {
      totalItems: 120,
      openViolations: 5,
      expiredItems: 3,
      expiringSoon: 7,
      highRiskItems: 2
    };

    // Mock Violations Data
    const mockActions = [
      {
        id: 1,
        detectedAt: "2026-03-01",
        complianceTitle: "Data Privacy Policy",
        severity: "High",
        resolvedAt: null
      },
      {
        id: 2,
        detectedAt: "2026-02-25",
        complianceTitle: "Security Audit Requirement",
        severity: "Medium",
        resolvedAt: "2026-02-28"
      },
      {
        id: 3,
        detectedAt: "2026-02-20",
        complianceTitle: "Password Policy Violation",
        severity: "Low",
        resolvedAt: null
      }
    ];

    // Simulate loading delay
    setTimeout(() => {
      setSummary(mockSummary);
      setActions(mockActions);
      setLoading(false);
    }, 800);

  }, []);

  if (loading) {
    return <div className="loading">Loading compliance data...</div>;
  }

  if (!summary) {
    return <div className="loading">No compliance data available.</div>;
  }

  return (
    <div className="compliance-container">
      <div className="header-section">
        <h1>Compliance Dashboard</h1>
        <p>Governance, Risk & Policy Monitoring Overview</p>
      </div>

      <div className="cards">
        <div className="card">
          <h4>Total Items</h4>
          <h2>{summary.totalItems}</h2>
        </div>

        <div className="card danger">
          <h4>Open Violations</h4>
          <h2>{summary.openViolations}</h2>
        </div>

        <div className="card warning">
          <h4>Expired Items</h4>
          <h2>{summary.expiredItems}</h2>
        </div>

        <div className="card success">
          <h4>Expiring Soon</h4>
          <h2>{summary.expiringSoon}</h2>
        </div>

        <div className="card">
          <h4>High Risk Items</h4>
          <h2>{summary.highRiskItems}</h2>
        </div>
      </div>

      <div className="table-section">
        <h3>Recent Compliance Violations</h3>

        <table>
          <thead>
            <tr>
              <th>Detected At</th>
              <th>Compliance Title</th>
              <th>Severity</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {actions.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  No violations found.
                </td>
              </tr>
            ) : (
              actions.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.detectedAt
                      ? new Date(item.detectedAt).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>{item.complianceTitle}</td>

                  <td className="severity">{item.severity}</td>

                  <td
                    className={
                      item.resolvedAt
                        ? "status success-text"
                        : "status danger-text"
                    }
                  >
                    {item.resolvedAt ? "Resolved" : "Open"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}