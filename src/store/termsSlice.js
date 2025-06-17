// src/store/termsApi.js
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

export const termsApi = createApi({
  reducerPath: "termsApi",
  baseQuery: baseQuery,
  tagTypes: ["terms"],
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  endpoints: (builder) => ({
    gettermss: builder.query({
      query: ({ startDate, endDate }) => {
        const params = {};
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;

        return {
          url: "/terms_and_condition",
          params,
        };
      },
      providesTags: ["terms"],
      transformResponse: (response) => {
        console.log("API Response:", response); // Debug log
        return response?.data || response || [];
      },
      transformErrorResponse: (response) => {
        console.error("API Error:", response); // Debug log
        return response;
      },
    }),
    gettermsById: builder.query({
      query: (id) => `/terms_and_condition/${id}`,
      providesTags: (result, error, id) => [{ type: "terms", id }],
    }),
    createterms: builder.mutation({
      query: (newOrder) => ({
        url: "/terms_and_condition",
        method: "POST",
        body: newOrder,
      }),
      invalidatesTags: ["terms"],
    }),
    updateterms: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/terms_and_condition/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "terms", id },
      ],
    }),
    deleteterms: builder.mutation({
      query: (id) => ({
        url: `/terms_and_condition/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["terms"],
    }),
  }),
});

export const {
  useGettermssQuery,
  useGettermsByIdQuery,
  useCreatetermsMutation,
  useUpdatetermsMutation,
  useDeletetermsMutation,
} = termsApi;
