import { createContext, useContext, useState, useEffect } from "react";

const TooltipContext = createContext();

export function TooltipProvider({ children }) {
  const [tooltipEnabled, setTooltipEnabled] = useState(true);

  // Load setting
  useEffect(() => {
    const saved = localStorage.getItem("tooltipEnabled");
    if (saved !== null) {
      setTooltipEnabled(JSON.parse(saved));
    }
  }, []);

  // Save setting
  useEffect(() => {
    localStorage.setItem("tooltipEnabled", JSON.stringify(tooltipEnabled));
  }, [tooltipEnabled]);

  return (
    <TooltipContext.Provider value={{ tooltipEnabled, setTooltipEnabled }}>
      {children}
    </TooltipContext.Provider>
  );
}

export const useTooltip = () => useContext(TooltipContext);
