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
  getProjectDataAPI,
  createCategoryAPI,
  deleteCategoryAPI,
  patchProjectTalkAPI,
  createPublicAnnotatorAnnotationAPI,
  getUnannotatedByPublicAnnotatorDataAPI,
  createAdministratorAPI,
  deleteProjectEntryAPI,
  deleteUnannotatedProjectEntryAPI,
} from "./api";

export const getCommunityProjects = createAsyncThunk(
  "public-annotator/getCommunityProjects",
  async () => await getCommunityProjectsAPI()
);

export const createCommunityProject = createAsyncThunk(
  "public-annotator/createCommunityProject",
  async ([
    projectName,
    projectDescription,
    projectType,
    characterLevelAnnotation,
  ]) =>
    await createCommunityProjectAPI(
      projectName,
      projectDescription,
      projectType,
      characterLevelAnnotation
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

export const getUnannotatedByPublicAnnotatorData = createAsyncThunk(
  "public-annotator/getUnannotatedByPublicAnnotatorData",
  async ([projectURL]) =>
    await getUnannotatedByPublicAnnotatorDataAPI(projectURL)
);

export const createPublicAnnotatorAnnotation = createAsyncThunk(
  "public-annotator/createPublicAnnotatorAnnotation",
  async ([projectURL, unannotatedSource, payload]) =>
    await createPublicAnnotatorAnnotationAPI(
      projectURL,
      unannotatedSource,
      payload
    )
);

export const patchProjectTalk = createAsyncThunk(
  "public-annotator/patchProjectTalk",
  async ([projectURL, talkValue]) =>
    await patchProjectTalkAPI(projectURL, talkValue)
);

export const getProjectData = createAsyncThunk(
  "public-annotator/getProjectData",
  async ([projectURL]) => await getProjectDataAPI(projectURL)
);

export const createAdministrator = createAsyncThunk(
  "public-annotator/createAdministrator",
  // https://redux-toolkit.js.org/api/createAsyncThunk
  async ([projectURL, administratorEmail], { rejectWithValue }) => {
    try {
      return await createAdministratorAPI(projectURL, administratorEmail);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteProjectEntry = createAsyncThunk(
  "public-annotator/deleteProjectEntry",
  // https://redux-toolkit.js.org/api/createAsyncThunk
  async ([projectURL, entryID], { rejectWithValue }) => {
    try {
      return await deleteProjectEntryAPI(projectURL, entryID);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteUnannotatedProjectEntry = createAsyncThunk(
  "public-annotator/deleteUnannotatedProjectEntry",
  // https://redux-toolkit.js.org/api/createAsyncThunk
  async ([projectURL, entryID], { rejectWithValue }) => {
    try {
      return await deleteUnannotatedProjectEntryAPI(projectURL, entryID);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createCategory = createAsyncThunk(
  "public-annotator/createCategory",
  // https://redux-toolkit.js.org/api/createAsyncThunk
  async (
    [projectURL, categoryName, categoryDescription, categoryKeyBinding],
    { rejectWithValue }
  ) => {
    try {
      return await createCategoryAPI(
        projectURL,
        categoryName,
        categoryDescription,
        categoryKeyBinding
      );
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "public-annotator/deleteCategory",
  // https://redux-toolkit.js.org/api/createAsyncThunk
  async ([projectURL, categoryID], { rejectWithValue }) => {
    try {
      return await deleteCategoryAPI(projectURL, categoryID);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
