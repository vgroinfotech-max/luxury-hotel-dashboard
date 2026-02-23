export default function RiskBadge({ level }) {
  let colorClass = "";

  switch ((level || "").toLowerCase()) {
    case "low":
      colorClass = "risk-low";
      break;
    case "medium":
      colorClass = "risk-medium";
      break;
    case "high":
      colorClass = "risk-high";
      break;
    default:
      colorClass = "risk-unknown";
      break;
  }

  return (
    <span className={`risk-badge ${colorClass}`}>
      {level || "Unknown"}
    </span>
  );
}
