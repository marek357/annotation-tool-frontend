import { client } from "./client";

export const getCommunityProjectsAPI = async () =>
  (await client.get("/management/projects/list")).data;

export const createCommunityProjectAPI = async (
  projectName,
  projectDescription,
  projectType,
  characterLevelAnnotation
) =>
  (
    await client.post(
      "/management/create/",
      JSON.stringify({
        name: projectName,
        description: projectDescription,
        project_type: projectType,
        talk_markdown: "",
        character_level_selection: characterLevelAnnotation,
      }),
      // https://stackoverflow.com/questions/51379356/axios-post-request-not-working
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  ).data;

export const createPrivateAnnotatorAPI = async (
  projectURL,
  privateAnnotatorEmail,
  privateAnnotatorUsername
) =>
  (
    await client.post(
      `/annotate/projects/${projectURL}/annotators`,
      JSON.stringify({
        email: privateAnnotatorEmail,
        username: privateAnnotatorUsername,
      }),
      // https://stackoverflow.com/questions/51379356/axios-post-request-not-working
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  ).data;

export const getPrivateAnnotatorsAPI = async (projectURL) =>
  (await client.get(`/annotate/projects/${projectURL}/annotators`)).data;

export const getProjectEntriesAPI = async (projectURL) =>
  (await client.get(`/management/projects/${projectURL}/entries`)).data;

export const resendPrivateAnnotatorInvitationAPI = async (
  projectURL,
  privateAnnotatorToken
) =>
  (
    await client.get(
      `/annotate/projects/${projectURL}/resend-invite-email?private_annotator_token=${privateAnnotatorToken}`
    )
  ).data;

export const togglePrivateAnnotatorStatusAPI = async (
  projectURL,
  privateAnnotatorToken,
  annotatorStatus
) =>
  (
    await client.get(
      `/annotate/projects/${projectURL}/${privateAnnotatorToken}/toggle-annotator-status?annotator_status=${annotatorStatus}`
    )
  ).data;

export const uploadUnannotatedFileAPI = async (
  projectURL,
  uploadUnannotatedFileRequestFormData,
  stringUploadUnannotatedFileRequestSearchParameters
) =>
  (
    await client.post(
      `/management/projects/${projectURL}/import?${stringUploadUnannotatedFileRequestSearchParameters}`,
      uploadUnannotatedFileRequestFormData
    )
  ).data;

export const getUnannotatedDataAPI = async (projectURL) =>
  (await client.get(`/management/projects/${projectURL}/import`)).data;

export const getUnannotatedByPublicAnnotatorDataAPI = async (projectURL) =>
  (await client.get(`/management/projects/${projectURL}/unannotated`)).data;

export const getProjectDataAPI = async (projectURL) =>
  (await client.get(`/management/projects/${projectURL}`)).data;

export const createAdministratorAPI = async (projectURL, administratorEmail) =>
  (
    await client.post(
      `/management/projects/${projectURL}/administrators`,
      JSON.stringify({ email: administratorEmail }),
      // https://stackoverflow.com/questions/51379356/axios-post-request-not-working
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  ).data;

export const createCategoryAPI = async (
  projectURL,
  categoryName,
  categoryDescription,
  categoryKeyBinding
) =>
  (
    await client.post(
      `/management/classification/${projectURL}/category`,
      JSON.stringify({
        name: categoryName,
        description: categoryDescription,
        key_binding: categoryKeyBinding,
      }),
      // https://stackoverflow.com/questions/51379356/axios-post-request-not-working
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  ).data;

export const createPublicAnnotatorAnnotationAPI = async (
  projectURL,
  unannotatedSource,
  payload
) =>
  (
    await client.post(`/management/projects/${projectURL}/entries`, {
      unannotated_source: unannotatedSource,
      payload: payload,
    })
  ).data;

export const getPrivateAnnotatorCategoriesAPI = async (privateAnnotatorToken) =>
  (
    await client.get(
      `/annotate/projects/categories?token=${privateAnnotatorToken}`
    )
  ).data;

export const deleteCategoryAPI = async (projectURL, categoryID) =>
  (
    await client.delete(
      `/management/classification/${projectURL}/category?category_id=${categoryID}`
    )
  ).data;

export const deleteProjectEntryAPI = async (projectURL, entryID) =>
  (await client.delete(`/management/projects/${projectURL}/entries/${entryID}`))
    .data;

export const deleteUnannotatedProjectEntryAPI = async (projectURL, entryID) =>
  (await client.delete(`/management/projects/${projectURL}/import/${entryID}`))
    .data;

export const patchProjectTalkAPI = async (projectURL, talk_markdown) =>
  (
    await client.patch(
      `/management/projects/${projectURL}`,
      JSON.stringify({
        talk_markdown: talk_markdown,
      }),
      // https://stackoverflow.com/questions/51379356/axios-post-request-not-working
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  ).data;
