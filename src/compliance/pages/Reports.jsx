import { useEffect, useState } from "react";

/**
 * Compliance Reports
 * - Export-only
 * - Backend-generated
 * - Every export is logged
 */
export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        const res = await fetch("/api/compliance/reports");
        if (!res.ok) {
          throw new Error("Failed to load reports");
        }
        const data = await res.json();
        setReports(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, []);

  function handleExport(report) {
    // export action must be logged server-side
    window.location.href = report.downloadUrl;
  }

  if (loading) {
    return <div className="page-loading">Loading reports…</div>;
  }

  if (error) {
    return <div className="page-error">{error}</div>;
  }

  return (
    <div className="compliance-page">
      <header className="page-header">
        <h1>Reports & Exports</h1>
        <p className="page-subtitle">
          Regulator- and auditor-ready compliance reports
        </p>
      </header>

      <div className="reports-grid">
        {reports.length === 0 && (
          <div className="empty-state">
            No reports available
          </div>
        )}

        {reports.map((report) => (
          <div key={report.code} className="report-card">
            <div className="report-header">
              <h3>{report.title}</h3>
              <span className="report-format">
                {report.format}
              </span>
            </div>

            <p className="report-description">
              {report.description}
            </p>

            <div className="report-meta">
              <div>
                <strong>Scope:</strong> {report.scope}
              </div>
              <div>
                <strong>Generated:</strong>{" "}
                {report.generatedAt || "On demand"}
              </div>
            </div>

            <div className="report-actions">
              <button
                className="btn-primary"
                onClick={() => handleExport(report)}
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
