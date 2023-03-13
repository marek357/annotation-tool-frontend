import { client } from "./client";

export const getPrivateAnnotatorDetailsAPI = async (privateAnnotatorToken) =>
  (
    await client.get(
      `/annotate/projects/annotator?private_annotator_token=${privateAnnotatorToken}`
    )
  ).data;

export const getPrivateAnnotatorUnannotatedAPI = async (
  privateAnnotatorToken
) =>
  (
    await client.get(
      `/annotate/projects/remaining?token=${privateAnnotatorToken}`
    )
  ).data;

export const getPrivateAnnotatorAnnotatedAPI = async (privateAnnotatorToken) =>
  (
    await client.get(
      `/annotate/projects/annotated?token=${privateAnnotatorToken}`
    )
  ).data;

export const createPrivateAnnotatorAnnotationAPI = async (
  privateAnnotatorToken,
  unannotatedSource,
  payload
) =>
  (
    await client.post(
      `/annotate/projects/entry?token=${privateAnnotatorToken}`,
      { unannotated_source: unannotatedSource, payload: payload }
    )
  ).data;

export const getPrivateAnnotatorCategoriesAPI = async (privateAnnotatorToken) =>
  (
    await client.get(
      `/annotate/projects/categories?token=${privateAnnotatorToken}`
    )
  ).data;
