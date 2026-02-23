import { useEffect, useState } from "react";
import RiskBadge from "../components/RiskBadge";
import "./overview.css"
/**
 * Compliance Overview
 * Read-only, system-calculated, audit-safe
 */
export default function Overview() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadOverview() {
      try {
        setLoading(true);
        setError(null);

        // ✅ Use full Flask backend URL
        const res = await fetch("http://localhost:5000/api/compliance/overview");

        if (!res.ok) {
          throw new Error(`Failed to load compliance overview: ${res.status}`);
        }

        const data = await res.json();
        setSummary(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching compliance overview:", err);
      } finally {
        setLoading(false);
      }
    }

    loadOverview();
  }, []);

  if (loading) return <div className="page-loading">Loading compliance status…</div>;
  if (error) return <div className="page-error">{error}</div>;
  if (!summary) return <div className="empty-state">No compliance data available</div>;

  return (
    <div className="compliance-page">
      <header className="page-header">
        <h1>Compliance Overview</h1>
        <p className="page-subtitle">
          System-calculated status based on active rules and evidence
        </p>
      </header>

      {/* === TOP RISK STRIP === */}
      <section className="overview-strip">
        <div className="strip-card score">
          <div className="strip-label">Compliance Score</div>
          <div className={`strip-value score-${summary.scoreStatus}`}>
            {summary.score}
          </div>
        </div>

        <div className="strip-card critical">
          <div className="strip-label">Critical Violations</div>
          <div className="strip-value">{summary.criticalViolations}</div>
        </div>

        <div className="strip-card expiring">
          <div className="strip-label">Expiring Soon (30 days)</div>
          <div className="strip-value">{summary.expiringSoon}</div>
        </div>

        <div className="strip-card audit">
          <div className="strip-label">Last Audit</div>
          <div className="strip-value">{summary.lastAuditDate || "—"}</div>
        </div>
      </section>

      {/* === HIGH RISK DOMAINS === */}
      <section className="overview-section">
        <h2>High-Risk Domains</h2>
        {summary.highRiskDomains.length === 0 ? (
          <div className="empty-state">No high-risk domains detected</div>
        ) : (
          <table className="compliance-table compact">
            <thead>
              <tr>
                <th>Domain</th>
                <th>Risk</th>
                <th>Open Issues</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {summary.highRiskDomains.map((domain) => (
                <tr key={domain.code}>
                  <td>{domain.name}</td>
                  <td>
                    <RiskBadge level={domain.riskLevel} />
                  </td>
                  <td>{domain.openIssues}</td>
                  <td>
                    <button
                      className="btn-secondary"
                      onClick={() =>
                        (window.location.href = `/compliance/register?domain=${domain.code}`)
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* === EXPIRING ITEMS === */}
      <section className="overview-section">
        <h2>Expiring Compliance Items</h2>
        {summary.expiringItems.length === 0 ? (
          <div className="empty-state">No upcoming expiries</div>
        ) : (
          <table className="compliance-table compact">
            <thead>
              <tr>
                <th>Item</th>
                <th>Domain</th>
                <th>Expiry Date</th>
                <th>Risk</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {summary.expiringItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.domain}</td>
                  <td>{item.expiryDate}</td>
                  <td>
                    <RiskBadge level={item.riskLevel} />
                  </td>
                  <td>
                    <button
                      className="btn-primary"
                      onClick={() =>
                        (window.location.href = `/compliance/evidence/upload?item=${item.id}`)
                      }
                    >
                      Submit Evidence
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
