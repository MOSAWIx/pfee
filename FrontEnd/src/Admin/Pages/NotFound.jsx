import { Home} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">


        {/* Large 404 with Admin Theme */}
        <div className="mb-8">
          <h1 className="flex items-center text-[#111827] justify-center text-[120px] md:text-[150px] font-black text-gray-800 leading-none select-none">
           404
          </h1>
        </div>

        {/* Error Message */}
        <div className="space-y-4 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                {t('not_found_admin.title')}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {t('not_found_admin.description')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mb-12">
        <Link to="/admin" className="bg-[#111827] w-full bg-gray-800 text-white px-6 py-3 font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-3 rounded-lg">
            <Home size={20} />
            {t('not_found_admin.go_back_home')}
          </Link>
        </div>

        {/* Admin Quick Links */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Access
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/admin/products" className="p-3 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors text-center border border-gray-200">
              Products
            </Link>
            <Link to="/admin/orders" className="p-3 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors text-center border border-gray-200">
              Orders
            </Link>
            <Link to="/admin/categories" className="p-3 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors text-center border border-gray-200">
              Categories
            </Link>
            <Link to="/admin/" className="p-3 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors text-center border border-gray-200">
            Dashboard
            </Link>

          </div>
        </div>


      </div>
    </div>
  );
}