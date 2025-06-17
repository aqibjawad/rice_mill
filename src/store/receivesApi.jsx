// src/store/receivesApi.js
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

export const receivesApi = createApi({
  reducerPath: "receivesApi",
  baseQuery: baseQuery,
  tagTypes: ["receivedPartyAmount", "companyProductStock"],
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  endpoints: (builder) => ({

    // New API 1: Received Party Amount
    getReceivedPartyAmount: builder.query({
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
          url: `/received_party_amount${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: ["receivedPartyAmount"],
      transformResponse: (response) => {
        console.log("Received Party Amount API Response:", response);
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
        console.error("Received Party Amount API Error:", response);
        return response;
      },
    }),

    // New API 2: Company Product Stock
    getCompanyProductStock: builder.query({
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
          url: `/company_product_stock${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: ["companyProductStock"],
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
          const [receivedPartyResult, companyStockResult] = await Promise.all([
            baseQuery({
              url: `/received_party_amount?${new URLSearchParams({
                ...(startDate && { start_date: startDate }),
                ...(endDate && { end_date: endDate }),
                ...params
              }).toString()}`
            }),
            baseQuery({
              url: `/company_product_stock?${new URLSearchParams({
                ...(startDate && { start_date: startDate }),
                ...(endDate && { end_date: endDate }),
                ...params
              }).toString()}`
            })
          ]);

          // Check for errors
          if (receivedPartyResult.error) {
            return { error: receivedPartyResult.error };
          }
          if (companyStockResult.error) {
            return { error: companyStockResult.error };
          }

          // Combine the data
          const receivedPartyData = receivedPartyResult.data?.data || receivedPartyResult.data || [];
          const companyStockData = companyStockResult.data?.data || companyStockResult.data || [];

          return {
            data: {
              receivedPartyAmount: {
                data: Array.isArray(receivedPartyData) ? receivedPartyData : [],
                total: receivedPartyData.length || 0,
              },
              companyProductStock: {
                data: Array.isArray(companyStockData) ? companyStockData : [],
                total: companyStockData.length || 0,
              },
              combined: [...receivedPartyData, ...companyStockData],
              totalCombined: (receivedPartyData.length || 0) + (companyStockData.length || 0),
              startDate,
              endDate,
            }
          };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
      providesTags: ["receivedPartyAmount", "companyProductStock"],
    }),
  }),
});

export const {
  
  // New individual hooks
  useGetReceivedPartyAmountQuery,
  useGetCompanyProductStockQuery,
  
  // Combined hook for both APIs
  useGetCombinedDataQuery,
  
} = receivesApi;