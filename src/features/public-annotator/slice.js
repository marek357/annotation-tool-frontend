import { createSlice } from "@reduxjs/toolkit";
import {
  createCommunityProject,
  getCommunityProjects,
  getPrivateAnnotators,
  createPrivateAnnotator,
  togglePrivateAnnotatorStatus,
  getProjectEntries,
  getUnannotatedData,
} from "./thunk";

export const initialState = {
  communityProjects: [],
  communityProject: {},
  privateAnnotators: [],
  privateAnnotatorsLoaded: false,
  annotated: [],
  unannotated: [],
  unannotatedByPublicAnnotator: [],
  categories: [],
  createdProjectCategory: {},
  createdProjectAnnotation: {},
  createdProjectURL: "",
  privateAnnotatorTextStatisticsMap: {
    text: {},
    categoryUser: {},
    categoryCount: [],
  },
  privateAnnotatorDisagreements: [],
  loaded: false,
};

export const createState = (state) => ({
  app: { ...initialState, ...state },
});

export const publicAnnotatorSlice = createSlice({
  name: "publicAnnotator",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCommunityProjects.fulfilled, (state, action) => {
        state.communityProjects = action.payload;
        state.loaded = true;
      })
      .addCase(getCommunityProjects.rejected, (state, action) => {
        console.log(action.error.message);
      })
      .addCase(createCommunityProject.fulfilled, (state, action) => {
        state.communityProjects = [...state.communityProjects, action.payload];
        state.communityProject = action.payload;
        state.createdProjectURL = action.payload.url;
      })
      .addCase(createCommunityProject.rejected, (state, action) => {
        console.log(action.error.message);
      })
      .addCase(getPrivateAnnotators.fulfilled, (state, action) => {
        state.privateAnnotators = action.payload;
        state.privateAnnotatorsLoaded = true;
      })
      .addCase(getPrivateAnnotators.rejected, (state, action) => {
        console.log(action.error.message);
        state.privateAnnotatorsLoaded = true;
      })
      .addCase(createPrivateAnnotator.fulfilled, (state, action) => {
        state.privateAnnotators = [...state.privateAnnotators, action.payload];
      })
      .addCase(createPrivateAnnotator.rejected, (state, action) => {
        console.log(action.error.message);
      })
      .addCase(togglePrivateAnnotatorStatus.fulfilled, (state, action) => {
        // var index = state.privateAnnotators.indexOf()
      })
      .addCase(getProjectEntries.fulfilled, (state, action) => {
        state.annotated = action.payload;
      })
      .addCase(getUnannotatedData.fulfilled, (state, action) => {
        console.log("unannotated data!");
        state.unannotated = action.payload;
      })
      .addCase(getUnannotatedData.rejected, (state, action) => {
        console.log(action.error.message);
      });
  },
});

export default publicAnnotatorSlice.reducer;
