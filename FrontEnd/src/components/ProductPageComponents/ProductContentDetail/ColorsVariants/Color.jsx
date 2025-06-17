import { memo } from "react";

function Color({ colorHex, onColorChange, index, selectedColor, colorName }) {
  const isSelected = selectedColor === index;
  
  return (
    <button
      type="button"
      onClick={() => onColorChange(index)}
      className={`color-selector shadow-sm group flex items-center justify-center rounded-full transition-all duration-200   ${
        isSelected ? "" : ""
      }`}
      aria-label={`Select ${colorName || colorHex} color`}
      aria-pressed={isSelected}
      title={colorName || colorHex}
    >
      <span

        className={`w-10 h-10 border shadow-lg rounded-full relative flex items-center justify-center transition-transform duration-300  ${
          isSelected ? "border-[1px] ring-2 ring-black border-gray-300 p-2 drop-shadow-lg" : ""

        }`}
        style={{ backgroundColor: colorHex }}
      >
   
      </span>
    </button>
  );
}

export default memo(Color);