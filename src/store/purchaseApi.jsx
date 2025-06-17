// src/store/purchaseBookApi.js
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

export const purchaseBookApi = createApi({
  reducerPath: "purchaseBookApi",
  baseQuery: baseQuery,
  tagTypes: ["purchaseBook"],
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  endpoints: (builder) => ({
    // Main query that matches the component usage
    getpurchaseBook: builder.query({
      query: ({ startDate, endDate, page = 1, limit = 50, search = "" }) => {
        const params = {};
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;
        if (page) params.page = page;
        if (limit) params.limit = limit;
        if (search) params.search = search;

        return {
          url: "/purchase_book",
          params,
        };
      },
      providesTags: ["purchaseBook"],
      transformResponse: (response) => {
        console.log("API Response:", response); // Debug log
        // Handle different response structures
        if (response?.data) {
          return {
            data: response.data,
            total: response.total || response.data.length,
            lastPage: response.last_page || Math.ceil((response.total || response.data.length) / 50),
            currentPage: response.current_page || 1
          };
        }
        // Fallback for simple array response
        return {
          data: Array.isArray(response) ? response : [],
          total: Array.isArray(response) ? response.length : 0,
          lastPage: 1,
          currentPage: 1
        };
      },
      transformErrorResponse: (response) => {
        console.error("API Error:", response); // Debug log
        return response;
      },
    }),

    // Lazy query version
    lazypurchaseBook: builder.query({
      query: ({ startDate, endDate, page = 1, limit = 50, search = "" }) => {
        const params = {};
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;
        if (page) params.page = page;
        if (limit) params.limit = limit;
        if (search) params.search = search;

        return {
          url: "/purchase_book",
          params,
        };
      },
      providesTags: ["purchaseBook"],
    }),

    // Summary query
    getpurchaseBookSummary: builder.query({
      query: ({ startDate, endDate }) => {
        const params = {};
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;

        return {
          url: "/purchase_book/summary", // Adjust this endpoint as per your API
          params,
        };
      },
      providesTags: ["purchaseBook"],
      transformResponse: (response) => {
        return response?.data || response || {};
      },
    }),

    // Keep existing endpoints for backward compatibility
    getpurchaseBooks: builder.query({
      query: ({ startDate, endDate }) => {
        const params = {};
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;

        return {
          url: "/purchase_book",
          params,
        };
      },
      providesTags: ["purchaseBook"],
      transformResponse: (response) => {
        console.log("API Response:", response); // Debug log
        return response?.data || response || [];
      },
      transformErrorResponse: (response) => {
        console.error("API Error:", response); // Debug log
        return response;
      },
    }),

    getpurchaseBookById: builder.query({
      query: (id) => `/purchase_book/${id}`,
      providesTags: (result, error, id) => [{ type: "purchaseBook", id }],
    }),

    createpurchaseBook: builder.mutation({
      query: (newOrder) => ({
        url: "/purchase_book",
        method: "POST",
        body: newOrder,
      }),
      invalidatesTags: ["purchaseBook"],
    }),

    updatepurchaseBook: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/purchase_book/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "purchaseBook", id },
      ],
    }),

    deletepurchaseBook: builder.mutation({
      query: (id) => ({
        url: `/purchase_book/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["purchaseBook"],
    }),
  }),
});

export const {
  // Main hooks that match component usage
  useGetpurchaseBookQuery,
  useLazyGetpurchaseBookQuery: useLazyGetpurchaseBookQuery,
  useGetpurchaseBookSummaryQuery,
  
  // Existing hooks for backward compatibility
  useGetpurchaseBooksQuery,
  useGetpurchaseBookByIdQuery,
  useCreatepurchaseBookMutation,
  useUpdatepurchaseBookMutation,
  useDeletepurchaseBookMutation,
} = purchaseBookApi;