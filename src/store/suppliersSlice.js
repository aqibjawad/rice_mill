// src/store/suppliersApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiPrefix } from "@/networkUtil/Constants";
import User from "@/networkUtil/user";

const baseQuery = fetchBaseQuery({
  baseUrl: apiPrefix,
  prepareHeaders: (headers) => {
    const token = User.getAccessToken();
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const suppliersApi = createApi({
  reducerPath: "suppliersApi",
  baseQuery: baseQuery,
  tagTypes: ["supplier"], // Fixed: should be "supplier" not "inventory"
  // Remove initialState - RTK Query handles this automatically
  endpoints: (builder) => ({
    getSuppliers: builder.query({ // Fixed naming convention
      query: ({ startDate, endDate } = {}) => { // Added default empty object
        const params = {};
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;

        return {
          url: "/supplier",
          params,
        };
      },
      providesTags: ["supplier"], // Fixed: should match tagTypes
      transformResponse: (response) => {
        console.log("API Response:", response);
        return response?.data || response || [];
      },
      transformErrorResponse: (response) => {
        console.error("API Error:", response);
        return response;
      },
    }),
    
    getSupplierById: builder.query({ // Fixed naming
      query: (id) => `/supplier/${id}`,
      providesTags: (result, error, id) => [{ type: "supplier", id }], // Fixed tag type
    }),
    
    createSupplier: builder.mutation({ // Fixed naming
      query: (newSupplier) => ({
        url: "/supplier",
        method: "POST",
        body: newSupplier,
      }),
      invalidatesTags: ["supplier"], // Fixed tag type
    }),
    
    updateSupplier: builder.mutation({ // Fixed naming
      query: ({ id, ...patch }) => ({
        url: `/supplier/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "supplier", id }, // Fixed tag type
      ],
    }),
    
    deleteSupplier: builder.mutation({ // Fixed naming
      query: (id) => ({
        url: `/supplier/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["supplier"], // Fixed tag type
    }),
  }),
});

export const {
  useGetSuppliersQuery, // Fixed export naming
  useGetSupplierByIdQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = suppliersApi;