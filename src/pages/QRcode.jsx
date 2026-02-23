import React, { useEffect, useState } from "react";
import "../styles/QRcode.css";

const BASE_URL = "http://localhost:5000";

function QRManager() {
  const [qrcodes, setQrcodes] = useState([]);
  const [stats, setStats] = useState({});
  const [rooms, setRooms] = useState([]);
  const [roomNo, setRoomNo] = useState("");
  const [qrType, setQrType] = useState("Staff");
  const [selectedQR, setSelectedQR] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(`${BASE_URL}/api/qrcodes`)
      .then(res => res.json())
      .then(data => setQrcodes(data));

    fetch(`${BASE_URL}/api/qrcodes/stats`)
      .then(res => res.json())
      .then(data => setStats(data));

    fetch(`${BASE_URL}/api/room-list`)
      .then(res => res.json())
      .then(data => setRooms(data));
  };

  const generateQR = () => {
    if (!roomNo) return alert("Select Room");

    fetch(`${BASE_URL}/api/qrcodes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room_no: roomNo, qr_type: qrType })
    }).then(() => {
      setRoomNo("");
      fetchData();
    });
  };

 
  const handleDownload = async (imagePath) => {
  try {
    const response = await fetch(`${BASE_URL}${imagePath}`);
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "qr-code.png"; // file name
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Download failed:", error);
  }
};
const deleteQR = (id) => {
  // Confirmation pop-up
  const confirmDelete = window.confirm("Are you sure you want to delete this QR code?");
  if (!confirmDelete) return; // User ne cancel kar diya

  // Agar user confirm kare, tabhi API call
  fetch(`${BASE_URL}/api/qrcodes/${id}`, {
    method: "DELETE"
  }).then(() => fetchData());
};


  const sendToStaff = (id) => {
    fetch(`${BASE_URL}/api/qrcodes/send/${id}`, {
      method: "PUT"
    }).then(() => fetchData());
  };

  const viewDetails = (qr) => {
    setSelectedQR(qr);
  };

  return (
    <div className="qr-container">
      <h2 className="qr-title">QR Code Manager</h2>

      {/* Dashboard */}
      <div className="qr-cards">
        <DashboardCard color="blue" title="Active QR Codes" value={stats.active || 0} />
        <DashboardCard color="green" title="Sent to Staff" value={stats.sent || 0} />
        <DashboardCard color="yellow" title="Used QR Codes" value={stats.used || 0} />
        <DashboardCard color="teal" title="Total Generated" value={stats.total || 0} />
      </div>

      {/* Generate Section */}
      <div className="generate-box">
        <select value={roomNo} onChange={(e) => setRoomNo(e.target.value)}>
          <option value="">Select Room</option>
          {rooms.map((r) => (
            <option key={r.no} value={r.no}>
              Room {r.no}
            </option>
          ))}
        </select>

        <select value={qrType} onChange={(e) => setQrType(e.target.value)}>
          <option value="Staff">Staff Access</option>
          <option value="Booking">Booking</option>
        </select>

        <button onClick={generateQR}>+ Generate New QR</button>
      </div>

      {/* Table */}
      <div className="qr-table-box">
        <table className="qr-table">
          <thead>
            <tr>
              <th>QR Code</th>
              <th>QR Info</th>
              <th>Status</th>
              <th>Generated At</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {qrcodes.map((qr) => (
              <tr key={qr.id}>
                <td>
                  <img
                    src={`${BASE_URL}${qr.image_path}`}
                    alt="QR"
                    className="qr-image"
                  />
                </td>

                <td>
                  <strong>{qr.qr_type} QR</strong>
                  <p>Room: {qr.room_id}</p>
                </td>

                <td>
                  <span
                    className={
                      qr.status === "Active"
                        ? "status-badge active"
                        : "status-badge used"
                    }
                  >
                    {qr.status}
                  </span>
                </td>

                <td>{qr.created_at}</td>

                <td>
                 <div className="action-group">

  <button
    className="action-btn view"
    data-tooltip="View Details"
    onClick={() => viewDetails(qr)}
  >
    👁
  </button>

  <button
    className="action-btn send"
    data-tooltip="Send to Staff"
    onClick={() => sendToStaff(qr.id)}
  >
    📤
  </button>

 <button
  className="action-btn download"
  data-tooltip="Download QR"
  onClick={() => handleDownload(qr.image_path)}
>
  ⬇
</button>


  <button
    onClick={() => deleteQR(qr.id)}
    data-tooltip="Delete QR"
    className="action-btn delete"
  >
    🗑
  </button>

</div>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedQR && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>QR Details</h3>

            <img
              src={`${BASE_URL}${selectedQR.image_path}`}
              alt="QR"
              width="150"
            />

            <p><strong>Room:</strong> {selectedQR.room_id}</p>
            <p><strong>Type:</strong> {selectedQR.qr_type}</p>
            <p><strong>Status:</strong> {selectedQR.status}</p>
            <p><strong>Generated:</strong> {selectedQR.created_at}</p>

            <button
              className="close-btn"
              onClick={() => setSelectedQR(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardCard({ color, title, value }) {
  return (
    <div className={`dashboard-card ${color}`}>
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
  );
}

export default QRManager;
