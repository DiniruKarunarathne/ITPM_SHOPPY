import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURI = "http://localhost:8082";


export const checkoutSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: baseURI }),
    endpoints: (builder) => ({
     
    
     
      addPaymentDetails: builder.mutation({
        query: (initialPayment) => ({
         
          url: "/api/income",
          method: "POST",
          body: initialPayment,
        }),
        invalidatesTags: ["payment"],
      }),
  
     
    }),
  });
  
  export default checkoutSlice;
  