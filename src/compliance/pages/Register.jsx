import { useEffect, useState } from "react";
import RiskBadge from "../components/RiskBadge";

/**
 * Compliance Register Page
 * Read-only by default
 * Status is computed by backend
 */
export default function Register() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadRegister() {
      try {
        setLoading(true);
        const response = await fetch("/api/compliance/register");
        if (!response.ok) {
          throw new Error("Failed to load compliance register");
        }
        const data = await response.json();
        setItems(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadRegister();
  }, []);

  if (loading) {
    return <div className="page-loading">Loading compliance register…</div>;
  }

  if (error) {
    return <div className="page-error">{error}</div>;
  }

  return (
    <div className="compliance-page">
      <header className="page-header">
        <h1>Compliance Register</h1>
        <p className="page-subtitle">
          System-calculated compliance status. Evidence-driven. Audit-safe.
        </p>
      </header>

      <div className="table-wrapper">
        <table className="compliance-table">
          <thead>
            <tr>
              <th>Domain</th>
              <th>Requirement</th>
              <th>Mandatory</th>
              <th>Status</th>
              <th>Risk</th>
              <th>Evidence</th>
              <th>Expiry</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={8} className="empty-state">
                  No compliance items configured
                </td>
              </tr>
            )}

            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.domain}</td>

                <td>
                  <div className="item-title">{item.title}</div>
                  {item.regulationCode && (
                    <div className="item-meta">
                      Ref: {item.regulationCode}
                    </div>
                  )}
                </td>

                <td>
                  {item.mandatory ? (
                    <span className="mandatory yes">Yes</span>
                  ) : (
                    <span className="mandatory no">No</span>
                  )}
                </td>

                <td>
                  <span className={`status status-${item.status}`}>
                    {item.status}
                  </span>
                </td>

                <td>
                  <RiskBadge level={item.riskLevel} />
                </td>

                <td>
                  {item.evidenceCount > 0 ? (
                    <span className="evidence yes">
                      {item.evidenceCount} file(s)
                    </span>
                  ) : (
                    <span className="evidence no">Missing</span>
                  )}
                </td>

                <td>
                  {item.expiryDate ? item.expiryDate : "—"}
                </td>

                <td>
                  <div className="action-group">
                    <button
                      className="btn-secondary"
                      onClick={() =>
                        window.location.href =
                          `/compliance/evidence?item=${item.id}`
                      }
                    >
                      View
                    </button>

                    {item.canSubmitEvidence && (
                      <button
                        className="btn-primary"
                        onClick={() =>
                          window.location.href =
                            `/compliance/evidence/upload?item=${item.id}`
                        }
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
