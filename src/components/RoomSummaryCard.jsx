import { useNavigate } from "react-router-dom";

export default function RoomSummaryCard({ room, refreshRooms }) {
  const navigate = useNavigate();

  // ----------------- RELEASE FUNCTION -----------------
  const releaseRoom = async () => {
    if (!window.confirm(`Are you sure you want to release room #${room.no}?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/rooms/release/${room.no}`, {
        method: "PUT",
      });

      const data = await res.json();
      alert(data.message);

      // Refresh parent rooms list if function passed
      if (refreshRooms) refreshRooms();
    } catch (err) {
      console.error("Failed to release room:", err);
      alert("Failed to release room, please try again.");
    }
  };

  return (
    <div className="summary-card">
      <div className="summary-header">
        <h2>Room #{room.no}</h2>
        <span className={`status ${room.status || ""}`}>
          {room.status || "N/A"}
        </span>
      </div>

      {/* ALL DATA FROM BACKEND */}
      <p>Type: {room.type}</p>
      <p>Floor: {room.floor}</p>
      <p>Occupancy: {room.occupancy}</p>
      <p>View: {room.view}</p>
      <p>Services: {room.services || "-"}</p>

      <h3>₹ {room.price} / night</h3>

      <div className="actions">
        <button
          type="button"
          className="success"
          onClick={() => navigate(`/rooms/manage/book/${room.no}`)}
        >
          Book
        </button>

        {/* EDIT BUTTON */}
        <button
          type="button"
          onClick={() => navigate(`/rooms/manage/edit/${room.no}`)}
        >
          Edit
        </button>

        {/* RELEASE BUTTON */}
        <button
          type="button"
          className="danger"
          onClick={releaseRoom}
          disabled={room.status === "available"} // optional: disable if already available
        >
          Release
        </button>
      </div>
    </div>
  );
}
