import React, { useState, useEffect, useRef } from "react";
import ViewBooking from "../pages/ViewBooking";
import "../pages/reservation.css";

export default function Reservation() {
  const guestNameRef = useRef(null);

  const [form, setForm] = useState({
    
    guestName: "",
    roomType: "Deluxe",
    rooms: 1,
    guests: 1,
    checkIn: "",
    checkOut: "",
    coupon: "",
    offer: "",
    referral: "",
    vip: false,
    groupBooking: false,   // ✅ FIX
    company: "",
    members: "",
    discount: "",
    status: "Confirmed",
  });

  const [reservationList, setReservationList] = useState([]);
  const [editId, setEditId] = useState(null);

  // ---------------- FETCH ----------------
 const fetchReservations = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/reservations");
    const data = await res.json();

    // ✅ NORMALIZE MySQL booleans
    const normalizedData = data.map(r => ({
      ...r,
      vip: Boolean(r.vip),
      groupBooking: Boolean(r.groupBooking),
    }));

    setReservationList(normalizedData);
  } catch (err) {
    console.error(err);
  }
};
useEffect(() => {
  fetchReservations();
}, []);


  // ---------------- HANDLE CHANGE ----------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // ---------------- SAVE / UPDATE ----------------
 const saveReservation = async () => {
  try {
    const url = editId
      ? `http://localhost:5000/api/reservations/${editId}`
      : "http://localhost:5000/api/reservations";

    const method = editId ? "PUT" : "POST";

    // Prepare data to send
    const payload = {
      ...form,
      vip: form.vip ? 1 : 0,              // Convert boolean to 0/1
      groupBooking: form.groupBooking ? 1 : 0,
      rooms: Number(form.rooms),
      guests: Number(form.guests),
      coupon: form.coupon || "",
      offer: form.offer || "",
      referral: form.referral || "",
      company: form.company || "",
      members: form.members || "",
      discount: form.discount || "",
      status: form.status || "Confirmed",
    };

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    fetchReservations();
    setEditId(null);

    // Reset form
    setForm({
      guestName: "",
      roomType: "Deluxe",
      rooms: 1,
      guests: 1,
      checkIn: "",
      checkOut: "",
      coupon: "",
      offer: "",
      referral: "",
      vip: false,
      groupBooking: false,
      company: "",
      members: "",
      discount: "",
      status: "Confirmed",
    });
  } catch (err) {
    console.error(err);
  }
};


  // ---------------- EDIT ----------------
  const editReservation = (r) => {
    setEditId(r.id);
    setForm({
      guestName: r.guestName,
      roomType: r.roomType,
      rooms: r.rooms,
      guests: r.guests,
      checkIn: r.checkIn,
      checkOut: r.checkOut,
      coupon: r.coupon || "",
      offer: r.offer || "",
      referral: r.referral || "",
      vip: r.vip,
      groupBooking: r.groupBooking, // ✅ FIX
      company: r.company || "",
      members: r.members || "",
      discount: r.discount || "",
      status: r.status,
    });

    setTimeout(() => {
      guestNameRef.current?.focus();
    }, 0);
  };

  // ---------------- CATEGORY ----------------
  const getCategory = (r) => {
    if (r.groupBooking) return "Group";
    if (r.vip) return "VIP";
    if (r.coupon) return "Coupon";
    if (r.referral) return "Referral";
    if (r.offer) return "Offer";
    return "General";
  };

  // ---------------- DELETE ----------------
  const deleteReservation = async (id) => {
    if (!window.confirm("Delete this reservation?")) return;

    try {
      await fetch(`http://localhost:5000/api/reservations/${id}`, {
        method: "DELETE",
      });
      setReservationList((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="reservation-page">
      <h2>Reservation</h2>

      {/* ===== FORM ===== */}
      <div className="form-container">
        <div className="section-card">
          <label>Guest Name</label>
          <input
            name="guestName"
            value={form.guestName}
            onChange={handleChange}
            ref={guestNameRef}
          />
        </div>

        <div className="section-card">
          <label>Check In</label>
          <input type="date" name="checkIn" value={form.checkIn} onChange={handleChange} />
        </div>

        <div className="section-card">
          <label>Check Out</label>
          <input type="date" name="checkOut" value={form.checkOut} onChange={handleChange} />
        </div>

        <div className="section-card">
          <label>Room Type</label>
          <select name="roomType" value={form.roomType} onChange={handleChange}>
            <option>Deluxe</option>
            <option>Suite</option>
            <option>Premium</option>
            <option>VIP</option>
          </select>
        </div>

        <div className="section-card">
          <label>No. of Rooms</label>
          <input type="number" name="rooms" value={form.rooms} onChange={handleChange} />
        </div>

        <div className="section-card">
          <label>No. of Guests</label>
          <input type="number" name="guests" value={form.guests} onChange={handleChange} />
        </div>

        <div className="section-card soft">
          <label>Coupon</label>
          <input name="coupon" value={form.coupon} onChange={handleChange} />
        </div>

        <div className="section-card soft">
          <label>Offer</label>
          <input name="offer" value={form.offer} onChange={handleChange} />
        </div>

        <div className="section-card soft">
          <label>Referral</label>
          <input name="referral" value={form.referral} onChange={handleChange} />
        </div>

        <div className="section-card checkbox-card vip">
          <input type="checkbox" name="vip" checked={form.vip} onChange={handleChange} />
          <span>VIP Booking</span>
        </div>

        <div className="section-card checkbox-card group">
          <input
            type="checkbox"
            name="groupBooking"
            checked={form.groupBooking}
            onChange={handleChange}
          />
          <span>Group / Corporate Booking</span>
        </div>

        {form.groupBooking && (
          <>
            <div className="section-card">
              <label>Company</label>
              <input name="company" value={form.company} onChange={handleChange} />
            </div>
            <div className="section-card">
              <label>Members</label>
              <input name="members" value={form.members} onChange={handleChange} />
            </div>
            <div className="section-card">
              <label>Discount</label>
              <input name="discount" value={form.discount} onChange={handleChange} />
            </div>
          </>
        )}

        <div className="section-card">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option>Confirmed</option>
            <option>Pending</option>
            <option>Cancelled</option>
          </select>
        </div>

        <button className="save-btn" onClick={saveReservation}>
          Save Reservation
        </button>
      </div>

      <ViewBooking reservations={reservationList} />

      <h3>Reservation List</h3>
      <table>
        <thead>
          <tr>
            <th>Guest</th>
            <th>Room</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>Guests</th>
            <th>Status</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservationList.map((r) => (
            <tr key={r.id} className={getCategory(r).toLowerCase()}>
              <td>{r.guestName}</td>
              <td>{r.roomType}</td>
              <td>{r.checkIn}</td>
              <td>{r.checkOut}</td>
              <td>{r.guests}</td>
              <td>{r.status}</td>
              <td>{getCategory(r)}</td>
              <td>
                <button className="table-btn edit" onClick={() => editReservation(r)}>
                  Edit
                </button>
                <button className="table-btn delete" onClick={() => deleteReservation(r.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
