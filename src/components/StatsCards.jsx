import { AU_COLOR } from "../theme";

const stats = [
  "Total Rooms","Available Rooms","Occupied Rooms",
  "Total Staff","Total Guests","Total Booking"
];

export default function StatsCards() {
  return (
    <div className="grid">
      {stats.map((s,i)=>(
        <div className="card" key={i} style={{borderLeft:'4px solid ${AU_COLOR}'}}>
          <h4>{s}</h4>
          <h2 style={{color:AU_COLOR}}>0</h2>
        </div>
      ))}
    </div>
  );
}