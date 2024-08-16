import axios, { AxiosError } from "axios";
import { Inter } from "next/font/google";
import { useState } from "react";
import { TranslateRequest, TranslateResponse } from "@cdk-test/types";

const apiURL = "https://api.test.danielcooper.io";

const translate = async (
  input: TranslateRequest
): Promise<
  { success: true; translation: string } | { success: false; message: string }
> => {
  try {
    const res = await axios.post<TranslateResponse>(apiURL, input);

    return {
      success: true,
      translation: res.data.translation,
    };
  } catch (e) {
    const err = e as AxiosError;

    return { success: false, message: err.message };
  }
};

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("es");
  const [sourceText, setSourceText] = useState("");
  const [resultText, setResultText] = useState("");

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <form
        className={`flex flex-col gap-3`}
        onSubmit={async (e) => {
          e.preventDefault();

          const result = await translate({
            sourceLang: sourceLang,
            targetLang: targetLang,
            text: sourceText,
          });

          if (result.success) {
            setResultText(result.translation);
          }
        }}
      >
        <div>
          <label htmlFor="sourceLang" className="block">
            Source Language
          </label>
          <input
            type="text"
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            id="sourceLang"
            className="text-black"
          />
        </div>

        <div>
          <label htmlFor="targetLang" className="block">
            Target Language
          </label>
          <input
            type="text"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            id="targetLang"
            className="text-black"
          />
        </div>

        <div>
          <label htmlFor="sourceText" className="block">
            Source Text
          </label>
          <textarea
            name="sourceText"
            id="sourceText"
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            className="text-black"
          />
        </div>

        <button>Submit</button>
      </form>

      <p className="text-white">{resultText}</p>

      <button
        onClick={async () => {
          const res = await axios.get(apiURL);
          console.log(res.data);
        }}
      >
        Fetch Translations
      </button>
    </main>
  );
}
