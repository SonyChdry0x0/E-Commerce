// src/store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Load persisted user from localStorage
const userFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    // user shape: { _id, name, email, isAdmin, token }
    user: userFromStorage,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem("userInfo");
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;