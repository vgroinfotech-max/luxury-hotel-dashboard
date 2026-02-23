export default function StaffFilter({
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
}) {
  return (
    <div className="filter-bar">

      {/* SEARCH */}
      <input
        placeholder="Search name, email, phone"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ROLE FILTER */}
      <select
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
      >
        <option value="All">All Roles</option>
        <option value="1">Manager</option>
        <option value="2">Reception</option>
        <option value="3">Housekeeping</option>
        <option value="4">Chef</option>
        <option value="5">Security</option>
      </select>

      {/* CLEAR */}
      <button
        className="clear-btn"
        onClick={() => {
          setSearch("");
          setRoleFilter("All");
        }}
      >
        Clear
      </button>
    </div>
  );
}
