import { ShoppingBag , Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { LanguageContext } from "../../context/language";

export default function OrderForm({
  customerName,
  setCustomerName,
  phoneNumber,
  setPhoneNumber,
  setOrderNote,
  orderNote,
  error,
  success,
  isAddingToCart,
  handleSubmitOrder,
  selectedCity,
  setSelectedCity
}) {
  const {t} = useTranslation()
  const {language} = useContext(LanguageContext)
  return (
    <div>
      {" "}
      {/* Customer Information Form */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {t("Product.orderForm.title")}
        </h3>

        <div className="space-y-4">
          {/* Customer Name */}
          <div>
            <label
              htmlFor="customerName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("Product.orderForm.name")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder={t("Product.orderForm.placeholder.name")}
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("Product.orderForm.phone")} <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              dir={language === "ar" ? "rtl" : "ltr"}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder={t("Product.orderForm.placeholder.phone")}
              required
            />
          </div>
          {/* City Input */}
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("Product.orderForm.city")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="city"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder={t("Product.orderForm.placeholder.city")}
              required
            />
          </div>
          <div>
            <label
              htmlFor="orderNote"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("Product.orderForm.note")}
            </label>
            <textarea
              id="orderNote"
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder={t("Product.orderForm.placeholder.note")}
              rows={3}
            />
          </div>
        </div>
      </div>
      {/* Error/Success Messages */}
      {error && (
        <div className="flex items-center bg-red-50 text-red-700 text-sm mt-4 mb-2 p-3 rounded-lg">
          <span className="mr-2">×</span>
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center bg-green-50 text-green-700 text-sm mt-4 mb-2 p-3 rounded-lg">
          <Check size={16} className="mr-2" />
          {success}
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex flex-col gap-3 mt-8">
        <button
          onClick={handleSubmitOrder}
          disabled={isAddingToCart}
          className={`
            font-medium text-white w-full py-4 px-6 bg-black rounded-lg 
            flex items-center justify-center gap-2 hover:bg-gray-800 
            transition-all duration-300 select-none
            ${isAddingToCart ? "opacity-70 cursor-not-allowed" : ""}
          `}
        >
          {isAddingToCart ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{t("Product.orderForm.loading")}</span>
            </>
          ) : (
            <>
              <ShoppingBag size={20} />
              <span>{t("Product.orderForm.button")}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
