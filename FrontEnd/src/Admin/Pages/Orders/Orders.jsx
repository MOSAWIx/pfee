import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AdminOrdersSelector from "../../Selectors/AdminOrdersSelectror";
import {
  fetchOrders,
  updateOrderStatus,
  deleteOrder,
} from "../../Features/Orders/Action/OrderAction";
import {
  FaEye,
  FaPencilAlt,
  FaTrash,
  FaSpinner,
  FaBoxOpen,
  FaTimes,
  FaUser,
  FaPhone,
  FaBox,
  FaPalette,
  FaRuler,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaCity,
} from "react-icons/fa";
import { BiError, BiNote } from "react-icons/bi";
import { BsInbox } from "react-icons/bs";

const OrderDetailsModal = ({ order, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Order Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Status Badge */}
          {order.status && (
            <div className="mb-6">
              <span
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-sm
                                ${
                                  order.status === "completed"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-800"
                                    : order.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800"
                                    : order.status === "processing"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800"
                                    : order.status === "cancelled"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border border-red-200 dark:border-red-800"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600"
                                }`}
              >
                <span
                  className={`mr-2 h-2 w-2 rounded-full ${
                    order.status === "completed"
                      ? "bg-green-500"
                      : order.status === "pending"
                      ? "bg-yellow-500"
                      : order.status === "processing"
                      ? "bg-blue-500"
                      : order.status === "cancelled"
                      ? "bg-red-500"
                      : "bg-gray-500"
                  }`}
                ></span>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          )}

          {/* Product Information */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <FaBox className="mr-2" /> Product Details
            </h4>
            <div className="space-y-3">
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium">Title:</span>{" "}
                {order.product.title}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium">Price:</span> 
                {order.product.price.toFixed(2)} MAD
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium">Quantity:</span> {order.quantity}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium">Total:</span> 
                {(order.product.price * order.quantity).toFixed(2)} MAD
              </p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <FaUser className="mr-2" /> Customer Details
            </h4>
            <div className="space-y-3">
              <p className="flex items-center text-gray-600 dark:text-gray-300">
                <FaUser className="mr-2 h-4 w-4" />
                {order.customer.name}
              </p>
              <p className="flex items-center text-gray-600 dark:text-gray-300">
                <FaCity className="mr-2 h-4 w-4" />
                {order.customer?.city}
              </p>
              <p className="flex items-center text-gray-600 dark:text-gray-300">
                <FaPhone className="mr-2 h-4 w-4" />
                {order.customer.phone}
              </p>
              {order.customer.note && (
                <p className="flex items-start text-gray-600 dark:text-gray-300">
                  <BiNote className="mr-2 h-4 w-4 mt-1" />
                  <span className="flex-1">{order.customer.note}</span>
                </p>
              )}
            </div>
          </div>

          {/* Product Specifications */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <FaPalette className="mr-2" /> Product Specifications
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="flex items-center text-gray-600 dark:text-gray-300">
                  <FaPalette className="mr-2 h-4 w-4" />
                  <span className="font-medium mr-2">Color:</span>
                  <span className="flex items-center">
                    <span
                      className="h-4 w-4 rounded mr-2"
                      style={{ backgroundColor: order.color.hex }}
                    ></span>
                    {order.color.name}
                  </span>
                </p>
              </div>
              {(order.taille || order.size) && (
                <div className="space-y-2">
                  <p className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaRuler className="mr-2 h-4 w-4" />
                    <span className="font-medium mr-2">Size:</span>
                    {order.taille || order.size}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Date */}
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            Order placed on: {new Date(order.createdAt).toLocaleString()}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6">
          <button
            onClick={onClose}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Orders = () => {
  const dispatch = useDispatch();
  const orders = useSelector(AdminOrdersSelector.selectOrders);
  const loading = useSelector(AdminOrdersSelector.selectOrdersLoading);
  const error = useSelector(AdminOrdersSelector.selectOrdersError);
  const totalOrders = useSelector(AdminOrdersSelector.selectTotalOrders);
  const currentPage = useSelector(AdminOrdersSelector.selectCurrentPage);
  const totalPages = useSelector(AdminOrdersSelector.selectTotalPages);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // State for filtering
  const [statusFilter, setStatusFilter] = useState("all");
  const ordersPerPage = 10;

  useEffect(() => {
    loadOrders();
  }, [statusFilter, currentPage]);

  const loadOrders = () => {
    dispatch(
      fetchOrders({
        page: currentPage,
        limit: ordersPerPage,
        status: statusFilter,
      })
    );
  };

  // Pagination controls
  const handlePageChange = (pageNumber) => {
    dispatch(
      fetchOrders({
        page: pageNumber,
        limit: ordersPerPage,
        status: statusFilter,
      })
    );
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus })).then(() => {
      // Reload the current page after status update
      loadOrders();
    });
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      dispatch(deleteOrder(orderId)).then(() => {
        // Reload the current page after deletion
        loadOrders();
      });
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const renderPaginationButtons = () => {
    const maxVisiblePages = 5; // Number of page buttons to show
    const pages = [];

    if (totalPages <= maxVisiblePages) {
      // If total pages are less than maxVisiblePages, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of visible pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the start
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, maxVisiblePages - 1);
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - maxVisiblePages + 2);
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin h-12 w-12 text-blue-500 dark:text-blue-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative flex items-center"
          role="alert"
        >
          <BiError className="h-5 w-5 mr-2" />
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header with Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Orders Management
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-500 dark:text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  handlePageChange(1); // Reset to first page when filter changes
                }}
                className="rounded-lg px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total: {totalOrders} orders
            </div>
          </div>
        </div>

        {/* Empty State or Table */}
        {orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <BsInbox className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                  <FaBoxOpen className="h-8 w-8 text-gray-300 dark:text-gray-600 absolute -bottom-2 -right-2 transform rotate-12" />
                </div>
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                No Orders Found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                {statusFilter === "all"
                  ? "No orders have been placed yet. Check back later or refresh the page."
                  : `No orders with status "${statusFilter}" found.`}
              </p>
              <button
                onClick={() => {
                  setStatusFilter("all");
                  loadOrders();
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <FaSpinner className="h-4 w-4 mr-2" />
                {statusFilter === "all" ? "Refresh Orders" : "Show All Orders"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-hidden shadow-xl rounded-lg bg-white dark:bg-gray-800 mb-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Product
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Customer
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Specifications
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Total
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {orders.map((order) => (
                      <tr
                        key={order.product.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-200 font-medium">
                            {order.product.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {order.product.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-200">
                            {order.customer.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {order.customer.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span
                              className="h-4 w-4 rounded"
                              style={{ backgroundColor: order.color.hex }}
                            ></span>
                            <span className="text-sm text-gray-900 dark:text-gray-200">
                              {order.taille || order.size || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={order.status || ""}
                            onChange={(e) =>
                              handleStatusUpdate(order._id, e.target.value)
                            }
                            className={`rounded-full px-4 py-2 text-sm font-semibold border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              order.status === "completed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800 focus:ring-green-500"
                                : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800 focus:ring-yellow-500"
                                : order.status === "processing"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800 focus:ring-blue-500"
                                : order.status === "cancelled"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800 focus:ring-red-500"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 focus:ring-gray-500"
                            }`}
                          >
                            <option value="" disabled>
                              Set Status
                            </option>
                            <option
                              value="pending"
                              className="bg-yellow-50 text-yellow-800"
                            >
                              Pending
                            </option>
                            <option
                              value="processing"
                              className="bg-blue-50 text-blue-800"
                            >
                              Processing
                            </option>
                            <option
                              value="completed"
                              className="bg-green-50 text-green-800"
                            >
                              Completed
                            </option>
                            <option
                              value="cancelled"
                              className="bg-red-50 text-red-800"
                            >
                              Cancelled
                            </option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                          {(order.product.price * order.quantity).toFixed(2)} MAD
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleViewOrder(order)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                            >
                              <FaEye className="h-4 w-4" />
                            </button>
                            <button className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300">
                              <FaPencilAlt className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order._id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            >
                              <FaTrash className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="flex items-center">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * ordersPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * ordersPerPage, totalOrders)}
                  </span>{" "}
                  of <span className="font-medium">{totalOrders}</span> orders
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <FaChevronLeft className="h-4 w-4" />
                </button>

                {renderPaginationButtons().map((page, index) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-gray-500"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <FaChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Order Details Modal */}
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={selectedOrder !== null}
          onClose={() => setSelectedOrder(null)}
        />
      </div>
    </div>
  );
};

export default Orders;