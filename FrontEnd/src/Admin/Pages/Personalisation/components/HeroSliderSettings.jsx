import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Upload,
  Save,
  RefreshCw,
  Globe,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Wifi,
  WifiOff,
} from "lucide-react";

import {
  getHeroData,
  createHeroSliders,
  deleteHeroSlider,
  refreshHeroData,
  useHeroDataListener,
} from "../../../util/heroHelper";
import toast from "react-hot-toast";

const HeroSliderManager = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dataSource, setDataSource] = useState("");
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [expandedSliders, setExpandedSliders] = useState(new Set());
  const [darkMode, setDarkMode] = useState(false);
  const [isDataCached, setIsDataCached] = useState(false);
  const [backgroundUpdateAvailable, setBackgroundUpdateAvailable] =
    useState(false);

  // Language options
  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "ar", name: "العربية", flag: "🇲🇦" },
  ];

  // Initialize empty slider
  const createEmptySlider = () => ({
    id: `new_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    isNew: true,
    title: { en: "", fr: "", ar: "" },
    subtitle: { en: "", fr: "", ar: "" },
    description: { en: "", fr: "", ar: "" },
    buttonText: { en: "", fr: "", ar: "" },
    desktopImage: null,
    mobileImage: null,
    desktopImagePreview: "",
    mobileImagePreview: "",
  });

  // Load existing sliders with fast loading
  useEffect(() => {
    loadSlidersWithFastLoading();
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
  }, []);

  // Listen for background updates
  useEffect(() => {
    const cleanup = useHeroDataListener((updatedData) => {
      console.log("Hero data updated in background!", updatedData);

      // Show notification that new data is available
      setBackgroundUpdateAvailable(true);
      toast.success("New hero data available! Click refresh to update.", {
        duration: 5000,
        icon: "🔄",
      });

      // Optionally auto-update the data
      // updateSlidersFromBackgroundData(updatedData);
    });

    return cleanup;
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const loadSlidersWithFastLoading = async () => {
    try {
      setLoading(true);
      setError("");
      setBackgroundUpdateAvailable(false);

      // Fast load (uses cache if available, updates in background)
      const result = await getHeroData();

      if (result && result.data) {
        const formattedSliders = formatSlidersData(result.data);
        setSliders(formattedSliders);
        setDataSource(result.source);
        setIsDataCached(result.cached || false);

        // Expand all sliders by default
        setExpandedSliders(new Set(formattedSliders.map((s) => s.id)));

        // Show different messages based on data source
        if (result.cached) {
          if (result.fallback) {
            toast.error("Server unavailable. Using cached data as fallback.", {
              icon: "⚠️",
              duration: 4000,
            });
          } else {
            toast.success("Data loaded from cache! Checking for updates...", {
              icon: "⚡",
              duration: 2000,
            });
          }
        } else {
          toast.success("Fresh data loaded from server!", {
            icon: "🌟",
            duration: 2000,
          });
        }
      }
    } catch (error) {
      console.error("Error loading sliders:", error);
      toast.error(
        "Failed to load sliders: " + (error.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const formatSlidersData = (data) => {
    return data.map((slider, index) => ({
      id: slider._id || `existing_${index}`,
      isNew: false,
      title: slider.title || { en: "", fr: "", ar: "" },
      subtitle: slider.subtitle || { en: "", fr: "", ar: "" },
      description: slider.description || { en: "", fr: "", ar: "" },
      buttonText: slider.buttonText || { en: "", fr: "", ar: "" },
      desktopImage: null,
      mobileImage: null,
      desktopImagePreview: slider.backgroundImage?.desktop
        ? `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5555"}${
            slider.backgroundImage.desktop
          }`
        : "",
      mobileImagePreview: slider.backgroundImage?.mobile
        ? `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5555"}${
            slider.backgroundImage.mobile
          }`
        : "",
    }));
  };

  const updateSlidersFromBackgroundData = (updatedData) => {
    const formattedSliders = formatSlidersData(updatedData.data);
    setSliders(formattedSliders);
    setDataSource("background_update");
    setIsDataCached(false);
    setBackgroundUpdateAvailable(false);

    // Maintain expanded state for existing sliders
    const existingIds = new Set(sliders.map((s) => s.id));
    const newExpandedSliders = new Set();

    formattedSliders.forEach((slider) => {
      if (existingIds.has(slider.id) && expandedSliders.has(slider.id)) {
        newExpandedSliders.add(slider.id);
      }
    });

    setExpandedSliders(newExpandedSliders);
    toast.success("Data updated with latest changes!", { icon: "✨" });
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setBackgroundUpdateAvailable(false);

      // Force refresh (bypass cache)
      const result = await getHeroData({ forceRefresh: true });

      if (result && result.data) {
        const formattedSliders = formatSlidersData(result.data);
        setSliders(formattedSliders);
        setDataSource(result.source);
        setIsDataCached(false);

        toast.success("Data refreshed successfully!", { icon: "🔄" });
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error(
        "Failed to refresh data: " + (error.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackgroundUpdate = () => {
    // This would be called when user clicks to apply background updates
    if (backgroundUpdateAvailable) {
      // In a real scenario, you'd get the updated data from the listener
      // For now, just trigger a refresh
      handleRefresh();
    }
  };

  const addSlider = () => {
    const newSlider = createEmptySlider();
    setSliders([...sliders, newSlider]);
    // Auto-expand the new slider
    setExpandedSliders((prev) => new Set([...prev, newSlider.id]));
  };

  const removeSlider = async (index) => {
    const slider = sliders[index];

    try {
      // If it's an existing slider (not a new one), delete from server
      if (!slider.isNew && slider.id && !slider.id.startsWith("new_")) {
        setLoading(true);
        await deleteHeroSlider(slider.id);
        toast.success("Slider deleted successfully!");
      }

      // Remove from local state
      const newSliders = sliders.filter((_, i) => i !== index);
      setSliders(newSliders);

      // Remove from expanded set
      setExpandedSliders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(slider.id);
        return newSet;
      });
    } catch (error) {
      console.error("Error deleting slider:", error);
      toast.error(
        "Failed to delete slider: " + (error.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const updateSliderField = (index, field, value, language = null) => {
    const updatedSliders = [...sliders];

    if (language) {
      updatedSliders[index][field][language] = value;
    } else {
      updatedSliders[index][field] = value;
    }

    setSliders(updatedSliders);
  };

  const handleImageUpload = (index, type, file) => {
    const updatedSliders = [...sliders];
    updatedSliders[index][type] = file;

    // Create preview URL
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      updatedSliders[index][`${type}Preview`] = previewUrl;
    } else {
      updatedSliders[index][`${type}Preview`] = "";
    }

    setSliders(updatedSliders);
  };

  const toggleSliderExpansion = (sliderId) => {
    setExpandedSliders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sliderId)) {
        newSet.delete(sliderId);
      } else {
        newSet.add(sliderId);
      }
      return newSet;
    });
  };

  const validateSliders = () => {
    const errors = [];

    sliders.forEach((slider, index) => {
      // Check if desktop image is provided (either file or existing)
      if (!slider.desktopImage && !slider.desktopImagePreview) {
        errors.push(`Slider ${index + 1}: Desktop image is required`);
      }
    });

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (sliders.length === 0) {
      toast.error("Please add at least one slider");
      return;
    }

    // Validate sliders
    const validationErrors = validateSliders();
    if (validationErrors.length > 0) {
      toast.error(
        "Please fix the following errors:\n" + validationErrors.join("\n")
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      // Create FormData for file uploads
      const formData = new FormData();

      // Prepare sliders data (without files) - ensure all required fields are present
      const slidersData = sliders.map((slider, index) => {
        const sliderData = {
          title: {
            en: slider.title.en || "",
            fr: slider.title.fr || "",
            ar: slider.title.ar || "",
          },
          subtitle: {
            en: slider.subtitle.en || "",
            fr: slider.subtitle.fr || "",
            ar: slider.subtitle.ar || "",
          },
          description: {
            en: slider.description.en || "",
            fr: slider.description.fr || "",
            ar: slider.description.ar || "",
          },
          buttonText: {
            en: slider.buttonText.en || "",
            fr: slider.buttonText.fr || "",
            ar: slider.buttonText.ar || "",
          },
        };

        // Only include ID for existing sliders
        if (!slider.isNew && slider.id && !slider.id.startsWith("new_")) {
          sliderData.id = slider.id;
        }

        return sliderData;
      });

      // Add sliders data as JSON string
      formData.append("sliders", JSON.stringify(slidersData));

      // Add images with proper field names that match the server expectation
      sliders.forEach((slider, index) => {
        if (slider.desktopImage instanceof File) {
          formData.append(
            `sliders[${index}][desktopImage]`,
            slider.desktopImage
          );
        }
        if (slider.mobileImage instanceof File) {
          formData.append(`sliders[${index}][mobileImage]`, slider.mobileImage);
        }
      });

      const result = await createHeroSliders(formData);

      if (result.success) {
        toast.success("Sliders saved successfully!");
        // Reload sliders with fast loading to get updated data
        await loadSlidersWithFastLoading();
      } else {
        toast.error(
          "Failed to save sliders: " + (result.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error saving sliders:", error);
      toast.error(
        "Failed to save sliders: " + (error.message || "Unknown error")
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-lg"></div>
        </div>
        <span className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          Loading sliders...
        </span>
      </div>
    );
  }

  const currentLang = languages.find((lang) => lang.code === activeLanguage);

  return (
    <div
      className={`max-w-6xl mx-auto p-6 rounded-lg shadow-lg transition-colors duration-300 dark:bg-gray-800 dark:text-white bg-white text-gray-800"`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold dark:text-white">
          Hero Slider Management
        </h2>

        <div className="flex flex-wrap gap-2">
        

          {/* Language Switcher */}
          <div
            className={`flex items-center rounded-lg p-1 ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setActiveLanguage(lang.code)}
                className={`flex items-center gap-1 px-3 py-1 rounded transition-colors text-sm ${
                  activeLanguage === lang.code
                    ? "bg-blue-500 text-white"
                    : darkMode
                    ? "text-gray-300 hover:bg-gray-600"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{lang.flag}</span>
                <span className="hidden sm:inline">{lang.name}</span>
              </button>
            ))}
          </div>

          {/* Background update button */}
          {backgroundUpdateAvailable && (
            <button
              onClick={handleBackgroundUpdate}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors animate-pulse"
              title="New data available - click to update"
            >
              <RefreshCw size={16} />
              Update Available
            </button>
          )}

          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-600 transition-colors disabled:opacity-50 ${
              darkMode ? "bg-gray-600 text-white" : "bg-gray-500 text-white"
            }`}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            onClick={addSlider}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            <Plus size={16} />
            Add Slider
          </button>
        </div>
      </div>

      {/* Current Language and Data Source Indicator */}
      <div
        className={`mb-4 p-3 rounded-lg flex items-center justify-between ${
          darkMode ? "bg-blue-900 bg-opacity-30" : "bg-blue-50"
        }`}
      >
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-blue-600 dark:text-blue-400" />
          <span
            className={`text-sm ${
              darkMode ? "text-blue-300" : "text-blue-700"
            }`}
          >
            Editing in:{" "}
            <strong>
              {currentLang?.flag} {currentLang?.name}
            </strong>
            {dataSource && ` • Data from: ${dataSource}`}
          </span>
        </div>

        {/* Connection status indicator */}
        <div className="flex items-center gap-2">
          {isDataCached ? (
            <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
              <WifiOff size={14} />
              <span className="text-xs">Cached</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <Wifi size={14} />
              <span className="text-xs">Live</span>
            </div>
          )}
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div
          className={`mb-4 p-3 border rounded-lg ${
            darkMode
              ? "bg-red-900 bg-opacity-30 border-red-700"
              : "bg-red-50 border-red-200"
          }`}
        >
          <span className={darkMode ? "text-red-300" : "text-red-700"}>
            {error}
          </span>
        </div>
      )}

      {success && (
        <div
          className={`mb-4 p-3 border rounded-lg ${
            darkMode
              ? "bg-green-900 bg-opacity-30 border-green-700"
              : "bg-green-50 border-green-200"
          }`}
        >
          <span className={darkMode ? "text-green-300" : "text-green-700"}>
            {success}
          </span>
        </div>
      )}

      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sliders.map((slider, index) => {
            const isExpanded = expandedSliders.has(slider.id);

            return (
              <div
                key={slider.id}
                className={`border rounded-lg overflow-hidden transition-colors ${
                  darkMode
                    ? "border-gray-700 bg-gray-700"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                {/* Slider Header */}
                <div
                  className={`flex items-center justify-between p-4 border-b ${
                    darkMode ? "bg-gray-800 border-gray-600" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleSliderExpansion(slider.id)}
                      className={
                        darkMode
                          ? "text-gray-300 hover:text-white"
                          : "text-gray-500 hover:text-gray-700"
                      }
                    >
                      {isExpanded ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>

                    <div>
                      <h3
                        className={`text-lg font-semibold ${
                          darkMode ? "text-white" : "text-gray-700"
                        }`}
                      >
                        Slider {index + 1}
                        {slider.isNew && (
                          <span
                            className={`ml-2 px-2 py-1 text-xs rounded ${
                              darkMode
                                ? "bg-green-900 text-green-200"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            New
                          </span>
                        )}
                      </h3>

                      {!isExpanded && (
                        <p
                          className={`text-sm truncate max-w-md ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {slider.title[activeLanguage] || "Untitled slider"}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeSlider(index)}
                    className={`p-2 rounded ${
                      darkMode
                        ? "text-red-400 hover:text-red-300 hover:bg-red-900 hover:bg-opacity-30"
                        : "text-red-500 hover:text-red-700 hover:bg-red-50"
                    }`}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                {/* Slider Content */}
                {isExpanded && (
                  <div className={`p-6 ${darkMode ? "bg-gray-800" : ""}`}>
                    {/* Image Uploads */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Desktop Image *
                        </label>
                        <div
                          className={`border-2 border-dashed rounded-lg p-4 text-center ${
                            darkMode ? "border-gray-600" : "border-gray-300"
                          }`}
                        >
                          {slider.desktopImagePreview ? (
                            <div className="relative">
                              <img
                                src={slider.desktopImagePreview}
                                alt="Desktop preview"
                                className="w-full h-32 object-cover rounded mb-2"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleImageUpload(index, "desktopImage", null)
                                }
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ) : (
                            <div
                              className={`h-32 flex items-center justify-center ${
                                darkMode ? "text-gray-500" : "text-gray-400"
                              }`}
                            >
                              <Upload size={32} />
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageUpload(
                                index,
                                "desktopImage",
                                e.target.files[0]
                              )
                            }
                            className={`w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 ${
                              darkMode
                                ? "text-gray-300 file:bg-blue-900 file:text-blue-200 hover:file:bg-blue-800"
                                : "text-gray-500 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Mobile Image
                        </label>
                        <div
                          className={`border-2 border-dashed rounded-lg p-4 text-center ${
                            darkMode ? "border-gray-600" : "border-gray-300"
                          }`}
                        >
                          {slider.mobileImagePreview ? (
                            <div className="relative">
                              <img
                                src={slider.mobileImagePreview}
                                alt="Mobile preview"
                                className="w-full h-32 object-cover rounded mb-2"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleImageUpload(index, "mobileImage", null)
                                }
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ) : (
                            <div
                              className={`h-32 flex items-center justify-center ${
                                darkMode ? "text-gray-500" : "text-gray-400"
                              }`}
                            >
                              <Upload size={32} />
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageUpload(
                                index,
                                "mobileImage",
                                e.target.files[0]
                              )
                            }
                            className={`w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 ${
                              darkMode
                                ? "text-gray-300 file:bg-blue-900 file:text-blue-200 hover:file:bg-blue-800"
                                : "text-gray-500 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Text Content for Active Language */}
                    <div className="space-y-4">
                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Title * ({currentLang?.name})
                        </label>
                        <input
                          type="text"
                          value={slider.title[activeLanguage]}
                          onChange={(e) =>
                            updateSliderField(
                              index,
                              "title",
                              e.target.value,
                              activeLanguage
                            )
                          }
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "border-gray-300"
                          }`}
                          placeholder={`Title in ${currentLang?.name}`}
                          required
                        />
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Subtitle ({currentLang?.name})
                        </label>
                        <input
                          type="text"
                          value={slider.subtitle[activeLanguage]}
                          onChange={(e) =>
                            updateSliderField(
                              index,
                              "subtitle",
                              e.target.value,
                              activeLanguage
                            )
                          }
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "border-gray-300"
                          }`}
                          placeholder={`Subtitle in ${currentLang?.name}`}
                        />
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Description ({currentLang?.name})
                        </label>
                        <textarea
                          value={slider.description[activeLanguage]}
                          onChange={(e) =>
                            updateSliderField(
                              index,
                              "description",
                              e.target.value,
                              activeLanguage
                            )
                          }
                          rows={3}
                          className={`w-full px-3
py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "border-gray-300"
                          }`}
                          placeholder={`Description in ${currentLang?.name}`}
                        />
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Button Text ({currentLang?.name})
                        </label>
                        <input
                          type="text"
                          value={slider.buttonText[activeLanguage]}
                          onChange={(e) =>
                            updateSliderField(
                              index,
                              "buttonText",
                              e.target.value,
                              activeLanguage
                            )
                          }
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "border-gray-300"
                          }`}
                          placeholder={`Button text in ${currentLang?.name}`}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {sliders.length === 0 && (
            <div
              className={`col-span-full text-center py-12 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <p className="text-lg mb-4">No sliders added yet</p>
              <button
                type="button"
                onClick={addSlider}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus size={20} />
                Add Your First Slider
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {sliders.length > 0 && (
          <div
            className={`mt-8 pt-6 border-t ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {sliders.length} slider{sliders.length !== 1 ? "s" : ""} •
                Editing in {currentLang?.name}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setSliders([]);
                    setExpandedSliders(new Set());
                  }}
                  className={`px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors ${
                    darkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Clear All
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save All Sliders
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSliderManager;
