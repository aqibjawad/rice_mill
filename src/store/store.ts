// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import { salesApi } from "./salesApi";
import { purchaseBookApi } from "./purchaseApi";
import { investorsApi } from "./investorsApi";
import { partyApi } from "./partyApi";
import { expenseApi } from "./expenseApi";
import { banksApi } from "./banksApi";
import { productsApi } from "./productsApi";

export const store = configureStore({
  reducer: {
    // API slices
    [salesApi.reducerPath]: salesApi.reducer,
    [purchaseBookApi.reducerPath]: purchaseBookApi.reducer,
    [investorsApi.reducerPath]: investorsApi.reducer,
    [partyApi.reducerPath]: partyApi.reducer,
    [expenseApi.reducerPath]: expenseApi.reducer,
    [banksApi.reducerPath]: banksApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
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
          "investorsApi",
          "partyApi",
          "expenseApi",
          "banksApi",
          "productsApi",
        ],
      },
    }).concat(
      salesApi.middleware,
      purchaseBookApi.middleware,
      investorsApi.middleware,
      partyApi.middleware,
      expenseApi.middleware,
      banksApi.middleware,
      productsApi.middleware
    ),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
