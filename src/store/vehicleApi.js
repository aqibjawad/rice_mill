// src/store/vehicleApi.js
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

export const vehicleApi = createApi({
  reducerPath: "vehicleApi",
  baseQuery: baseQuery,
  tagTypes: ["vehicle"],
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  endpoints: (builder) => ({
    getvehicles: builder.query({
      query: ({ startDate, endDate }) => {
        const params = {};
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;

        return {
          url: "/vehicle",
          params,
        };
      },
      providesTags: ["vehicle"],
      transformResponse: (response) => {
        console.log("API Response:", response); // Debug log
        return response?.data || response || [];
      },
      transformErrorResponse: (response) => {
        console.error("API Error:", response); // Debug log
        return response;
      },
    }),
    getvehicleById: builder.query({
      query: (id) => `/vehicle/${id}`,
      providesTags: (result, error, id) => [{ type: "vehicle", id }],
    }),
    createvehicle: builder.mutation({
      query: (newOrder) => ({
        url: "/vehicle",
        method: "POST",
        body: newOrder,
      }),
      invalidatesTags: ["vehicle"],
    }),
    updatevehicle: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/vehicle/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "vehicle", id },
      ],
    }),
    deletevehicle: builder.mutation({
      query: (id) => ({
        url: `/vehicle/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["vehicle"],
    }),
  }),
});

export const {
  useGetvehiclesQuery,
  useGetvehicleByIdQuery,
  useCreatevehicleMutation,
  useUpdatevehicleMutation,
  useDeletevehicleMutation,
} = vehicleApi;
