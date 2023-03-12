import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createCommunityProjectAPI,
  createPrivateAnnotatorAPI,
  getCommunityProjectsAPI,
  getPrivateAnnotatorsAPI,
  getProjectEntriesAPI,
  resendPrivateAnnotatorInvitationAPI,
  togglePrivateAnnotatorStatusAPI,
  uploadUnannotatedFileAPI,
  getUnannotatedDataAPI,
} from "./api";

export const getCommunityProjects = createAsyncThunk(
  "public-annotator/getCommunityProjects",
  async () => await getCommunityProjectsAPI()
);

export const createCommunityProject = createAsyncThunk(
  "public-annotator/createCommunityProject",
  async ([projectName, projectDescription, projectType]) =>
    await createCommunityProjectAPI(
      projectName,
      projectDescription,
      projectType
    )
);

export const getPrivateAnnotators = createAsyncThunk(
  "public-annotator/getPrivateAnnotators",
  async ([projectURL]) => await getPrivateAnnotatorsAPI(projectURL)
);

export const getProjectEntries = createAsyncThunk(
  "public-annotator/getProjectEntries",
  async ([projectURL]) => await getProjectEntriesAPI(projectURL)
);

export const createPrivateAnnotator = createAsyncThunk(
  "public-annotator/createPrivateAnnotator",
  // https://redux-toolkit.js.org/api/createAsyncThunk
  async (
    [projectURL, privateAnnotatorEmail, privateAnnotatorUsername],
    { rejectWithValue }
  ) => {
    try {
      return await createPrivateAnnotatorAPI(
        projectURL,
        privateAnnotatorEmail,
        privateAnnotatorUsername
      );
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const resendPrivateAnnotatorInvitation = createAsyncThunk(
  "public-annotator/resendPrivateAnnotatorInvitation",
  async ([projectURL, privateAnnotatorToken]) =>
    await resendPrivateAnnotatorInvitationAPI(projectURL, privateAnnotatorToken)
);

export const togglePrivateAnnotatorStatus = createAsyncThunk(
  "public-annotator/togglePrivateAnnotatorStatus",
  async ([projectURL, privateAnnotatorToken, annotatorStatus]) =>
    await togglePrivateAnnotatorStatusAPI(
      projectURL,
      privateAnnotatorToken,
      annotatorStatus
    )
);

export const uploadUnannotatedFile = createAsyncThunk(
  "public-annotator/uploadUnannotatedFile",
  async ([
    projectURL,
    uploadUnannotatedFileRequestFormData,
    stringUploadUnannotatedFileRequestSearchParameters,
  ]) =>
    await uploadUnannotatedFileAPI(
      projectURL,
      uploadUnannotatedFileRequestFormData,
      stringUploadUnannotatedFileRequestSearchParameters
    )
);

export const getUnannotatedData = createAsyncThunk(
  "public-annotator/getUnannotatedData",
  async ([projectURL]) => await getUnannotatedDataAPI(projectURL)
);
