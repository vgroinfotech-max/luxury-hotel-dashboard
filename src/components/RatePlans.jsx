export default function RatePlans({ plans }) {
  return (
    <div className="premium-card">
      <h4 className="section-title">Rate Plans</h4>
      {plans.map((p, i) => (
        <details key={i}>
          <summary>{p.name} – ₹{p.price}</summary>
          <p>Cancellation: {p.cancellation}</p>
          <p>Breakfast: {p.breakfast}</p>
        </details>
      ))}
    </div>
  );
}
