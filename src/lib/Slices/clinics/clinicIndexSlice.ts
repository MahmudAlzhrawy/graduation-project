"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  numberOfShowingClinics: 2, // default value, will override later in useEffect
};

const clinicIndexSlice = createSlice({
  name: "clinicIndex",
  initialState,
  reducers: {
    setnumberOfShowingClinics: (state, { payload }) => {
      const newValue = payload + 2;
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "numberOfShowingClinics",
          JSON.stringify(newValue)
        );
      }
      state.numberOfShowingClinics = newValue;
    },

    // optional: reset from sessionStorage on client
    loadNumberOfShowingClinics: (state) => {
      if (typeof window !== "undefined") {
        const stored = sessionStorage.getItem("numberOfShowingClinics");
        if (stored) {
          state.numberOfShowingClinics = JSON.parse(stored);
        }
      }
    },
  },
});

export const {
  setnumberOfShowingClinics,
  loadNumberOfShowingClinics,
} = clinicIndexSlice.actions;

export default clinicIndexSlice.reducer;
