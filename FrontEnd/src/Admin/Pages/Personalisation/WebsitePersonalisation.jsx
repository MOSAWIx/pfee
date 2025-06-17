import { Tab } from "@headlessui/react";
import { Image, Palette, Tag, Layout, Globe } from "lucide-react";
import LogoSettings from "./components/LogoSettings";
import OffersManagement from "./components/OffersManagement";
import HeroSliderManager from "./components/HeroSliderSettings";
import ColorSettings from "./components/ColorSettings";
import SocialMedia from "./components/SocialMedia";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function WebsitePersonalisation() {
  const tabs = [
    {
      id: "logo",
      name: "Logo & Branding",
      icon: Image,
      component: LogoSettings,
    },
    {
      id: "hero",
      name: "Hero Section",
      icon: Layout,
      component: HeroSliderManager,
    },
    { id: "offers", name: "Offers", icon: Tag, component: OffersManagement },
    { id: "colors", name: "Colors", icon: Palette, component: ColorSettings },
    {
      id: "social-media",
      name: "Social Media",
      icon: Globe,
      component: SocialMedia,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Website Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your e-commerce website appearance and content
          </p>
        </div>

        {/* Tabs */}
        <Tab.Group>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <Tab.List className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 m-4 rounded-lg">
              {tabs.map((tab) => (
                <Tab
                  key={tab.id}
                  className={({ selected }) =>
                    classNames(
                      "flex items-center gap-2 rounded-lg py-3 px-4 text-sm font-medium leading-5 transition-all duration-200",
                      "ring-white dark:ring-gray-300 ring-opacity-60 ring-offset-2 ring-offset-blue-400 dark:ring-offset-gray-800 focus:outline-none focus:ring-2",
                      selected
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white shadow-lg transform scale-105"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white hover:shadow-md"
                    )
                  }
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.name}
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels className="p-6">
              {tabs.map((tab) => (
                <Tab.Panel
                  key={tab.id}
                  className="focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-opacity-50 rounded-lg"
                >
                  <tab.component />
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </div>
        </Tab.Group>
      </div>
    </div>
  );
}

export default WebsitePersonalisation;
