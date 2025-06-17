import { Outlet } from 'react-router-dom';
import AdminNavbar from '../Components/Shared/AdminNavbar';
import { UiSelectors } from '../Selectors/UiSelectors';
import { useEffect } from 'react';
import Overllay from '../Components/Reusable/Overllay';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
// Action
import { fetchCategories } from '../Features/CategorieAdmin/Actions/CategorieAdminActions';


const AdminLayout = () => {
    const dispatch = useDispatch();
    const isOpen = useSelector(UiSelectors.isIcons);
    const isOverlayOpen = useSelector(UiSelectors.isOverllayOpen);
    // Handle DarkMode
    const DarkMode = useSelector(UiSelectors.darkMode);
    console.log("DarkMode", DarkMode);
    useEffect(() => {
        if (DarkMode) {
            document.documentElement.classList.add("dark")
        }else{
            document.documentElement.classList.remove("dark")
        }
    },[DarkMode])
    // Fetch Categories
    useEffect(()=>{
        dispatch(fetchCategories());
    }, [dispatch])
    
    return (
        <div id="admin" className="min-h-screen  bg-gray-50 dark:bg-gray-900">
            <AdminNavbar />
            <main className={`${isOpen ? "lg:ml-72" :"lg:ms-[80px]"}  min-h-screen transition-all duration-300 `}>
                <div className="container mx-auto px-4 py-8">
                    <Outlet />
                </div>
            </main>

            {/* Overlay */}
            {isOverlayOpen && <Overllay />}
        </div>
    );
};

export default AdminLayout;