import { useState } from "react";
import roomsData from "../data/properties";
import "../styles/allRooms.css";

export default function ViewAllRooms() {
  const [search, setSearch] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  return (
    <div className="view-rooms-page">
<h2>View All Rooms</h2>
      <div className="filter-row">
        <input
          type="text"
          placeholder="Room No / Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setPropertyFilter(e.target.value)}>
          <option value="All">All Properties</option>
          {roomsData.map((prop) => (
            <option key={prop.propertyId} value={prop.propertyName}>
              {prop.propertyName}
            </option>
          ))}
        </select>

        <select onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Status</option>
          <option value="Available">Available</option>
          <option value="Booked">Booked</option>
        </select>

        <button>Search</button> 
      </div>

    
      {roomsData
        .filter(
          (property) =>
            property &&
            property.rooms &&
            (propertyFilter === "All" || property.propertyName === propertyFilter)
        )
        .map((property) => {
          const filteredRooms =
            property?.rooms?.filter(
              (room) =>
                room?.roomNo?.toString().includes(search) &&
                (statusFilter === "All" || room.status === statusFilter)
            ) || [];

          if (filteredRooms.length === 0) return null;

          return (
            <div key={property.propertyId} className="property-section">
              <h3>
                {property.propertyName}{" "}
                <span>{property.location}</span>
              </h3>

              <table className="rooms-table">
                <thead>
                  <tr>
                    <th>Room No</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRooms.map((room) => (
                    <tr key={room.roomNo}>
                      <td data-label="Room No">{room.roomNo}</td>
                      <td data-label="Type">{room.type}</td>
                      <td data-label="Price">₹{room.price}</td>
                      <td data-label="Status">
                        <span className={`status ${room.status.toLowerCase()}`}>
                          {room.status}
                        </span>
                      </td>
                      <td data-label="Action">
                        <button className="view-btn">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
    </div>
  );
}
