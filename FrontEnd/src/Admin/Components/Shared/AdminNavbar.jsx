import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiBox, FiPlusSquare, FiList, FiEdit, FiMenu, FiSun, FiMoon, FiSettings, FiActivity } from 'react-icons/fi';
import { IoLogOutOutline } from "react-icons/io5";

import { BsArrowLeftCircle } from 'react-icons/bs';
import { FiX } from 'react-icons/fi'; // Add this to imports
import { useDispatch} from 'react-redux';
import { useSelector } from 'react-redux';
// DarkMode
import { toggleDarkMode,toggleMenuIcons } from '../../Features/UI/UiSlice';
import { UiSelectors } from '../../Selectors/UiSelectors';
import { logoutAdmin } from '../../Features/AdminAuth/AdminAuthActions/AdminAuthAction'
const AdminNavbar = () => {
    const dispatch=useDispatch();
    const darkMode=useSelector(UiSelectors.darkMode);
    // Get Token
    const token = useSelector(state => state.admin.adminAuth.token);
    const isOpen=useSelector(UiSelectors.isIcons);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
// Handle DarkMode
    const handleToggleDarkMode = () => {
        dispatch(toggleDarkMode());
    };
// Handle Icons Show
    const handleShowIcons=()=>{
        dispatch(toggleMenuIcons())
    }

    // Handle Logout
    const handleLogout=()=>{
        dispatch(logoutAdmin(token));
    }



    const menus = [
        { title: "Dashboard", icon: FiHome, link: "/admin" },
        { title: "Categories", icon: FiBox, link: "/admin/categories" },
        { title: "Add Product", icon: FiPlusSquare, link: "/admin/products/add-product" },
        { title: "Products List", icon: FiList, link: "/admin/products" },
        { title: "Orders", icon: FiEdit, link: "/admin/orders" },
        { title: "Pixels Settings", icon: FiActivity, link: "/admin/settings" },
        { title: "Website Settings", icon: FiSettings, link: "/admin/website-settings" }
    ];

    return (
        <>
            {/* Mobile Menu Button - Only show when nav is hidden */}
            {!isMobileMenuOpen && (
                <div className="lg:hidden fixed top-4 right-4 z-50">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
                    >
                        <FiMenu className="w-6 h-6 text-gray-700 dark:text-white" />
                    </button>
                </div>
            )}

            {/* Sidebar */}
            <div
                className={`${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 fixed top-0 left-0 h-screen ${
                    isOpen ? 'w-72' : 'w-20'
                } bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 ease-in-out z-40`}
            >
                <div className="flex flex-col h-full">
                    {/* Header - X button inside nav */}
                    <div className={`flex items-center justify-between ${isOpen ? 'p-4' : 'p-2'} border-b dark:border-gray-700`}>
                        {isOpen && <h1 className="text-xl font-bold text-gray-800 dark:text-white whitespace-nowrap overflow-hidden text-ellipsis">Admin Panel</h1>}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleShowIcons}
                                className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <BsArrowLeftCircle
                                    className={`w-6 h-6 transition-transform duration-300 ${
                                        isOpen ? 'rotate-0' : 'rotate-180'
                                    } text-gray-700 dark:text-white`}
                                />
                            </button>
                            {/* Close button inside nav */}
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <FiX className="w-6 h-6 text-gray-700 dark:text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Rest of the navbar remains the same */}
                    {/* Navigation Links - Update padding when closed */}
                    <nav className={`flex-1 overflow-y-auto ${isOpen ? 'p-4' : 'p-2'}`}>
                        <ul className="flex flex-col h-full">
                            <div className='flex-1 space-y-2 '>
                            {menus.map((menu) => (
                                <li key={menu.title}>
                                    <Link
                                        to={menu.link}
                                        className={`flex items-center ${
                                            isOpen ? 'space-x-3' : 'justify-center'
                                        } p-3 rounded-lg transition-colors ${
                                            location.pathname === menu.link
                                                ? 'bg-indigo-500 text-white'
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                                        }`}
                                        title={!isOpen ? menu.title : ''}
                                    >
                                        <menu.icon className="w-6 h-6" />
                                        {isOpen && <span>{menu.title}</span>}
                                    </Link>
                                </li>
                            ))}
                            </div>
                            <li>
                                <button onClick={handleLogout} className="flex w-full items-center p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">
                                    <IoLogOutOutline className="w-6 h-6 mr-2" />
                                    {isOpen && <span>Logout</span>}
                                </button>
                            </li>
                        </ul>
                    </nav>

                    {/* Footer - Update padding when closed */}
                    <div className={`${isOpen ? 'p-4' : 'p-2'} border-t dark:border-gray-700`}>
                        <button
                            onClick={handleToggleDarkMode}
                            className={`flex items-center ${
                                isOpen ? 'space-x-3' : 'justify-center'
                            } w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700`}
                            title={!isOpen ? 'Toggle Theme' : ''}
                        >
                            {darkMode ? (
                                <FiSun className="w-6 h-6 text-yellow-500" />
                            ) : (
                                <FiMoon className="w-6 h-6 text-gray-600" />
                            )}
                            {isOpen && <span className='text-black dark:text-white'>Toggle Theme</span>}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminNavbar;