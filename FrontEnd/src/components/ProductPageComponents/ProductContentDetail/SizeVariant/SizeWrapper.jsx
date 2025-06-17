import { useState } from "react";
import Size from './Size';
import {useTranslation} from "react-i18next"

function SizeWrapper({ sizes, onSizeSelect, selectedSizeValue }) {
  const {t} = useTranslation()
  // We'll show all sizes, but indicate which ones are out of stock
  if (!sizes || sizes.length === 0) return null;
  console.log("ssssssssssssssssss" , sizes);
  return (
    <div className="size_wrapper mb-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-semibold text-gray-800">{t("Product.sizeName")}</h3>
      </div>
      
      <div className="sizes flex items-center flex-wrap gap-3">
        {sizes.map((size, index) => {
          const isOutOfStock = size.stock <= 0;
          
          return (
            <Size 
              key={index} 
              size={size.value} 
              isSelected={size.value === selectedSizeValue}
              isOutOfStock={isOutOfStock}
              onClick={() => onSizeSelect(size.value)}
            />
          );
        })}
      </div>
      
    </div>
  );
}

export default SizeWrapper;