export default function StaffTable({ staff, onDelete }) {
  return (
    <table className="staff-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Role</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {staff.length ? (
          staff.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>

              {/* first_name + last_name */}
              <td>{s.first_name} {s.last_name}</td>

              {/* role from JOIN */}
              <td>{s.role || "-"}</td>

              <td>{s.email}</td>
              <td>{s.phone}</td>

              <td>
                {s.created_at
                  ? new Date(s.created_at).toLocaleDateString()
                  : "-"}
              </td>

              <td className="actions">
                <button className="view">View</button>
                <button className="edit">Edit</button>

                {/* DELETE */}
                <button
                  className="delete"
                  onClick={() => onDelete(s.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="no-data">
              No staff found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
