import { Outlet } from "react-router-dom";

export default function Rooms() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Rooms</h1>

      <Outlet />
    </div>
  );
}
