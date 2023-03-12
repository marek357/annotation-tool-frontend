import { client } from "./client";

export const getCommunityProjectsAPI = async () =>
  (await client.get("/management/projects/list")).data;

export const createCommunityProjectAPI = async (
  projectName,
  projectDescription,
  projectType
) =>
  (
    await client.post(
      "/management/create/",
      JSON.stringify({
        name: projectName,
        description: projectDescription,
        project_type: projectType,
        talk_markdown: "",
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
