import { useState } from "react";
import "../pages/reservation.css";

function ViewBooking({ reservations }) {
  const [selectedDate, setSelectedDate] = useState("");

  const filteredBookings = reservations.filter(
    (r) => r.checkIn === selectedDate
  );

  const getType = (b) => {
    if (b.groupBooking) return "Group";
    if (b.vip) return "VIP";
    if (b.coupon) return "Coupon";
    if (b.referral) return "Referral";
    if (b.offer) return "Offer";
    return "General";
  };

  return (
    <div className="view-booking-card">
      <h3>View Bookings by Date</h3>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      {selectedDate && (
        <table>
          <thead>
            <tr>
              <th>Guest</th>
              <th>Room</th>
              <th>Guests</th>
              <th>Status</th>
              <th>Type</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((b, index) => (
                <tr key={index}>
                  <td>{b.guestName}</td>
                  <td>{b.roomType}</td>
                  <td>{b.guests}</td>
                  <td>
                    <span className={`status-${b.status.toLowerCase()}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <span className={`type-${getType(b).toLowerCase()}`}>
                      {getType(b)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ViewBooking;
