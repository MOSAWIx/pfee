import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff, FiLoader } from 'react-icons/fi';
import { BsMoonStars, BsSun } from 'react-icons/bs';
import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { UiSelectors } from '../../Selectors/UiSelectors';
import AdminAuthSelector from '../../Selectors/AdminAuthSelector';
// Actions
import { toggleDarkMode } from '../../Features/UI/UiSlice';
import { loginAdmin } from "../../Features/AdminAuth/AdminAuthActions/AdminAuthAction";
// Toast
import toast from 'react-hot-toast';

const AdminLogin = () => {
    const dispatch = useDispatch();
    const isDarkMode = useSelector(UiSelectors.darkMode);
    const isLoading = useSelector(AdminAuthSelector.isLoading);
    const isError = useSelector(AdminAuthSelector.isError);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();


    const onSubmit = async (data) => {
        console.log(data);
        try {
            await dispatch(loginAdmin(data)).unwrap()
            toast.success("Logged in successfully!")
            navigate("/admin");
            
        } catch (error) {
            toast.error(error || "Problem")         
        }
    };

    const toggleMode = () => {
        dispatch(toggleDarkMode());
        
    };
    // HandlDarkMode
    useEffect(()=>{
        if(isDarkMode){
            document.documentElement.classList.add("dark")
        }else{
            document.documentElement.classList.remove("dark")
        }
    },[isDarkMode])


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <button
                    onClick={toggleMode}
                    className="absolute top-4 right-4 p-3 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                    {isDarkMode ? (
                        <BsSun className="w-6 h-6 text-yellow-500" />
                    ) : (
                        <BsMoonStars className="w-6 h-6 text-gray-700" />
                    )}
                </button>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-8 transition-all duration-300 fade-up-1">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Admin Login
                        </h2>
                        <p className="mt-3 text-gray-600 dark:text-gray-400">
                            Enter your credentials to access the admin panel
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-5">
                            <div className={`relative group ${isError ? "border-red-500" : ""}`}>
                                <FiMail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" />
                                <input
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    type="email"
                                    className={`block w-full pl-10 pr-3 py-3 border ${
                                        isError ? "border-red-500 border-2" : "border-gray-300 dark:border-gray-600"
                                    } rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 transition-all duration-200`}
                                    placeholder="Admin Email"
                                />
                            </div>
                            {errors.email && (
                                    <p className="mt-2 text-sm text-red-500 fade-up">{errors.email.message}</p>
                                )}

                            <div className={`relative group ${isError ? "border-red-500" : ""}`}>
                                <FiLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" />
                                <input
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters"
                                        }
                                    })}
                                    type={showPassword ? "text" : "password"}
                                    className={`block w-full pl-10 pr-12 py-3 border ${
                                        isError ? "border-red-500 border-2" : "border-gray-300 dark:border-gray-600"
                                    } rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 transition-all duration-200`}
                                    placeholder="Password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors duration-200"
                                >
                                    {showPassword ? (
                                        <FiEyeOff className="w-5 h-5" />
                                    ) : (
                                        <FiEye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                    <p className="mt-2 text-sm text-red-500 fade-up">{errors.password.message}</p>
                                )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white ${
                                isLoading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-700"
                            } transition-all duration-200`}
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                {isLoading ? (
                                    <FiLoader className="h-5 w-5 text-white animate-spin" />
                                ) : (
                                    <FiLogIn className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
                                )}
                            </span>
                            {isLoading ? "Loading..." : "Sign in"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;

