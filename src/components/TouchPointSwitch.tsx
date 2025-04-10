import React from "react";
import { Switch } from "./ui/switch";
import { updateCustomerTouchpoint } from "../api/customerApi";

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
      // Make the API call to update the touchpoint
      await updateCustomerTouchpoint(customerId, touchpointKey, newValue);
      onToggleSuccess && onToggleSuccess(newValue);
    } catch (error) {
      // Revert the UI change if the API call fails
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
