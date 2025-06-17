import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Save, RefreshCw, Moon, Sun } from "lucide-react";
import { toast } from "react-hot-toast";

const ColorSettings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      primaryColor: "#059669",
      secondaryColor: "#3B82F6",
      accentColor: "#F59E0B",
      backgroundColor: "#FFFFFF",
      textColor: "#1F2937",
      linkColor: "#2563EB",
      buttonColor: "#059669",
      buttonHoverColor: "#047857",
    },
  });

  const watchedColors = watch();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const onSubmit = (data) => {
    console.log("Color settings updated:", data);
    toast.success("Color settings updated successfully");
  };

  const colorPresets = [
    {
      name: "Default Green",
      colors: {
        primaryColor: "#059669",
        secondaryColor: "#3B82F6",
        accentColor: "#F59E0B",
        backgroundColor: "#FFFFFF",
        textColor: "#1F2937",
        linkColor: "#2563EB",
        buttonColor: "#059669",
        buttonHoverColor: "#047857",
      },
    },
    {
      name: "Ocean Blue",
      colors: {
        primaryColor: "#0EA5E9",
        secondaryColor: "#1E40AF",
        accentColor: "#F97316",
        backgroundColor: "#FFFFFF",
        textColor: "#1E293B",
        linkColor: "#0EA5E9",
        buttonColor: "#0EA5E9",
        buttonHoverColor: "#0284C7",
      },
    },
    {
      name: "Purple Elegance",
      colors: {
        primaryColor: "#8B5CF6",
        secondaryColor: "#EC4899",
        accentColor: "#F59E0B",
        backgroundColor: "#FFFFFF",
        textColor: "#374151",
        linkColor: "#8B5CF6",
        buttonColor: "#8B5CF6",
        buttonHoverColor: "#7C3AED",
      },
    },
    {
      name: "Warm Sunset",
      colors: {
        primaryColor: "#F97316",
        secondaryColor: "#EF4444",
        accentColor: "#FBBF24",
        backgroundColor: "#FFFFFF",
        textColor: "#1F2937",
        linkColor: "#F97316",
        buttonColor: "#F97316",
        buttonHoverColor: "#EA580C",
      },
    },
    {
      name: "Dark Theme",
      colors: {
        primaryColor: "#3B82F6",
        secondaryColor: "#10B981",
        accentColor: "#F59E0B",
        backgroundColor: "#1F2937",
        textColor: "#F3F4F6",
        linkColor: "#60A5FA",
        buttonColor: "#3B82F6",
        buttonHoverColor: "#2563EB",
      },
    },
  ];

  const applyPreset = (preset) => {
    Object.entries(preset.colors).forEach(([key, value]) => {
      setValue(key, value);
    });
    toast.success(`${preset.name} theme applied`);
  };

  const ColorInput = ({ name, label }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          {...register(name)}
          className="w-10 h-10 rounded-lg cursor-pointer border border-gray-300 dark:border-gray-600"
        />
        <input
          type="text"
          {...register(name)}
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Color Settings
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Customize your application's color scheme
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ColorInput name="primaryColor" label="Primary Color" />
            <ColorInput name="secondaryColor" label="Secondary Color" />
            <ColorInput name="accentColor" label="Accent Color" />
            <ColorInput name="backgroundColor" label="Background Color" />
            <ColorInput name="textColor" label="Text Color" />
            <ColorInput name="linkColor" label="Link Color" />
            <ColorInput name="buttonColor" label="Button Color" />
            <ColorInput name="buttonHoverColor" label="Button Hover Color" />
          </div>

          {/* Preview Section */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Theme Preview
            </h3>
            <div 
              className="p-6 rounded-lg border border-gray-200 dark:border-gray-700"
              style={{ backgroundColor: watchedColors.backgroundColor }}
            >
              <div className="flex flex-wrap gap-4 items-center mb-6">
                <button
                  className="px-4 py-2 rounded-md font-medium"
                  style={{
                    backgroundColor: watchedColors.buttonColor,
                    color: 'white',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = watchedColors.buttonHoverColor}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = watchedColors.buttonColor}
                >
                  Primary Button
                </button>
                <button
                  className="px-4 py-2 rounded-md font-medium border"
                  style={{
                    borderColor: watchedColors.secondaryColor,
                    color: watchedColors.secondaryColor,
                    backgroundColor: 'transparent',
                  }}
                >
                  Secondary Button
                </button>
                <div
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: watchedColors.accentColor,
                    color: 'white',
                  }}
                >
                  Badge
                </div>
              </div>
              
              <div style={{ color: watchedColors.textColor }}>
                <h4 className="text-xl font-bold mb-2">Sample Heading</h4>
                <p className="mb-3">This is a sample paragraph showing how text will look with your selected color scheme.</p>
                <a 
                  href="#"
                  className="hover:underline"
                  style={{ color: watchedColors.linkColor }}
                >
                  This is a sample link
                </a>
              </div>
            </div>
          </div>

          {/* Color Presets */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Color Presets
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors bg-white dark:bg-gray-700"
                >
                  <div className="flex gap-2 mb-2">
                    {['primaryColor', 'secondaryColor', 'accentColor'].map((color) => (
                      <div
                        key={color}
                        className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-600"
                        style={{ backgroundColor: preset.colors[color] }}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => reset()}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              style={{
                backgroundColor: watchedColors.buttonColor,
                hoverBackgroundColor: watchedColors.buttonHoverColor
              }}
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ColorSettings;