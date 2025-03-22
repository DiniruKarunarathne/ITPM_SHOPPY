import { createSlice } from "@reduxjs/toolkit";
import { userLogin } from "./authActions";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userInfo: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.userInfo;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;