import axios, { AxiosError } from "axios";
import { Inter } from "next/font/google";
import { useState } from "react";
import { TranslateRequest, TranslateResponse } from "@cdk-test/types";
import { fetchAuthSession } from "aws-amplify/auth";
import { ProtectedPage } from "@/components/ProtectedPage";
import { Input } from "@/components/ui";
import { Translate } from "@/components/Translate";

const apiURL = "https://api.test.danielcooper.io/translations";

const translate = async (
  input: TranslateRequest
): Promise<
  { success: true; translation: string } | { success: false; message: string }
> => {
  try {
    const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();

    const res = await axios.post<TranslateResponse>(apiURL, input, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return {
      success: true,
      translation: res.data.translation,
    };
  } catch (e) {
    const err = e as AxiosError;

    return { success: false, message: err.message };
  }
};

const Home = () => {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <Translate />
    </main>
  );
};

export default ProtectedPage(Home);
