import { createSlice } from "@reduxjs/toolkit";
import {
  createPrivateAnnotatorAnnotation,
  getPrivateAnnotatorAnnotated,
  getPrivateAnnotatorDetails,
  getPrivateAnnotatorUnannotated,
  getPrivateAnnotatorCategories,
} from "./thunk";

export const initialState = {
  privateAnnotator: {},
  privateAnnotatorError: "",
  categories: [],
  unannotated: [],
  annotated: [],
  loaded: false,
};

export const createState = (state) => ({
  app: { ...initialState, ...state },
});

export const privateAnnotatorSlice = createSlice({
  name: "privateAnnotator",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPrivateAnnotatorDetails.fulfilled, (state, action) => {
        if (action.payload.detail !== undefined) {
          state.privateAnnotatorError = action.payload.detail;
          return;
        }
        state.privateAnnotator = action.payload;
      })
      .addCase(getPrivateAnnotatorDetails.rejected, (state, action) => {
        state.privateAnnotatorError = action.error.message;
      })
      .addCase(getPrivateAnnotatorUnannotated.fulfilled, (state, action) => {
        state.unannotated = action.payload;
      })
      .addCase(getPrivateAnnotatorAnnotated.fulfilled, (state, action) => {
        state.annotated = action.payload;
        state.loaded = true;
      })
      .addCase(createPrivateAnnotatorAnnotation.fulfilled, (state, action) => {
        state.annotated = [...state.annotated, action.payload];
        state.unannotated = state.unannotated.filter(
          (unannotatedEntry) =>
            unannotatedEntry.id !== action.payload.unannotated_source.id
        );
      })
      .addCase(getPrivateAnnotatorCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export default privateAnnotatorSlice.reducer;
