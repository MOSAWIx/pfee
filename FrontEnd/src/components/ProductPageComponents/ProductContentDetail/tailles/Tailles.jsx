import { useState } from "react";
import { Ban } from "lucide-react";
import { useTranslation } from "react-i18next";

function Tailles({ tailles, handleTailleSelect, selectedTaille }) {
  if (!tailles?.length) return null;

  const [hoveredSize, setHoveredSize] = useState(null);
  const { t } = useTranslation();
  // Calculate availability
  const totalSizes = tailles.length;
  const availableSizes = tailles.filter((t) => t.stock > 0).length;
  const outOfStockSizes = totalSizes - availableSizes;

  return (
    <div className="sizes-selector mt-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-semibold text-gray-800">
          {t("Product.ShoeSizeName")}
        </h3>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {tailles.map((taille, index) => {
          const isOutOfStock = taille.stock <= 0;
          const isSelected = selectedTaille === taille.value;

          return (
            <div
              key={index}
              onClick={() => {
                if (!isOutOfStock) handleTailleSelect(taille.value);
              }}
              onMouseEnter={() => setHoveredSize(index)}
              onMouseLeave={() => setHoveredSize(null)}
              className={`
                w-12 h-12 border rounded-lg flex flex-col items-center justify-center
                transition-all duration-200 ease-in-out relative
                ${
                  isSelected && !isOutOfStock
                    ? "bg-black text-white border-black shadow"
                    : ""
                }
                ${
                  isOutOfStock
                    ? "opacity-60 cursor-not-allowed bg-gray-50"
                    : "cursor-pointer hover:shadow-sm hover:border-gray-400"
                }
                ${hoveredSize === index ? "transform scale-105" : ""}
            `}
              aria-label={`Size ${taille.value}${
                isOutOfStock ? " - Out of stock" : ""
              }`}
            >
              <span
                className={`text-sm font-medium ${
                  isSelected ? "font-bold" : ""
                }`}
              >
                {taille.value}
              </span>

              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Ban size={16} className="text-red-500 opacity-80" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Tailles;
