import { useState } from "react";
import Color from "./Color";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { LanguageContext } from "../../../../context/language";

function ColorWrapper({ colors, onColorSelect, selectedColorIndex }) {
  const { t } = useTranslation();
  const { language } = useContext(LanguageContext);
  const currentLanguage = language
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const selectedColorObj = colors?.[selectedColorIndex];
  const colorName = selectedColorObj?.name?.[currentLanguage] || "";

  return (
    <div className="colors-variants mb-5 ">
      <legend className="mb-2   text-gray-800 text-base font-semibold flex items-center gap-2">
        <span>{t("Product.colorName")}:</span>

        <span className="font-medium text-gray-600">{colorName}</span>
      </legend>

      <div className="colors-wrapper flex items-center mt-4 flex-wrap gap-4">
        {colors.map((color, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Color
              colorHex={color.colorHex}
              index={index}
              selectedColor={selectedColorIndex}
              onColorChange={onColorSelect}
              colorName={color.name[currentLanguage]}
            />
            <span className={`text-xs mt-2 text-center transition-all duration-200 ${
              selectedColorIndex === index ? "font-medium" : ""
            } ${hoveredIndex === index ? "opacity-100" : "opacity-70"}`}>
              {color.name[currentLanguage]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ColorWrapper;