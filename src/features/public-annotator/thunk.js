import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createCommunityProjectAPI,
  createPrivateAnnotatorAPI,
  getCommunityProjectsAPI,
  getPrivateAnnotatorsAPI,
  resendPrivateAnnotatorInvitationAPI,
  togglePrivateAnnotatorStatusAPI,
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
  async ([projectURL]) => await getPrivateAnnotatorsAPI([projectURL])
);

export const createPrivateAnnotator = createAsyncThunk(
  "public-annotator/createPrivateAnnotator",
  async ([projectURL, privateAnnotatorEmail, privateAnnotatorUsername]) =>
    await createPrivateAnnotatorAPI(
      projectURL,
      privateAnnotatorEmail,
      privateAnnotatorUsername
    )
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
