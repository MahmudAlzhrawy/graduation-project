import { AdminApi } from "./services/authServiec";
import authReducer from "./Slices/auth/authSlice";
import clinicIndexReducer from "./Slices/clinics/clinicIndexSlice";
export const RootReducers = {
  auth: authReducer,
  clinicIndex: clinicIndexReducer,
  [AdminApi.reducerPath]: AdminApi.reducer,
};
