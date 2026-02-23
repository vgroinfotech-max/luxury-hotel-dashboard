import { useEffect, useState } from "react";
import StaffStats from "../components/StaffStats";
import StaffFilter from "../components/StaffFilter";
import StaffTable from "../components/StaffTable";
import AddStaffForm from "../components/StaffForm";
import "../styles/staff.css";

const API_URL = "http://localhost:5000/api/staff";

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  // ----------------------------
  // FETCH STAFF
  // ----------------------------
  const fetchStaff = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setStaff(data);
    } catch (err) {
      console.error("Fetch staff error:", err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // ----------------------------
  // ADD STAFF
  // ----------------------------
 const addStaff = async (staffData) => {
  const res = await fetch("http://127.0.0.1:5000/api/staff", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(staffData),
  });

  if (!res.ok) {
    const err = await res.json();
    console.error(err);
    alert("Failed to add staff");
  }
};


  // ----------------------------
  // DELETE STAFF
  // ----------------------------
  const deleteStaff = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setStaff((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error("Delete staff error:", err);
    }
  };

  // ----------------------------
  // FILTER STAFF (BACKEND)
  // ----------------------------
  useEffect(() => {
    const params = new URLSearchParams({
      search,
      role: roleFilter,
      status: statusFilter,
      department: departmentFilter,
    });

    fetch(`${API_URL}/filter?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setStaff(data))
      .catch((err) => console.error("Filter error:", err));
  }, [search, roleFilter, statusFilter, departmentFilter]);

  return (
    <div className="staff-page">
      <div className="staff-header">
        <h1>Staff Management</h1>
      </div>

      <StaffStats staff={staff} />

      <div className="add-staff-section">
        <AddStaffForm onAdd={addStaff} />
      </div>

      <div className="staff-list-header">
        <h3>Current Staff Members</h3>
      </div>

      <StaffFilter
        search={search}
        setSearch={setSearch}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
      />

      <StaffTable
        staff={staff}
        onDelete={deleteStaff}
      />
    </div>
  );
}
