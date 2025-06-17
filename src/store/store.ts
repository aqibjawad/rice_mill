// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import { salesApi } from "./salesApi";
import { purchaseBookApi } from "./purchaseApi";

export const store = configureStore({
  reducer: {
    // API slices
    [salesApi.reducerPath]: salesApi.reducer,
    [purchaseBookApi.reducerPath]: purchaseBookApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // RTK Query automatically handles these, so we can simplify
          // by ignoring all RTK Query actions
          "api/executeQuery/pending",
          "api/executeQuery/fulfilled",
          "api/executeQuery/rejected",
          "api/executeMutation/pending",
          "api/executeMutation/fulfilled",
          "api/executeMutation/rejected",
        ],
        ignoredActionPaths: [
          "meta.arg",
          "payload.timestamp",
          "meta.baseQueryMeta",
        ],
        ignoredPaths: [
          // Ignore RTK Query cache states
          "salesApi",
          "purchaseBookApi",
        ],
      },
    }).concat(salesApi.middleware, purchaseBookApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
