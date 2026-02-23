import { NavLink } from "react-router-dom";

/**
 * Compliance Sidebar
 * - Fixed navigation
 * - Role-aware (UI-level only)
 * - No country-specific items
 */

const NAV_ITEMS = [
  {
    label: "Overview",
    path: "/compliance/overview",
    roles: ["OWNER", "GM", "COMPLIANCE", "AUDITOR"],
  },
  {
    label: "Compliance Register",
    path: "/compliance/register",
    roles: ["OWNER", "GM", "COMPLIANCE"],
  },
  {
    label: "Evidence Vault",
    path: "/compliance/evidence",
    roles: ["GM", "COMPLIANCE"],
  },
  {
    label: "Violations",
    path: "/compliance/violations",
    roles: ["OWNER", "GM", "COMPLIANCE"],
  },
  {
    label: "Audit Timeline",
    path: "/compliance/audit",
    roles: ["COMPLIANCE", "AUDITOR"],
  },
  {
    label: "Reports",
    path: "/compliance/reports",
    roles: ["OWNER", "COMPLIANCE", "AUDITOR"],
  },
];

export default function Sidebar({ userRole }) {
  return (
    <aside className="compliance-sidebar">
      <div className="sidebar-header">
        <h2>Compliance</h2>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.filter((item) =>
          item.roles.includes(userRole)
        ).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
