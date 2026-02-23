import { useState, useEffect } from "react";

export default function AvailabilityCalendar({ room }) {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!room || !room.no) return;

      try {
        const res = await fetch(`http://localhost:5000/api/rooms/${room.no}/availability`);
        const bookedDates = await res.json();

        const daysInMonth = 31;
        const monthAvailability = [];
        for (let i = 1; i <= daysInMonth; i++) {
          const dateStr = `${i} Dec`;
          const booking = bookedDates.find(
            b => {
              const checkIn = new Date(b.checkIn);
              const checkOut = new Date(b.checkOut);
              const current = new Date(`2026-12-${i < 10 ? "0"+i : i}`);
              return current >= checkIn && current <= checkOut;
            }
          );
          monthAvailability.push({
            date: dateStr,
            status: booking ? "booked" : "available",
            guest: booking ? booking.guestName : null
          });
        }

        setAvailability(monthAvailability);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [room]);

  if (loading) return <div>Loading availability...</div>;

  return (
    <div className="premium-card calendar-card">
      <h4 className="section-title"> Availability – December</h4>

      <div className="calendar">
        {availability.map((d, i) => (
          <div
            key={i}
            className={`day ${d.status || "default"}`}
            title={d.guest ? `Booked by ${d.guest}` : d.status}
          >
            <div className="day-date">{d.date}</div>
            <div className="day-status">{d.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
