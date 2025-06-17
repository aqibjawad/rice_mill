// src/store/inventoryApi.js
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

export const inventoryApi = createApi({
  reducerPath: "inventoryApi",
  baseQuery: baseQuery,
  tagTypes: ["stock", "receives", "inventory"],
  endpoints: (builder) => ({
    // ============ COMPANY PRODUCT STOCK APIs ============
    getCompanyProductStock: builder.query({
      query: () => ({
        url: "/company_product_stock",
      }),
      providesTags: ["stock", "inventory"],
      transformResponse: (response) => {
        console.log("Stock API Response:", response);
        
        if (response?.data) {
          return {
            data: Array.isArray(response.data) ? response.data : [],
            total: response.total || response.data.length,
            lastPage: response.last_page || Math.ceil((response.total || 0) / (response.per_page || 50)),
            currentPage: response.current_page || 1,
            perPage: response.per_page || 50
          };
        }
        
        return {
          data: Array.isArray(response) ? response : [],
          total: Array.isArray(response) ? response.length : 0,
          lastPage: 1,
          currentPage: 1,
          perPage: 50
        };
      },
      transformErrorResponse: (response) => {
        console.error("Stock API Error:", response);
        return {
          status: response.status,
          message: response.data?.message || "Stock fetch failed",
          errors: response.data?.errors || {}
        };
      },
    }),

    getCompanyProductStockById: builder.query({
      query: (id) => `/company_product_stock/${id}`,
      providesTags: (result, error, id) => [{ type: "stock", id }],
      transformResponse: (response) => response?.data || response,
    }),

    createCompanyProductStock: builder.mutation({
      query: (newStock) => ({
        url: "/company_product_stock",
        method: "POST",
        body: newStock,
      }),
      invalidatesTags: ["stock", "inventory"],
      transformResponse: (response) => response?.data || response,
    }),

    updateCompanyProductStock: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/company_product_stock/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        "stock",
        "inventory",
        { type: "stock", id }
      ],
      transformResponse: (response) => response?.data || response,
    }),

    deleteCompanyProductStock: builder.mutation({
      query: (id) => ({
        url: `/company_product_stock/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "stock",
        "inventory",
        { type: "stock", id }
      ],
    }),

    // ============ RECEIVED PARTY AMOUNT APIs ============
    getReceivedPartyAmount: builder.query({
      query: ({ startDate, endDate }) => {
        const params = {};
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;

        return {
          url: "/received_party_amount",
          params,
        };
      },
      providesTags: ["receives", "inventory"],
      transformResponse: (response) => {
        console.log("Receives API Response:", response);
        
        if (response?.data) {
          return {
            data: Array.isArray(response.data) ? response.data : [],
            total: response.total || response.data.length,
            lastPage: response.last_page || Math.ceil((response.total || 0) / (response.per_page || 50)),
            currentPage: response.current_page || 1,
            perPage: response.per_page || 50
          };
        }
        
        return {
          data: Array.isArray(response) ? response : [],
          total: Array.isArray(response) ? response.length : 0,
          lastPage: 1,
          currentPage: 1,
          perPage: 50
        };
      },
      transformErrorResponse: (response) => {
        console.error("Receives API Error:", response);
        return {
          status: response.status,
          message: response.data?.message || "Receives fetch failed",
          errors: response.data?.errors || {}
        };
      },
    }),

    getReceivedPartyAmountById: builder.query({
      query: (id) => `/received_party_amount/${id}`,
      providesTags: (result, error, id) => [{ type: "receives", id }],
      transformResponse: (response) => response?.data || response,
    }),

    createReceivedPartyAmount: builder.mutation({
      query: (newReceive) => ({
        url: "/received_party_amount",
        method: "POST",
        body: newReceive,
      }),
      invalidatesTags: ["receives", "inventory", "stock"],
      transformResponse: (response) => response?.data || response,
    }),

    updateReceivedPartyAmount: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/received_party_amount/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        "receives",
        "inventory",
        "stock",
        { type: "receives", id }
      ],
      transformResponse: (response) => response?.data || response,
    }),

    deleteReceivedPartyAmount: builder.mutation({
      query: (id) => ({
        url: `/received_party_amount/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "receives",
        "inventory",
        "stock",
        { type: "receives", id }
      ],
    }),

    // ============ COMBINED SUMMARY APIs ============
    getInventorySummary: builder.query({
      query: ({ startDate, endDate }) => {
        const params = {};
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;

        return {
          url: "/inventory/summary",
          params,
        };
      },
      providesTags: ["inventory"],
      transformResponse: (response) => response?.data || response,
    }),

    getStockSummary: builder.query({
      query: () => ({
        url: "/company_product_stock/summary",
      }),
      providesTags: ["stock", "inventory"],
      transformResponse: (response) => response?.data || response,
    }),

    getReceivesSummary: builder.query({
      query: ({ startDate, endDate }) => {
        const params = {};
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;

        return {
          url: "/received_party_amount/summary",
          params,
        };
      },
      providesTags: ["receives", "inventory"],
      transformResponse: (response) => response?.data || response,
    }),
  }),
});

// Export hooks for both APIs
export const {
  // ===== COMPANY PRODUCT STOCK HOOKS =====
  useGetCompanyProductStockQuery,
  useLazyGetCompanyProductStockQuery,
  useGetCompanyProductStockByIdQuery,
  useCreateCompanyProductStockMutation,
  useUpdateCompanyProductStockMutation,
  useDeleteCompanyProductStockMutation,
  useGetStockSummaryQuery,

  // ===== RECEIVED PARTY AMOUNT HOOKS =====
  useGetReceivedPartyAmountQuery,
  useLazyGetReceivedPartyAmountQuery,
  useGetReceivedPartyAmountByIdQuery,
  useCreateReceivedPartyAmountMutation,
  useUpdateReceivedPartyAmountMutation,
  useDeleteReceivedPartyAmountMutation,
  useGetReceivesSummaryQuery,

  // ===== COMBINED INVENTORY HOOKS =====
  useGetInventorySummaryQuery,
} = inventoryApi;

// Export the API for store configuration
export default inventoryApi;