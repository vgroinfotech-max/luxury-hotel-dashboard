import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/manage.css";

export default function BookRoom() {
  const { roomNo } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [name, setName] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  // Fetch room details
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/rooms/${roomNo}`);
        if (!res.ok) throw new Error("Room not found");
        const data = await res.json();
        setRoom(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomNo]);

  const handleBook = async (e) => {
    e.preventDefault(); // Prevent blank page / reload
    if (!name || !checkIn || !checkOut) {
      alert("Fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_no: room.no,
          name,
          check_in: checkIn,
          check_out: checkOut,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Booking failed");

      alert("Room booked successfully!");
      navigate("/rooms/manage"); // Go back to ManageRooms page
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading room...</p>;
  if (error) return <p>{error}</p>;

  return (
   <div className="book-room-page">
  <h2>Book Room #{room.no} - {room.type}</h2>
  <p>Price per night: ₹{room.price}</p>

  <form onSubmit={handleBook}>
    <label>Name:</label>
    <input
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Your Name"
    />

    <label>Check-in:</label>
    <input
      type="date"
      value={checkIn}
      onChange={(e) => setCheckIn(e.target.value)}
    />

    <label>Check-out:</label>
    <input
      type="date"
      value={checkOut}
      onChange={(e) => setCheckOut(e.target.value)}
    />

    <button type="submit">Book Now</button>
  </form>
</div>
  )
}
