// src/store/salesApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiPrefix } from "../../networkApi/Constants";
import User from "@/networkApi/user";

const baseQuery = fetchBaseQuery({
  baseUrl: apiPrefix,
  prepareHeaders: (headers, { getState }) => {
    const token = User.getAccessToken();
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");
    return headers;
  },
  timeout: 30000, // 30 seconds timeout
});

// Enhanced base query with retry logic
const baseQueryWithRetry = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  // Retry on network error
  if (result.error && result.error.status === 'FETCH_ERROR') {
    // Retry once after 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));
    result = await baseQuery(args, api, extraOptions);
  }
  
  return result;
};

export const salesApi = createApi({
  reducerPath: "salesApi",
  baseQuery: baseQueryWithRetry,
  tagTypes: ["salesBook", "salesApi"],
  keepUnusedDataFor: 60, // Keep data for 60 seconds
  refetchOnMountOrArgChange: true,
  refetchOnFocus: false,
  refetchOnReconnect: true,
  
  endpoints: (builder) => ({
    // Get sales book with date filters
    getsalesBook: builder.query({
      query: ({ startDate, endDate, page = 1, limit = 50, search = "" }) => {
        const params = new URLSearchParams();
        
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        if (search && search.trim()) params.append('search', search.trim());
        
        console.log('Sales Book API Call:', {
          url: "/sale_book",
          params: params.toString(),
          fullUrl: `${apiPrefix}/sale_book?${params.toString()}`
        });
        
        return {
          url: "/sale_book",
          params: Object.fromEntries(params),
        };
      },
      providesTags: (result, error, arg) => [
        "salesBook",
        { type: "salesBook", id: "LIST" },
        ...(result?.data || []).map(({ id }) => ({ type: "salesBook", id }))
      ],
      transformResponse: (response) => {
        console.log("Sales Book API Response:", response);
        
        // Handle different response structures
        if (response?.success && response?.data) {
          return {
            data: Array.isArray(response.data) ? response.data : [],
            total: response.total || response.data.length || 0,
            currentPage: response.current_page || 1,
            lastPage: response.last_page || 1,
            perPage: response.per_page || 50
          };
        }
        
        if (Array.isArray(response)) {
          return {
            data: response,
            total: response.length,
            currentPage: 1,
            lastPage: 1,
            perPage: response.length
          };
        }
        
        return {
          data: response?.data || [],
          total: 0,
          currentPage: 1,
          lastPage: 1,
          perPage: 50
        };
      },
      transformErrorResponse: (response, meta, arg) => {
        console.error("Sales Book API Error:", { response, meta, arg });
        
        return {
          status: response?.status || 'UNKNOWN_ERROR',
          message: response?.data?.message || response?.message || 'An error occurred',
          errors: response?.data?.errors || null,
          originalError: response
        };
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        // Create a stable cache key
        const { startDate, endDate, page, limit, search } = queryArgs;
        return `${endpointName}(${startDate || 'null'}-${endDate || 'null'}-${page || 1}-${limit || 50}-${search || ''})`;
      },
    }),

    // Get single sales book entry by ID
    getsalesBookById: builder.query({
      query: (id) => {
        console.log(`Fetching sales book by ID: ${id}`);
        return `/sale_book/${id}`;
      },
      providesTags: (result, error, id) => [{ type: "salesBook", id }],
      transformResponse: (response) => {
        console.log("Sales Book By ID Response:", response);
        return response?.data || response;
      },
      transformErrorResponse: (response) => {
        console.error("Sales Book By ID Error:", response);
        return {
          status: response?.status || 'UNKNOWN_ERROR',
          message: response?.data?.message || 'Failed to fetch sales book entry',
          originalError: response
        };
      },
    }),

    // Create new sales book entry
    createsalesBook: builder.mutation({
      query: (newSalesBook) => {
        console.log("Creating sales book entry:", newSalesBook);
        return {
          url: "/sale_book",
          method: "POST",
          body: newSalesBook,
        };
      },
      invalidatesTags: [
        "salesBook", 
        { type: "salesBook", id: "LIST" }
      ],
      transformResponse: (response) => {
        console.log("Create Sales Book Response:", response);
        return response?.data || response;
      },
      transformErrorResponse: (response) => {
        console.error("Create Sales Book Error:", response);
        return {
          status: response?.status || 'UNKNOWN_ERROR',
          message: response?.data?.message || 'Failed to create sales book entry',
          errors: response?.data?.errors || null,
          originalError: response
        };
      },
    }),

    // Update sales book entry
    updatesalesBook: builder.mutation({
      query: ({ id, ...patch }) => {
        console.log(`Updating sales book ${id}:`, patch);
        return {
          url: `/sale_book/${id}`,
          method: "PUT",
          body: patch,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        "salesBook",
        { type: "salesBook", id: "LIST" },
        { type: "salesBook", id },
      ],
      transformResponse: (response) => {
        console.log("Update Sales Book Response:", response);
        return response?.data || response;
      },
      transformErrorResponse: (response) => {
        console.error("Update Sales Book Error:", response);
        return {
          status: response?.status || 'UNKNOWN_ERROR',
          message: response?.data?.message || 'Failed to update sales book entry',
          errors: response?.data?.errors || null,
          originalError: response
        };
      },
    }),

    // Delete sales book entry
    deletesalesBook: builder.mutation({
      query: (id) => {
        console.log(`Deleting sales book entry: ${id}`);
        return {
          url: `/sale_book/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, id) => [
        "salesBook",
        { type: "salesBook", id: "LIST" },
        { type: "salesBook", id },
      ],
      transformResponse: (response) => {
        console.log("Delete Sales Book Response:", response);
        return response?.data || response || { success: true };
      },
      transformErrorResponse: (response) => {
        console.error("Delete Sales Book Error:", response);
        return {
          status: response?.status || 'UNKNOWN_ERROR',
          message: response?.data?.message || 'Failed to delete sales book entry',
          originalError: response
        };
      },
    }),

    // Get sales book summary/stats
    getsalesBookSummary: builder.query({
      query: ({ startDate, endDate }) => {
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        
        return {
          url: "/sale_book/summary",
          params: Object.fromEntries(params),
        };
      },
      providesTags: ["salesBook"],
      transformResponse: (response) => {
        console.log("Sales Book Summary Response:", response);
        return response?.data || response;
      },
    }),
  }),
});

// Export hooks
export const {
  useGetsalesBookQuery,
  useLazyGetsalesBookQuery,
  useGetsalesBookByIdQuery,
  useLazyGetsalesBookByIdQuery,
  useCreatesalesBookMutation,
  useUpdatesalesBookMutation,
  useDeletesalesBookMutation,
  useGetsalesBookSummaryQuery,
  useLazyGetsalesBookSummaryQuery,
} = salesApi;

// Export additional utilities
export const {
  util: { 
    getRunningQueriesThunk,
    invalidateTags,
    prefetch,
    updateQueryData,
    upsertQueryData 
  }
} = salesApi;

// Selector to get sales book state
export const selectSalesBookResult = salesApi.endpoints.getsalesBook.select;
export const selectSalesBookData = (state, queryArgs) => 
  selectSalesBookResult(queryArgs)(state)?.data;

export default salesApi;