import axios, { AxiosResponse } from "axios";
import { fetchAuthSession } from "aws-amplify/auth";
import {
  TranslateRequest,
  TranslateResponse,
  GetTranslationsResponse,
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

//   delete<T>(
//     url: string,
//     config?: AxiosRequestConfig
//   ): Promise<AxiosResponse<T>> {
//     return this.instance.delete<T>(url, config);
//   }
