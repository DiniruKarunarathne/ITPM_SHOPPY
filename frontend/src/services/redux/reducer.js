import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  payment: [],
};

export const checkoutSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    getCheckout: (state) => {
      // get code
    },
  },
});

export const { getCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
