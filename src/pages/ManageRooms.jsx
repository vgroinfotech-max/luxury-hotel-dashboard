import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/manage.css";

// ------------------- FixRoomForm Component -------------------
function FixRoomForm({ roomId, onFixed, tenantId, userId }) {
  const [cost, setCost] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFix = async () => {
    if (!cost || !reason) {
      alert("Please enter cost and reason");
      return;
    }
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/rooms/fix/${roomId}`, {
        tenant_id: tenantId,
        user_id: userId,
        cost,
        reason,
      });
      alert("Room fixed successfully");
      onFixed(roomId);
      setCost("");
      setReason("");
    } catch (err) {
      console.error(err);
      alert("Error fixing room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fix-room-form">
      <input
        type="number"
        placeholder="Cost"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
      />
      <input
        type="text"
        placeholder="Reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      <button onClick={handleFix} disabled={loading}>
        {loading ? "Fixing..." : "Fix Room"}
      </button>
    </div>
  );
}

// ------------------- ManageRooms Component -------------------
export default function ManageRooms() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Example tenantId & userId; replace with real logged-in values
  const tenantId = 1;
  const userId = 1;

  // ------------------- FETCH ROOMS -------------------
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/rooms", {
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Backend error:", text);
        setRooms([]);
        return;
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Not JSON response:", text);
        setRooms([]);
        return;
      }

      const data = await res.json();
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // ------------------- FILTER -------------------
  const filteredRooms = rooms.filter((room) => {
    const matchSearch =
      room.no.toString().includes(search) ||
      room.type.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || room.status === filter;
    return matchSearch && matchFilter;
  });

  // ------------------- DELETE -------------------
  const deleteRoom = async (no) => {
    if (!window.confirm(`Are you sure you want to delete room #${no}?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/rooms/${no}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Delete failed:", text);
        return;
      }

      fetchRooms();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ------------------- UI -------------------
  return (
    <div className="rooms-page">
      {/* HEADER */}
      <div className="rooms-header">
        <h2>Manage Rooms</h2>
        <div className="controls">
          <input
            type="text"
            placeholder="Search room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <button className="add-room-btn" onClick={() => navigate("/rooms/add")}>
            ➕ Add Room
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading && <p className="no-data">Loading rooms...</p>}

      {/* ROOMS GRID */}
      {!loading && (
        <div className="rooms-grid">
          {filteredRooms.length === 0 ? (
            <p className="no-data">No rooms found</p>
          ) : (
            filteredRooms.map((room) => (
              <div key={room.no} className={`room-card ${room.status}`}>
                <span className="room-status">{room.status}</span>
                <div className="room-number">#{room.no}</div>
                <div className="room-type">{room.type}</div>
                <div className="room-meta">
                  <span>Floor {room.floor}</span>
                  <span>₹ {room.price}</span>
                </div>

                <div className="room-actions">
                  <button onClick={() => navigate(`/rooms/manage/edit/${room.no}`)}>
                    Edit
                  </button>
                  <button onClick={() => navigate(`/rooms/manage/view/${room.no}`)}>
                    View
                  </button>
                  {room.status === "available" && (
                    <button
                      className="success"
                      onClick={() => navigate(`/rooms/manage/book/${room.no}`)}
                    >
                      Book
                    </button>
                  )}

                  {room.status === "maintenance" && (
                    <FixRoomForm
                      roomId={room.no}
                      tenantId={tenantId}
                      userId={userId}
                      onFixed={fetchRooms}
                    />
                  )}

                  <button
                    style={{ marginLeft: "8px", background: "#ef4444" }}
                    onClick={() => deleteRoom(room.no)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
