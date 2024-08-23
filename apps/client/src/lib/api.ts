import axios, { AxiosResponse } from "axios";
import { fetchAuthSession } from "aws-amplify/auth";
import {
  TranslateRequest,
  TranslateResponse,
  GetTranslationsResponse,
  DeleteTranslationResponse,
} from "@cdk-test/types";

const apiURL = "https://api.test.danielcooper.io/translations";

const buildHeaders = async () => {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    if (!token) {
      throw new Error("No token found with which to make request");
    }

    return { headers: { Authorization: `Bearer ${token}` } };
  } catch (e) {
    console.error(e);
  }
};

export const getTranslations = async (): Promise<
  AxiosResponse<GetTranslationsResponse>
> => {
  return axios.get<GetTranslationsResponse>(apiURL, await buildHeaders());
};

export const createTranslation = async (
  input: TranslateRequest
): Promise<AxiosResponse<TranslateResponse>> => {
  return axios.post<TranslateResponse>(apiURL, input, await buildHeaders());
};

export const deleteTranslation = async (
  requestId: string
): Promise<AxiosResponse<DeleteTranslationResponse>> => {
  return await axios.delete<DeleteTranslationResponse>(
    `${apiURL}/${requestId}`,
    await buildHeaders()
  );
};
