// src/store/partyApi.js
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

export const partyApi = createApi({
  reducerPath: "partyApi",
  baseQuery: baseQuery,
  tagTypes: ["party"],
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  endpoints: (builder) => ({
    // Main query that matches the component usage
    getparties: builder.query({
      query: () => {
        return {
          url: "/party",
        };
      },
      providesTags: ["parties"],
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

    getpartiesById: builder.query({
      query: (id) => `/party/${id}`,
      providesTags: (result, error, id) => [{ type: "parties", id }],
    }),
  }),
});

export const {
  // Main hooks that match component usage
  useGetpartiesQuery,

  // Existing hooks for backward compatibility
  useGetpartiessQuery,
  useGetpartiesByIdQuery,
} = partyApi;
