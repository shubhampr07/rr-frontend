import React from "react";
import { Switch } from "./ui/switch";

interface TouchpointSwitchProps {
  isEnabled: boolean;
  customerId: string;
  touchpointKey: string;
  onToggleSuccess?: (newValue: boolean) => void;
}

const TouchpointSwitch: React.FC<TouchpointSwitchProps> = ({
  isEnabled,
  customerId,
  touchpointKey,
  onToggleSuccess,
}) => {
  const [checked, setChecked] = React.useState(isEnabled);

  const handleChange = async (newValue: boolean) => {
    // Optimistically update the UI
    setChecked(newValue);
    try {
      const res = await fetch(
        `https://rr-backend-h3f5.onrender.com/api/customers/${customerId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            [`touchpoints.${touchpointKey}`]: newValue,
          }),
        }
      );
      const data = await res.json();
      if (!data.success) {
        console.error("Error updating touchpoint:", data.error);
        // Revert the UI change if the API call fails
        setChecked(!newValue);
      } else {
        onToggleSuccess && onToggleSuccess(newValue);
      }
    } catch (error) {
      console.error("API call error:", error);
      setChecked(!newValue);
    }
  };

  return (
    <Switch
      checked={checked}
      onCheckedChange={handleChange}
      className="bg-gray-200 ml-5 w-9 h-5 flex items-center rounded-full p-1 data-[state=checked]:bg-emerald-500"
    >
      <span className="bg-slate-700 block h-4 w-4 rounded-full shadow-sm transition-transform data-[state=checked]:translate-x-4" />
    </Switch>
  );
};

export default TouchpointSwitch;
