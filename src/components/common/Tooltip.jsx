import { useState, useRef, useEffect } from "react";
import { useTooltip } from "../../context/TooltipContext";
import "../../styles/Tooltip.css";

export default function Tooltip({ children, text }) {
  const { tooltipEnabled } = useTooltip();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!tooltipEnabled) return children;

  return (
    <span className="tooltip-click-wrapper" ref={ref}>
      <span
        className="tooltip-trigger"
        onClick={() => setOpen(!open)}
      >
        {children}
      </span>

      {open && (
        <span className="tooltip-box">
          {text}
        </span>
      )}
    </span>
  );
}
