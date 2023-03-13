import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getPrivateAnnotatorDetailsAPI,
  getPrivateAnnotatorUnannotatedAPI,
  getPrivateAnnotatorAnnotatedAPI,
  createPrivateAnnotatorAnnotationAPI,
  getPrivateAnnotatorCategoriesAPI,
} from "./api";

export const getPrivateAnnotatorDetails = createAsyncThunk(
  "private-annotator/getPrivateAnnotatorDetails",
  async ([privateAnnotatorToken]) =>
    await getPrivateAnnotatorDetailsAPI(privateAnnotatorToken)
);
export const getPrivateAnnotatorUnannotated = createAsyncThunk(
  "private-annotator/getPrivateAnnotatorUnannotated",
  async ([privateAnnotatorToken]) =>
    await getPrivateAnnotatorUnannotatedAPI(privateAnnotatorToken)
);

export const getPrivateAnnotatorAnnotated = createAsyncThunk(
  "private-annotator/getPrivateAnnotatorAnnotated",
  async ([privateAnnotatorToken]) =>
    await getPrivateAnnotatorAnnotatedAPI(privateAnnotatorToken)
);

export const createPrivateAnnotatorAnnotation = createAsyncThunk(
  "private-annotator/createPrivateAnnotatorAnnotation",
  async ([privateAnnotatorToken, unannotatedSource, payload]) =>
    await createPrivateAnnotatorAnnotationAPI(
      privateAnnotatorToken,
      unannotatedSource,
      payload
    )
);

export const getPrivateAnnotatorCategories = createAsyncThunk(
  "private-annotator/getPrivateAnnotatorCategories",
  async ([privateAnnotatorToken]) =>
    await getPrivateAnnotatorCategoriesAPI(privateAnnotatorToken)
);
