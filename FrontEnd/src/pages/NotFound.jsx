import { Home, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl mx-auto text-center px-2">
      {/* Large 404 */}
      <motion.h1 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mt-10 flex items-center justify-center text-[180px] md:text-[240px] font-black text-black leading-none select-none"
      >
        404
      </motion.h1>

      {/* Error Message */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="space-y-4 mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-black">
          {t("not_found.title")}
        </h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
          {t("not_found.description")}
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to={"/"}
            className="bg-black text-white px-8 py-4 text-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-3 min-w-[200px] justify-center"
          >
            <Home size={20} />
            {t("not_found.go_back_home")}
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
