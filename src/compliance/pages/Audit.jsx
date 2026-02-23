import { useEffect, useState } from "react";
import "./Audit.css"; // make sure to create this CSS file

export default function AuditTable() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAuditLogs = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/audit-logs");
      if (!response.ok) throw new Error("Failed to fetch audit logs");

      const data = await response.json();
      setEvents(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Unable to load audit logs");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const formatDate = (timestamp) =>
    timestamp ? new Date(timestamp).toLocaleString() : "N/A";

  const getActionColor = (action) => {
    switch (action) {
      case "FIX": return "green";
      case "ESCALATE": return "orange";
      case "ACCEPT_LOSS": return "red";
      default: return "black";
    }
  };

  if (loading) return <div className="loading">Loading audit logs…</div>;
  if (error) return <div className="error">{error}</div>;
  if (events.length === 0) return <div className="empty">No audit events recorded</div>;

  return (
    <div className="audit-table-container">
      <h1>Audit Logs</h1>
      <div className="table-wrapper">
        <table className="audit-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Entity Type</th>
              <th>Entity ID</th>
              <th>Performed By</th>
              <th>Timestamp</th>
              <th>Metadata</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td style={{ color: getActionColor(event.action) }}>{event.action}</td>
                <td>{event.entity_type}</td>
                <td>{event.entity_id}</td>
                <td>{event.performed_by}</td>
                <td>{formatDate(event.created_at)}</td>
                <td className="metadata-cell">
                  {event.metadata
                    ? typeof event.metadata === "object"
                      ? JSON.stringify(event.metadata, null, 2)
                      : event.metadata
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
