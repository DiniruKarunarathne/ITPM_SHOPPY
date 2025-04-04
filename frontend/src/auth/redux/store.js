import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // Ensure correct path

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
