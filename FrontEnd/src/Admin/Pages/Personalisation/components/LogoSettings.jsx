import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { fetchLogo, updateLogo } from "../../../Features/Settings/logoSlice/LogoAction";
import { FaUpload } from "react-icons/fa";

const LogoSettings = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.admin.logo);
  const [logo, setLogo] = useState({ url: "", alt: "Website Logo" });
  const [preview, setPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    getTheLogo();
  }, []);

  const getTheLogo = async () => {
    try {
      // Force refresh to get latest logo data for admin
      const resultAction = await dispatch(fetchLogo({ forceRefresh: true }));
      if (fetchLogo.fulfilled.match(resultAction)) {
        const logoData = resultAction.payload.data || resultAction.payload;
        setLogo({
          url: logoData.url || logoData.path || "",
          alt: logoData.alt || logoData.altText || "Website Logo"
        });
        setPreview(logoData.url || logoData.path || "");
      } else {
        toast.error("Failed to fetch logo settings");
      }
    } catch (error) {
      console.error("Error fetching logo:", error);
      toast.error("Failed to fetch logo settings");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    // Store the selected file
    setSelectedFile(file);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    
    toast.success("Image selected successfully");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error("Please select a logo image");
      return;
    }

    try {
      // Pass the file and alt text to the Redux action
      const resultAction = await dispatch(updateLogo({
        logoFile: selectedFile,
        altText: logo.alt
      }));
      
      if (updateLogo.fulfilled.match(resultAction)) {
        toast.success("Logo settings updated successfully");
        
        // Update the logo state with the response data
        const responseData = resultAction.payload.data || resultAction.payload;
        const newLogoUrl = responseData.url || responseData.path;
        
        setLogo(prev => ({
          ...prev,
          url: newLogoUrl
        }));
        
        // Clear the selected file since it's now uploaded
        setSelectedFile(null);
        
        // Update preview with the final URL
        setPreview(newLogoUrl);

        // Optional: Show success message with cache clear info
        toast.success("Logo updated! Client caches will refresh automatically.", {
          duration: 4000,
          icon: '🔄'
        });
      } else {
        toast.error(resultAction.payload?.message || "Failed to update logo settings");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update logo settings");
    }
  };

  // Cleanup preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700/20 p-6 border dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Logo Settings</h2>
        
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-md">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Note:</strong> After updating the logo, client applications will automatically 
            refresh their cached logo on the next visit. Changes may take a few moments to appear 
            across all user sessions.
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Logo Image
            </label>
            
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center bg-gray-50 dark:bg-gray-700/50">
              {preview ? (
                <img
                  src={preview.startsWith('blob:') ? preview : `${import.meta.env.VITE_API_BASE_URL}${preview}`}
                  alt={logo.alt}
                  className="mx-auto max-h-32 object-contain mb-4 rounded"
                />
              ) : (
                <div className="text-gray-500 dark:text-gray-400 mb-4">
                  <FaUpload className="mx-auto text-4xl mb-2" />
                  <p className="text-lg">No logo uploaded</p>
                </div>
              )}
              
              <label className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-sm">
                <FaUpload className="mr-2" />
                {selectedFile ? 'Change Logo' : 'Upload Logo'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              
              {selectedFile && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Alt Text
            </label>
            <input
              type="text"
              value={logo.alt}
              onChange={(e) => setLogo((prev) => ({ ...prev, alt: e.target.value }))}
              placeholder="Enter alt text for the logo"
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              This text will be shown if the image fails to load
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={getTheLogo}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              Refresh
            </button>
            
            <button
              type="submit"
              disabled={loading || !selectedFile}
              className="px-6 py-2 bg-green-600 dark:bg-green-700 text-white rounded hover:bg-green-700 dark:hover:bg-green-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogoSettings;