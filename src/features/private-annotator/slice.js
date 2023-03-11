import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  privateAnnotator: {},
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
  extraReducers: (builder) => {},
});

export default privateAnnotatorSlice.reducer;
