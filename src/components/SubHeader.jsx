import { AU_COLOR } from "../theme";

export default function SubHeader() {
  return (
    <div className="sub-header">
      <h2>🏨 Hotel Dashboard</h2>

      <div className="actions">
        <button style={{background:AU_COLOR}}>New Booking</button>
        <input placeholder="Search room / guest / staff" />
      </div>
    </div>
  );
}