"use client";
import { configureStore } from "@reduxjs/toolkit";
import { RootReducers } from "./RootReducers";
import { AdminApi } from "./services/authServiec";
export const store = configureStore({
  reducer: RootReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(AdminApi.middleware),
});
