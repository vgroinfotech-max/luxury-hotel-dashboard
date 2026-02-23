import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "../styles/edit.css";

export default function EditRoom({ refreshRooms }) {
  const { no } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: "",
    floor: "",
    price: "",
    status: "",
    services: "",
    discountEnabled: false,
    occupancy: "",
    view: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -------- Fetch room data --------
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/rooms/${no}`);
        if (!res.ok) throw new Error("Room not found");
        const data = await res.json();

        setForm({
          type: data.type || "",
          floor: data.floor || "",
          price: data.price || "",
          status: data.status || "available",
          services: data.services?.join(",") || "",
          discountEnabled: data.discountEnabled || false,
          occupancy: data.occupancy || "",
          view: data.view || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [no]);

  if (loading) return <h2 style={{ padding: "20px" }}>Loading room details...</h2>;
  if (error) return <h2 style={{ padding: "20px" }}>{error}</h2>;

  // -------- Handle input change --------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // -------- Handle submit --------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/rooms/${no}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          floor: Number(form.floor),
          price: Number(form.price),
          occupancy: Number(form.occupancy),
          discountEnabled: Boolean(form.discountEnabled),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Backend Error:", data);
        alert(`Failed to update room: ${data.message || data.error}`);
        return;
      }

      alert("Room updated successfully!");
      if (refreshRooms) refreshRooms(); // parent list refresh
      navigate("/rooms/manage");
    } catch (err) {
      console.error("Frontend Error:", err);
      alert("Failed to update room (frontend error).");
    }
  };

  return (
    <div className="edit-room-page">
      <h2>Edit Room #{no}</h2>

      <form onSubmit={handleSubmit} className="edit-room-form">
        <label>
          Room Type
          <input type="text" name="type" value={form.type} onChange={handleChange} required />
        </label>

        <label>
          Floor
          <input type="number" name="floor" value={form.floor} onChange={handleChange} required />
        </label>

        <label>
          Price
          <input type="number" name="price" value={form.price} onChange={handleChange} required />
        </label>

        <label>
          Status
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
            <option value="vip">VIP</option>
          </select>
        </label>

        <label>
          Services (comma separated)
          <input type="text" name="services" value={form.services} onChange={handleChange} />
        </label>

        <label>
          Discount Enabled
          <input type="checkbox" name="discountEnabled" checked={form.discountEnabled} onChange={handleChange} />
        </label>

        <label>
          Occupancy
          <input type="number" name="occupancy" value={form.occupancy} onChange={handleChange} />
        </label>

        <label>
          View
          <input type="text" name="view" value={form.view} onChange={handleChange} />
        </label>

        <button type="submit" className="save-btn">Save Changes</button>
      </form>
    </div>
  );
}
