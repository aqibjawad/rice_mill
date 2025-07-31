// src/store/banksApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiPrefix } from "@/networkApi/Constants";
import User from "@/networkApi/user";

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

export const banksApi = createApi({
  reducerPath: "banksApi",
  baseQuery: baseQuery,
  tagTypes: ["Banks"], // Changed from "expense" to "Banks" for consistency
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  endpoints: (builder) => ({
    // Main query that matches the component usage
    getbanks: builder.query({
      query: () => {
        return {
          url: "/bank",
        };
      },
      providesTags: ["Banks"], // Changed to match tagTypes
      transformResponse: (response) => {
        console.log("API Response:", response); // Debug log
        // Handle different response structures
        if (response?.data) {
          return {
            data: response.data,
            total: response.total || response.data.length,
          };
        }
        // Fallback for simple array response
        return {
          data: Array.isArray(response) ? response : [],
          total: Array.isArray(response) ? response.length : 0,
        };
      },
      transformErrorResponse: (response) => {
        console.error("API Error:", response); // Debug log
        return response;
      },
    }),

    getbanksById: builder.query({
      query: (id) => `/bank/${id}`,
      providesTags: (result, error, id) => [{ type: "Banks", id }],
    }),

    // Add mutation for creating banks - THIS IS KEY FOR AUTO-REFRESH
    addBank: builder.mutation({
      query: (bankData) => ({
        url: "/bank",
        method: "POST",
        body: bankData,
      }),
      invalidatesTags: ["Banks"], // This will automatically refetch getbanks query
    }),

    // Add mutation for updating banks if needed
    updateBank: builder.mutation({
      query: ({ id, ...bankData }) => ({
        url: `/bank/${id}`,
        method: "PUT", // or PATCH depending on your API
        body: bankData,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Banks",
        { type: "Banks", id },
      ],
    }),

    // Add mutation for deleting banks if needed
    deleteBank: builder.mutation({
      query: (id) => ({
        url: `/bank/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Banks"],
    }),
  }),
});

export const {
  // Main hooks that match component usage
  useGetbanksQuery,
  useGetbanksByIdQuery,

  // Mutation hooks - use these in your AddBank component
  useAddBankMutation,
  useUpdateBankMutation,
  useDeleteBankMutation,
} = banksApi;
