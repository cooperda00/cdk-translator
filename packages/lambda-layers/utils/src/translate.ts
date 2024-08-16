import * as clientTranslate from "@aws-sdk/client-translate";
import { TranslateRequest } from "@cdk-test/types";

export const translateText = async ({
  sourceLang,
  targetLang,
  text,
}: TranslateRequest): Promise<string> => {
  const translate = new clientTranslate.TranslateClient({});

  const translationResult = await translate.send(
    new clientTranslate.TranslateTextCommand({
      SourceLanguageCode: sourceLang,
      TargetLanguageCode: targetLang,
      Text: text,
    })
  );

  return translationResult.TranslatedText ?? "";
};
