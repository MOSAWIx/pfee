import { useState } from "react";
import { Check } from "lucide-react";

function Color({ colorHex, index, selectedColor, onColorChange, colorName }) {
  // Check if the color is light or dark to ensure checkmark visibility
  const isLightColor = () => {
    // Convert hex to RGB
    const hex = colorHex.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate luminance - if > 0.5, it's a light color
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  };

  return (
    <div
      onClick={() => onColorChange(index)}
      className={`w-4 h-4 rounded-full relative cursor-pointer transition-all duration-200 shadow-sm hover:scale-105 ring-1 ring-gray-300`}
      style={{ backgroundColor: colorHex }}
      title={colorName}
      aria-label={`Color option: ${colorName}`}
    >

    </div>
  );
}

export default Color;