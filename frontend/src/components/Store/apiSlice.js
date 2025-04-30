import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURI = "http://localhost:8082";

export const apiSlice = createApi({
  reducerPath: 'apiSlice',
  baseQuery: fetchBaseQuery({ baseUrl: baseURI }),
  endpoints: (builder) => ({
    // Add contact details
    addContact: builder.mutation({
      query: (initialContact) => ({
        url: "/api/contactus",
        method: "POST",
        body: initialContact,
      }),
      //invalidatesTags: ["contactus"],
    }),
    //get contact details
    get_Contactus: builder.query({
      // get: 'http://localhost:8000/api/contactus'
      query: () => "/api/contactus",
      //providesTags: ["contactus"],
    }),

    deleteContact: builder.mutation({
   
      query: (contactInfo) => ({
        url: "/api/contactus",
        body: contactInfo,
        method: "DELETE"
      })
    }),

 }),
});

export const {useAddContactMutation, useGet_ContactusQuery,useDeleteContactMutation} = apiSlice;