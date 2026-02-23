import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import RoomSummaryCard from "../components/RoomSummaryCard";
import AvailabilityCalendar from "../components/AvailabilityCalendar";
import Amenities from "../components/Amenities";
import RoomGallery from "../components/RoomGallery";
import RatePlans from "../components/RatePlans";
import GuestNotes from "../components/GuestNotes";

import "../styles/roomView.css";

export default function ViewRooms() {
  const { roomNo } = useParams();  // ✅ matches route :roomNo
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -------- Fetch room from backend --------
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/rooms/${roomNo}`);
        if (!res.ok) throw new Error("Room not found");
        const data = await res.json();

        // Ensure arrays exist for frontend components
        setRoom({
          ...data,
          amenities:data.services || [],
          gallery: data.gallery || [],
          ratePlans: data.ratePlans || [],
          guestNotes: data.guestNotes || []
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomNo]);

  if (loading) return <h2 style={{ padding: "20px" }}>Loading room details...</h2>;
  if (error) return <h2 style={{ padding: "20px" }}>{error}</h2>;
  if (!room) return <h2 style={{ padding: "20px" }}>Room not found</h2>;

  return (
    <div className="room-page">
      <div className="room-left">
        {/* Room summary + Edit button */}
        <RoomSummaryCard room={room} />

        {/* Other room components */}
        <Amenities amenities={room.amenities} />
        <RoomGallery images={room.gallery} />
        <GuestNotes notes={room.guestNotes} />
      </div>

      <div className="room-right">
        <RatePlans plans={room.ratePlans} />
        <AvailabilityCalendar room={room} />
      </div>
    </div>
  );
}
