import { backendURL } from "../Slices/auth/authRules";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { store } from "../store";
export const AdminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    //base url for backend API
    baseUrl: backendURL,
    //prepareHeaders is used to configure the header of each request and gives access to getState function which we use to include the token from the store
    prepareHeaders: (headers, { getState }) => {
      const token = store.getState().auth.userToken;

      if (token) {
        // include the token in the req header
        headers.set(`authorization`, `Bearer ${token}`);
        return headers;
      }
    },
  }),
  endpoints: (builder) => ({
    getAllRestaurants: builder.query({
      query: () => ({
        url: "api/show_all_retaurants",
        method: "GET",
      }),
    }),
  }),
});
export const { useGetAllRestaurantsQuery } = AdminApi;
