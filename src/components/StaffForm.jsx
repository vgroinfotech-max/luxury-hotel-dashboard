import { useState } from "react";

export default function StaffForm({ onAdd }) {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    hotel_id: 1,
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role_id: "",
    department_id: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onAdd(form);
    setOpen(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>+ Add Staff</button>

      {open && (
        <div className="modal">
          <form onSubmit={handleSubmit}>

            <input name="first_name" placeholder="First Name" onChange={handleChange} required />
            <input name="last_name" placeholder="Last Name" onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
            <input name="phone" placeholder="Phone" onChange={handleChange} required />

            {/* ROLE */}
            <select name="role_id" onChange={handleChange} required>
              <option value="">Select Role</option>
              <option value="1">Front Desk</option>
              <option value="2">Housekeeping</option>
              <option value="3">Manager</option>
              <option value="4">Maintenance</option>
              <option value="5">Chef</option>
              <option value="6">Security</option>
            </select>

            {/* DEPARTMENT */}
            <select name="department_id" onChange={handleChange} required>
              <option value="">Select Department</option>
              <option value="1">Reception</option>
              <option value="2">Cleaning</option>
              <option value="3">Management</option>
              <option value="4">Maintenance</option>
              <option value="5">Kitchen</option>
              <option value="6">Security</option>
            </select>

            {/* STATUS */}
            <select name="status" onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>

            <button type="submit">Add Staff</button>
          </form>
        </div>
      )}
    </>
  );
}
