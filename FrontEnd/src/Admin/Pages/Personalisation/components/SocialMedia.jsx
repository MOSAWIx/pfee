import React, { useState, useEffect } from "react";
import { FaFacebookF, FaInstagram, FaTiktok, FaEnvelope } from "react-icons/fa";
import { BsWhatsapp } from "react-icons/bs";
import { useForm } from "react-hook-form";
import webAxiosConfig from "../../../../config/webAxiosConfig";
import adminaxiosConfig from "../../../../config/AdminAxiosConfig";

const socialMediaLinks = [
  {
    name: "facebook",
    icon: <FaFacebookF />,
    url: "https://www.facebook.com",
    label: "Facebook",
    pattern: /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9\.]+$/,
    message: "Please enter a valid Facebook profile URL (e.g., https://www.facebook.com/username)"
  },
  {
    name: "instagram",
    icon: <FaInstagram />,
    url: "https://www.instagram.com",
    label: "Instagram",
    pattern: /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9\._]+(\/?\?.*)?$/,
    message: "Please enter a valid Instagram profile URL (e.g., https://www.instagram.com/username)"
  },
  {
    name: "tiktok",
    icon: <FaTiktok />,
    url: "https://www.tiktok.com",
    label: "TikTok",
    pattern: /^(https?:\/\/)?(www\.)?tiktok\.com\/@[a-zA-Z0-9\._]+(\/?\?.*)?$/,
    message: "Please enter a valid TikTok profile URL (e.g., https://www.tiktok.com/@username)"
  },
  {
    name: "whatsapp",
    icon: <BsWhatsapp />,
    url: "https://www.whatsapp.com",
    label: "WhatsApp",
    pattern: /^(https?:\/\/)?(wa\.me\/|whatsapp\.com\/|www\.whatsapp\.com\/)[a-zA-Z0-9\/\+]+$/,
    message: "Please enter a valid WhatsApp URL (e.g., https://wa.me/1234567890)"
  },
  {
    name: "email",
    icon: <FaEnvelope />,
    url: "mailto",
    label: "Email",
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address"
  }
];

export default function SocialMedia() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      // Transform form data to match backend expected format
      const socialMediaData = {};
      Object.keys(data).forEach((key) => {
        if (data[key] && data[key].trim() !== "") {
          // Normalize URLs by adding https:// if missing
          if (key !== "email" && data[key] && !data[key].startsWith("http")) {
            socialMediaData[key] = `https://${data[key].trim()}`;
          } else {
            socialMediaData[key] = data[key].trim();
          }
        }
      });

      const axiosAdminInstance = adminaxiosConfig(true);
      const response = await axiosAdminInstance.post("/api/social-media", {
        socialMedia: socialMediaData,
      });

      if (response.data.success) {
        setMessage("Social media settings updated successfully!");
        setMessageType("success");
      } else {
        setMessage("Failed to update social media settings.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error updating social media links:", error);
      setMessage("Error updating social media settings. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSocialMediaLinks = async () => {
      try {
        const response = await webAxiosConfig.get("/social-media");

        if (response.data.success && response.data.data) {
          const socialMediaData = response.data.data;

          // Populate form fields with existing data
          Object.keys(socialMediaData).forEach((key) => {
            if (socialMediaLinks.some(link => link.name === key)) {
              setValue(key, socialMediaData[key]);
            }
          });
        }
      } catch (error) {
        console.error("Error fetching social media links:", error);
        setMessage("Error loading social media settings.");
        setMessageType("error");
      }
    };

    fetchSocialMediaLinks();
  }, [setValue]);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700/20 border dark:border-gray-700">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Social Media Settings
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Manage your social media links here.</p>
      </div>

      {message && (
        <div
          className={`mb-4 p-4 rounded-md ${
            messageType === "success"
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700"
              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {socialMediaLinks.map((link) => (
            <div key={link.name} className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                {link.icon}
              </div>
              <div className="flex-1">
                <label
                  htmlFor={link.name}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {link.label}
                </label>
                <input
                  id={link.name}
                  type={link.name === "email" ? "email" : "url"}
                  placeholder={`Enter your ${link.label} ${link.name === "email" ? "address" : "URL"}`}
                  className={`w-full px-3 py-2 border ${
                    errors[link.name] ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent`}
                  {...register(link.name, {
                    pattern: {
                      value: link.pattern,
                      message: link.message
                    }
                  })}
                />
                {errors[link.name] && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors[link.name].message}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-md font-medium transition-colors shadow-sm ${
              loading
                ? "bg-gray-400 dark:bg-gray-600 text-gray-200 dark:text-gray-400 cursor-not-allowed"
                : "bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            }`}
          >
            {loading ? "Updating..." : "Update Social Media Links"}
          </button>
        </div>
      </form>
    </div>
  );
}