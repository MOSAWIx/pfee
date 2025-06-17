import { Ban } from "lucide-react";

function Size({ size, isSelected, onClick, isOutOfStock }) {
  return (
    <div
      onClick={() => !isOutOfStock && onClick()}
      tabIndex={isOutOfStock ? -1 : 0}
      aria-disabled={isOutOfStock}
      className={`rounded-lg select-none
        size_item w-12 h-12 flex items-center justify-center cursor-pointer text-base font-semibold 
        transition-all duration-200 border relative
        ${isOutOfStock ? "cursor-not-allowed bg-gray-50" : ""}
        ${
          isSelected
            ? "bg-black text-white border-black shadow"
            : "bg-white text-black border-gray-300"
        }
      `}
    >
      <span
        className={`${isOutOfStock ? "opacity-50" : "opacity-100"} ${
          isSelected ? "text-white" : "text-black"
        } `}
      >
        {size}
      </span>

      {isOutOfStock && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Ban size={16} className="text-red-500 opacity-80" />
        </div>
      )}
    </div>
  );
}

export default Size;