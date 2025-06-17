import { useState, useEffect } from "react";
import { Tag } from "lucide-react";
import { useTranslation } from "react-i18next";


function QuantityWrapper({ product, getSelectedPrice }) {
  const {t} = useTranslation()
  // Extract price options from product
  const priceOptions = Object.entries(product)
    .filter(([key, value]) => key.trim().toLowerCase().includes("price") && !key.includes("without"))
    .map(([key, value]) => {
      let quantity = 1;
      if (key === "basePrice") quantity = 1;
      else {
        const match = key.match(/priceFor(\d+)/);
        if (match) quantity = parseInt(match[1], 10);
      }
      return { quantity, price: value };
    })
    .sort((a, b) => a.quantity - b.quantity);

  const [selected, setSelected] = useState(priceOptions[0]?.quantity || 1);
  
  // Calculate selected price and pass it up
  useEffect(() => {
    const selectedPrice = priceOptions.find(opt => opt.quantity === selected)?.price || 0;
    getSelectedPrice(selectedPrice);
  }, [selected, priceOptions, getSelectedPrice]);

  // Calculate savings for each option
  const calculateSavings = (option) => {
    if (!product.discount || priceOptions.length <= 1) return null;
    
    // Calculate price per item for this option
    const pricePerItem = option.price / option.quantity;
    const basePricePerItem = priceOptions[0].price;
    
    // Only show savings if there's actually a discount for buying more
    if (pricePerItem >= basePricePerItem) return null;
    
    const savingsPercent = Math.round((1 - (pricePerItem / basePricePerItem)) * 100);
    return savingsPercent >= 5 ? savingsPercent : null; // Only show if savings are significant
  };

  // Format price with discount if applicable
  const formatPrice = (price) => {
    if (product.discount) {
      const discountedPrice = price;
      // const originalPrice = price + (price * product.discount / 100);
      return (
        <span className="flex flex-col text-sm">
          <span className="font-semibold">{discountedPrice.toFixed(2)} DH</span>
        </span>
      );
    }
    return <span className="text-sm font-semibold">{price.toFixed(2)} DH</span>;
  };

  return (
    <div className="quantity-selector mt-6">
      <legend className="text-base font-semibold text-gray-800 mb-3 flex items-center">
        <span>{t("Product.quantityName")}</span>
      </legend>
      <div className="flex flex-col space-y-4">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {priceOptions.map(opt => {
            const savings = calculateSavings(opt);
            
            return (
              <button
                key={opt.quantity}
                type="button"
                className={`
                  px-1 py-1 z-[1] rounded-lg border relative flex flex-col items-center justify-center
                  transition-all duration-200 
                  ${selected === opt.quantity 
                    ? 'bg-black text-white border-black shadow-md' 
                    : 'bg-white text-gray-800 border-gray-300 hover:border-gray-500 hover:shadow-sm'}
                `}
                onClick={() => setSelected(opt.quantity)}
              >
                {savings && (
                  <div className="absolute  -top-2 -right-2 bg-red-500 text-white text-xs font-bold flex items-center justify-center px-1 py-1    lg:px-2 lg:py-1 rounded-full ">
                    <span className="size-fit mb-[-3px] md:mb-0">{savings}%-</span>
                  </div>
                )}
                <div >

                <span className="font-bold text-lg">{opt.quantity}</span>
                  <span className="text-xs">{opt.quantity > 1 ? t("Product.pieces") : t("Product.piece")}</span>
                </div>
                {formatPrice(opt.price)}
                
              </button>
            );
          })}
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{t("Product.totalPrice")}:</span>
            {product.discount > 0 && (
              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                {t("Product.discount")} {product.discount}%
              </span>
            )}
          </div>
          <span className="font-bold text-xl text-red-600">
            {priceOptions.find(opt => opt.quantity === selected)?.price.toFixed(2)} DH
          </span>
        </div>
      </div>
    </div>
  );
}

export default QuantityWrapper;