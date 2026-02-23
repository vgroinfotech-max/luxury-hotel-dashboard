export default function GuestNotes({ notes }) {
  if (!notes) return null;
  return (
    <div className="premium-card">
      <h4 className="section-title">Guest Notes</h4>
      <p><strong>Last Guest:</strong> {notes.lastGuest}</p>
      <p><strong>Requests:</strong> {notes.requests}</p>
      <p><strong>Maintenance:</strong> {notes.maintenance}</p>
    </div>
  );
}
