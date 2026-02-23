import { useEffect, useState } from "react";
import RiskBadge from "../components/RiskBadge";

/**
 * Violations Log
 * - Append-only
 * - Immutable history
 * - Resolution ≠ deletion
 */
export default function Violations() {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadViolations() {
      try {
        const res = await fetch("/api/compliance/violations");
        if (!res.ok) {
          throw new Error("Failed to load violations");
        }
        const data = await res.json();
        setViolations(data || []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadViolations();

    // 🔄 Auto refresh every 30 seconds
    const interval = setInterval(loadViolations, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="page-loading">Loading violations…</div>;
  }

  if (error) {
    return <div className="page-error">{error}</div>;
  }

  return (
    <div className="compliance-page">
      <header className="page-header">
        <h1>Violations</h1>
        <p className="page-subtitle">
          All detected compliance violations. History is immutable.
        </p>
      </header>

      <div className="table-wrapper">
        <table className="compliance-table">
          <thead>
            <tr>
              <th>Severity</th>
              <th>Compliance Item</th>
              <th>Domain</th>
              <th>Detected By</th>
              <th>Detected At</th>
              <th>Status</th>
              <th>Resolution</th>
            </tr>
          </thead>

          <tbody>
            {violations.length === 0 && (
              <tr>
                <td colSpan={7} className="empty-state success">
                  ✔ No active compliance violations
                </td>
              </tr>
            )}

            {violations.map((v) => (
              <tr key={v.id}>
                <td>
                  <RiskBadge level={v.severity} />
                </td>

                <td>
                  <div className="item-title">{v.complianceTitle}</div>
                  <div className="item-meta">
                    Ref: {v.regulationCode}
                  </div>
                </td>

                <td>{v.domain}</td>

                <td>{v.detectedBy || "-"}</td>

                <td>
                  {v.detectedAt
                    ? new Date(v.detectedAt).toLocaleString()
                    : "-"}
                </td>

                <td>
                  {v.resolvedAt ? (
                    <span className="status status-resolved">
                      Resolved
                    </span>
                  ) : (
                    <span className="status status-open">
                      Open
                    </span>
                  )}
                </td>

                <td>
                  {v.resolvedAt ? (
                    <div>
                      <div>{v.resolutionNotes || "Resolution submitted"}</div>
                      <div className="item-meta">
                        {new Date(v.resolvedAt).toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <button
                      className="btn-secondary"
                      onClick={() =>
                        window.location.href =
                          `/compliance/evidence/upload?violation=${v.id}`
                      }
                    >
                      Submit Resolution
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}