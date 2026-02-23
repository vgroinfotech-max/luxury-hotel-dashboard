import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/rooms.css";

export default function AddRoom() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    no: "",
    type: "Standard Single",
    floor: 1,
    price: "",
    status: "available",
    services: "",
    discountEnabled: false,
    image: null
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else if (type === "file") {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in form) {
      if (form[key] !== null) formData.append(key, form[key]);
    }

    try {
      const res = await fetch("http://localhost:5000/api/rooms", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error);
      alert("Room added successfully!");
      navigate("/rooms/manage");
    } catch (err) {
      alert("Error: " + err.message);
      console.error(err);
    }
  };

  return (
    <div className="form-page">
      <div className="form-header">
        <h2>Add New Room</h2>
        <p>Create and configure a new hotel room</p>
      </div>

      <div className="form-card">
        <form className="room-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Room Number *</label>
              <input type="text" name="no" value={form.no} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option>available</option>
                <option>maintenance</option>
                <option>blocked</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Room Type *</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option>Standard Single</option>
                <option>Deluxe Double</option>
                <option>Luxury Twin</option>
                <option>Presidential Suite</option>
              </select>
            </div>

            <div className="form-group">
              <label>Price Per Night (₹) *</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full">
              <label>Room Image *</label>
              <input type="file" name="image" onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full">
              <label>Services (Comma separated)</label>
              <input type="text" name="services" value={form.services} onChange={handleChange} />
            </div>
          </div>

          <div className="discount-section">
            <h4>Discount Coupon (Optional)</h4>
            <label className="checkbox">
              <input
                type="checkbox"
                name="discountEnabled"
                checked={form.discountEnabled}
                onChange={handleChange}
              />
              Enable Discount Coupon for this Room
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary">+ Add Room</button>
            <button type="button" className="secondary" onClick={() => navigate("/rooms/manage")}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}