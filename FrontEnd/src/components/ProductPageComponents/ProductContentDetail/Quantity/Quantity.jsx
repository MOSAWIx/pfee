import { FaPlus, FaMinus } from "react-icons/fa";

function Quantity({ prices, selectedQuantity, selectedPrice }) {
  return (
    <div className="quantity_input flex items-center bg-white border border-gray-300 w-fit gap-2">
      <span className="font-semibold">الكمية المختارة: {selectedQuantity}</span>
      <span className="font-semibold">السعر: {selectedPrice}</span>
      {/* Add plus/minus buttons or other logic as needed */}
    </div>
  );
}

export default Quantity;
