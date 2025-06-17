import { createAsyncThunk } from "@reduxjs/toolkit";
import createAdminAxiosInstance from "../../../config/AdminAxsiosInstant";


// Login Admin Action
const loginAdmin = createAsyncThunk(
  "adminAuth/loginAdmin",
  async (data, { rejectWithValue }) => {
    try {
      const axiosInstance = createAdminAxiosInstance(false);
      const response = await axiosInstance.post("/api/AdminAuth/login", {
        email: data.email,
        password: data.password,
      });
      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Login failed"
      );
    }
  }
);

// Logout Admin Action
const logoutAdmin = createAsyncThunk(
  "adminAuth/logoutAdmin",
  async (token, { rejectWithValue }) => {
    try {

        const axiosInstance = createAdminAxiosInstance(true);
        const response = await axiosInstance.post("/api/AdminAuth/logout")
        return response.data;

    } catch (error) {
      console.error("Logout failed:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Logout failed"
      );
    }
  }
);

export { loginAdmin, logoutAdmin };
