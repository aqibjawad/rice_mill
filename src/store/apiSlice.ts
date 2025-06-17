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

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getPurchaseOrders: builder.query({
      query: ({ startDate, endDate }) => ({
        url: "/delivery_note",
        params: {
          start_date: startDate?.toISOString().split("T")[0],
          end_date: endDate?.toISOString().split("T")[0],
        },
      }),
    }),
    getJobs: builder.query({
      query: ({ startDate, endDate, filters, sortDirection }) => ({
        url: "/job/all",
        params: {
          start_date: startDate?.toISOString().split("T")[0],
          end_date: endDate?.toISOString().split("T")[0],
          filters: filters?.join(",") || "",
          sort: sortDirection,
        },
      }),
    }),
    getContracts: builder.query({
      query: ({ startDate, endDate }) => ({
        url: "/contracted",
        params: {
          start_date: startDate?.toISOString().split("T")[0],
          end_date: endDate?.toISOString().split("T")[0],
        },
      }),
    }),
    getServices: builder.query({
      query: () => "/agreement",
    }),
    getClients: builder.query({
      query: () => "/client",
    }),
  }),
});

export const {
  useGetPurchaseOrdersQuery,
  useGetJobsQuery,
  useGetContractsQuery,
  useGetServicesQuery,
  useGetClientsQuery,
} = apiSlice;
