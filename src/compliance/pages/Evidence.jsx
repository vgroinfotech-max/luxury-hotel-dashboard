import { useEffect, useState } from "react";
import RiskBadge from "../components/RiskBadge";
import "./evidence.css"
export default function Evidence() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadEvidence() {
      try {
        setLoading(true);

        // Backend request
        const res = await fetch("/api/compliance/evidence"); // proxy ensures backend hit
        if (!res.ok) throw new Error(`Failed to load evidence: ${res.statusText}`);

        const data = await res.json();
        setDocuments(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEvidence();
  }, []);

  if (loading) return <div className="page-loading">Loading evidence vault…</div>;
  if (error) return <div className="page-error">{error}</div>;

  return (
    <div className="compliance-page">
      <header className="page-header">
        <h1>Evidence Vault</h1>
        <p className="page-subtitle">
          Immutable compliance evidence with full version history
        </p>
      </header>

      <div className="table-wrapper">
        <table className="compliance-table">
          <thead>
            <tr>
              <th>Compliance Item</th>
              <th>Domain</th>
              <th>Risk</th>
              <th>Version</th>
              <th>Status</th>
              <th>Expiry</th>
              <th>Uploaded</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {documents.length === 0 && (
              <tr>
                <td colSpan={8} className="empty-state">
                  No evidence uploaded yet
                </td>
              </tr>
            )}

            {documents.map((doc) => (
              <tr key={doc.id}>
                <td>
                  <div className="item-title">{doc.complianceTitle}</div>
                  <div className="item-meta">Ref: {doc.regulationCode}</div>
                </td>

                <td>{doc.domain}</td>

                <td><RiskBadge level={doc.riskLevel} /></td>

                <td>v{doc.version}</td>

                <td>
                  {doc.approved ? (
                    <span className="status status-approved">Approved</span>
                  ) : (
                    <span className="status status-pending">Pending Approval</span>
                  )}
                </td>

                <td>{doc.expiresAt || "—"}</td>

                <td>
                  <div>{doc.uploadedBy}</div>
                  <div className="item-meta">{doc.uploadedAt}</div>
                </td>

                <td>
                  <div className="action-group">
                    <button
                      className="btn-secondary"
                      onClick={() => window.open(doc.fileUrl, "_blank")}
                    >
                      View
                    </button>

                    {doc.canUploadNewVersion && (
                      <button
                        className="btn-primary"
                        onClick={() =>
                          window.location.href = `/compliance/evidence/upload?item=${doc.complianceItemId}`
                        }
                      >
                        Upload New Version
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