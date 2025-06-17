// src/store/paymentsApi.js
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

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
  baseQuery: baseQuery,
  tagTypes: ["ExpenseAmount", "PaidPartyAmount"],
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  endpoints: (builder) => ({

    // New API 1: Payment Party Amount
    getExpenseAmount: builder.query({
      query: ({ startDate, endDate, ...params }) => {
        const queryParams = new URLSearchParams();
        
        if (startDate) queryParams.append('start_date', startDate);
        if (endDate) queryParams.append('end_date', endDate);
        
        // Add any additional parameters
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });

        const queryString = queryParams.toString();
        return {
          url: `/expense${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: ["ExpenseAmount"],
      transformResponse: (response) => {
        console.log("Payment Party Amount API Response:", response);
        if (response?.data) {
          return {
            data: response.data,
            total: response.total || response.data.length,
            startDate: response.start_date,
            endDate: response.end_date,
          };
        }
        return {
          data: Array.isArray(response) ? response : [],
          total: Array.isArray(response) ? response.length : 0,
        };
      },
      transformErrorResponse: (response) => {
        console.error("Payment Party Amount API Error:", response);
        return response;
      },
    }),

    // New API 2: Company Product Stock
    getPaidPartyAmount: builder.query({
      query: ({ startDate, endDate, ...params }) => {
        const queryParams = new URLSearchParams();
        
        if (startDate) queryParams.append('start_date', startDate);
        if (endDate) queryParams.append('end_date', endDate);
        
        // Add any additional parameters
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, params[key]);
          }
        });

        const queryString = queryParams.toString();
        return {
          url: `/paid_party_amount${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: ["PaidPartyAmount"],
      transformResponse: (response) => {
        console.log("Company Product Stock API Response:", response);
        if (response?.data) {
          return {
            data: response.data,
            total: response.total || response.data.length,
            startDate: response.start_date,
            endDate: response.end_date,
          };
        }
        return {
          data: Array.isArray(response) ? response : [],
          total: Array.isArray(response) ? response.length : 0,
        };
      },
      transformErrorResponse: (response) => {
        console.error("Company Product Stock API Error:", response);
        return response;
      },
    }),

    // Combined query for both APIs - returns merged data
    getCombinedData: builder.query({
      queryFn: async ({ startDate, endDate, ...params }, api, extraOptions, baseQuery) => {
        try {
          // Call both APIs simultaneously
          const [ExpenseResult, companyStockResult] = await Promise.all([
            baseQuery({
              url: `/expense?${new URLSearchParams({
                ...(startDate && { start_date: startDate }),
                ...(endDate && { end_date: endDate }),
                ...params
              }).toString()}`
            }),
            baseQuery({
              url: `/paid_party_amount?${new URLSearchParams({
                ...(startDate && { start_date: startDate }),
                ...(endDate && { end_date: endDate }),
                ...params
              }).toString()}`
            })
          ]);

          // Check for errors
          if (ExpenseResult.error) {
            return { error: ExpenseResult.error };
          }
          if (companyStockResult.error) {
            return { error: companyStockResult.error };
          }

          // Combine the data
          const ExpenseData = ExpenseResult.data?.data || ExpenseResult.data || [];
          const companyStockData = companyStockResult.data?.data || companyStockResult.data || [];

          return {
            data: {
              ExpenseAmount: {
                data: Array.isArray(ExpenseData) ? ExpenseData : [],
                total: ExpenseData.length || 0,
              },
              PaidPartyAmount: {
                data: Array.isArray(companyStockData) ? companyStockData : [],
                total: companyStockData.length || 0,
              },
              combined: [...ExpenseData, ...companyStockData],
              totalCombined: (ExpenseData.length || 0) + (companyStockData.length || 0),
              startDate,
              endDate,
            }
          };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      providesTags: ["ExpenseAmount", "PaidPartyAmount"],
    }),
  }),
});

export const {
  
  // New individual hooks
  useGetExpenseAmountQuery,
  useGetPaidPartyAmountQuery,
  
  // Combined hook for both APIs
  useGetCombinedDataQuery,
  
} = paymentsApi;