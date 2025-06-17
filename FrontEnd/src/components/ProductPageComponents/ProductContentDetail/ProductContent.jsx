import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useContext } from "react";
import { LanguageContext } from "../../../context/language";
import { useNavigate } from "react-router-dom";
import {
  selectColor,
  selectTaille,
} from "../../../Features/Products/ProductsSlice";
import { ShoppingBag, Check, TruckIcon, Ban } from "lucide-react";
import toast from "react-hot-toast";

// axios config
import WebAxiosConfig from "../../../config/webAxiosConfig";

// Import components
import ColorWrapper from "./ColorsVariants/ColorWraper";
import QuantityWrapper from "./Quantity/QuantityWrapper";
import Tailles from "./tailles/Tailles";
import SizeWrapper from "./SizeVariant/SizeWrapper";
import OrderForm from "../OrderForm";
// the hook
import { useTranslation } from "react-i18next";
import { useEncryptedStorage } from "../../../Helpers/useEncryptedStorage";
import { trackViewContent,trackLead } from "../../../Helpers/pixel";




function ProductContent({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useContext(LanguageContext);
  const currentLanguage = language;
  // useHook For LimitOrder
  const { canOrder, addOrder } = useEncryptedStorage();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [price, setPrice] = useState(product.basePrice || 0);
  const [quantity, setQuantity] = useState(1);
  const [currentSelectedTaille, setCurrentSelectedTaille] = useState(null);
  const [currentSelectedSize, setCurrentSelectedSize] = useState(null);

  // New order form fields
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [orderNote, setOrderNote] = useState("");

  // Track Facebook Pixel
  useEffect(() => {
    if (product) {
      trackViewContent({
        content_name: product.title.ar || product.title.en,
        content_ids: [product._id],
        content_type: 'product',
        value: product.basePrice || 0,
        currency: 'DH'
      });
    }
  }, [product]);


        const selectedColor = useSelector(
          (state) => state.root.products.selectedSizeAndColorAndTaille.color
        );



        // Get the current color's tailles
        const [availableTailles, setAvailableTailles] = useState([]);

        const colorIndex = selectedColor?.colorIndex || 0;
        const currentColor = product.colors[colorIndex];

        // Get sizes from current color (XL, S, M)
        const sizes = currentColor?.sizes || [];
        const sizesExist = sizes.length > 0;

        // Get tailles from current color (40, 42, etc.)
        const taillesArr = currentColor?.tailles || [];
        const taillesExist = taillesArr.length > 0;


        // Initialize with first color
        useEffect(() => {
          if(product?.colors?.length > 0) {
        // Set available tailles for the selected color
        if (taillesArr.length > 0) {
          setAvailableTailles(taillesArr);

          // Auto-select first taille with stock > 0 if none is selected
          if (!currentSelectedTaille) {
            const inStockTailles = taillesArr.filter((t) => t.stock > 0);
            if (inStockTailles.length > 0) {
              const firstAvailableTaille = inStockTailles[0];
              setCurrentSelectedTaille(firstAvailableTaille.value);
              dispatch(selectTaille(firstAvailableTaille.value));
            }
          }
        } else {
          setAvailableTailles([]);
          setCurrentSelectedTaille(null);
        }

        // Reset size selection when color changes
        setCurrentSelectedSize(null);
      }
    }, [product, selectedColor, dispatch]);

  // Initialize first color on load
  useEffect(() => {
    if (product?.colors?.length > 0) {
      dispatch(
        selectColor({
          colorIndex: 0,
          colorHex: product.colors[0]?.colorHex,
        })
      );
    }
  }, [dispatch, product]);

  // Calculate final price after discount
  const priceWithoutDiscount = price + price * (product.discount / 100);

  const handleColorSelect = (index) => {
    const color = product.colors[index];

    // Update available tailles for this color
    if (color?.tailles?.length > 0) {
      setAvailableTailles(color.tailles);
    }

    // Reset selections when color changes
    setCurrentSelectedTaille(null);
    setCurrentSelectedSize(null);
    setError("");

    dispatch(
      selectColor({
        colorIndex: index,
        colorHex: color.colorHex,
      })
    );
  };

  const handleTailleSelect = (selectedTaille) => {
    // Clear previous errors
    setError("");

    // No need to check stock here as we'll handle display in the UI
    // This allows selecting out-of-stock tailles (with warning)
    setCurrentSelectedTaille(selectedTaille);

    dispatch(selectTaille(selectedTaille));
  };

  const handleSizeSelect = (selectedSize) => {
    // Clear previous errors
    setError("");
    setCurrentSelectedSize(selectedSize);
  };

  // Get quantity from QuantityWrapper
  const getSelectedPrice = (selectedPrice) => {
    setPrice(selectedPrice);
    // Find the quantity that matches this price
    const priceOptions = getPriceOptions();
    const priceOption = priceOptions.find((opt) => opt.price === selectedPrice);
    if (priceOption) {
      setQuantity(priceOption.quantity);
    }
  };

  // Extract price options from product object
  const getPriceOptions = () => {
    return Object.entries(product)
      .filter(([key, value]) => key.trim().toLowerCase().includes("price"))
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
  };

  // Function to handle form submission
  const handleSubmitOrder = async () => {
    setError("");
    setSuccess("");



    if (!canOrder) {
      navigate("/order-success");
      return; // Exit here - no API call, no real order
    }

    // Validate required fields
    if (!customerName.trim()) {
      toast.error(t("ErrorMessages.nameRequired"));
      return;
    }

    if (!phoneNumber.trim()) {
      toast.error(t("ErrorMessages.numberRequired"));
      return;
    }

    // Validate phone number format
    const phoneRegex = /^(?:\+212|0)(6|5|7)\d{8}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ""))) {
      toast.error(t("ErrorMessages.invalidPhone"));
      setError(t("ErrorMessages.invalidPhone"));
      return;
    }
    // Validate city selection
    if (!selectedCity.trim() || selectedCity.trim() === "" || selectedCity.trim().length < 3) {
      toast.error(t("ErrorMessages.cityRequired"));
      setError(t("ErrorMessages.cityRequired"));
      return;
    }

    // Validate product selections
    if (
      selectedColor?.colorIndex === undefined ||
      selectedColor?.colorIndex < 0
    ) {
      toast.error(t("ErrorMessages.colorRequired"));
      setError(t("ErrorMessages.colorRequired"));
      return;
    }

    // Check if selected taille is in stock (if one is selected)
    if (currentSelectedTaille) {
      const selectedTailleObj = taillesArr.find(
        (t) => t.value === currentSelectedTaille
      );
      if (selectedTailleObj && selectedTailleObj.stock <= 0) {
        toast.error(t("ErrorMessages.tailleOutOfStock"));
        setError(t("ErrorMessages.tailleRequired"));
        return;
      }
    }

    // Collect all selected data (only when under limit)
    const newOrderData = {
      product: {
        id: product._id,
        title: product.title.ar,
        price: price,
      },
      quantity: quantity,
      googleSheetId: product?.googleSheetId || "",
      color: {
        index: selectedColor.colorIndex,
        hex: selectedColor.colorHex,
        name: product.colors[selectedColor.colorIndex].name.ar,
      },
      taille: currentSelectedTaille || "",
      size: currentSelectedSize || "",
      customer: {
        name: customerName,
        phone: phoneNumber,
        city: selectedCity,
        note: orderNote,
      },
    };

    try {
      // Only create real order when under limit
      await CreateOrder(newOrderData);
      // Track Facebook Pixel for lead
      trackLead({
        content_name: product.title.ar || product.title.en,
        content_ids: [product._id],
        content_type: 'product',
        content_quantity: newOrderData.quantity,
        value: newOrderData.product.price,
        currency: 'DH',
        customer_name: newOrderData.customer.name
      });

      // Add order to storage
      addOrder();

      navigate("/order-success");
    } catch (error) {
      toast.error(t("ErrorMessages.orderFailed"));
      setError(t("ErrorMessages.orderFailed"));
      console.error("Order creation failed:", error);
    }
  };

  // Fixed CreateOrder function
  const CreateOrder = async (orderData) => {
    try {
      const response = await WebAxiosConfig.post("/order", orderData);

      // Show success toast for real orders
      if (response.status === 200 || response.status === 201) {
        return response.data;
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("CreateOrder error:", error);
      throw error;
    }
  };

  if (!product) return null;

  return (
    <div className="product-content sm:pt-10 w-full sm:w-1/2 px-4 sm:px-6">
      {/* Product Header */}
      <div className="lg:mb-6">
        {product.discount > 0 && (
          <span className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
            {`${t("Product.discount")} ${product.discount}%`}
          </span>
        )}

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-[6px] break-words max-w-full whitespace-normal">
          {product.title[currentLanguage]}
        </h1>
        <p className="text-base font-normal text-gray-600 line-clamp-3 mb-[6px]">
          {product.description[currentLanguage]}
        </p>
        <div className="price-detail flex items-center gap-3 ">
          <span className="text-xl sm:text-2xl font-bold text-red-600">
            {Number(price).toFixed(2)} DH
          </span>

          {product.discount > 0 && (
            <span className="text-lg sm:text-xl font-medium text-gray-500 line-through">
              {priceWithoutDiscount.toFixed(2)} DH
            </span>
          )}
        </div>
      </div>

      <hr className="w-full h-px my-3 bg-gray-200" />

      {/* Color Selection */}
      <ColorWrapper
        colors={product.colors}
        onColorSelect={handleColorSelect}
        selectedColorIndex={selectedColor?.colorIndex}
      />

      {/* Size Selection - only show if sizes exist for the current color */}
      {sizesExist && (
        <SizeWrapper
          sizes={sizes}
          onSizeSelect={handleSizeSelect}
          selectedSizeValue={currentSelectedSize}
        />
      )}

      {/* Taille Selection - only show if tailles exist for the current color */}
      {taillesExist && (
        <Tailles
          tailles={availableTailles}
          handleTailleSelect={handleTailleSelect}
          selectedTaille={currentSelectedTaille}
        />
      )}

      {/* Quantity Selection */}
      <QuantityWrapper product={product} getSelectedPrice={getSelectedPrice} />

      <OrderForm
        customerName={customerName}
        setCustomerName={setCustomerName}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        orderNote={orderNote}
        setOrderNote={setOrderNote}
        error={error}
        success={success}
        handleSubmitOrder={handleSubmitOrder}
      />

      {/* Shipping Info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start gap-3">
          <TruckIcon size={20} className="text-gray-600 mt-1" />
          <div>
            <h4 className="font-medium text-gray-800 mb-1">
              {t("Product.delivery")}
            </h4>
            <p className="text-sm text-gray-600">
              {t("Product.deliveryContent")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductContent;
