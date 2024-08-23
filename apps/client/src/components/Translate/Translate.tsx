import { ArrowRightLeft } from "lucide-react";
import { Button, Card, CardContent, Textarea } from "../ui";
import { FormEvent, useState } from "react";
import { LanguageSelector } from "../LanguageSelector";
import { LanguageCode } from "iso-639-1";
import { createTranslation } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { translateRequestSchema } from "@cdk-translator/types";

export const Translate = () => {
  const [sourceLang, setSourceLang] = useState<LanguageCode | undefined>("en");
  const [targetLang, setTargetLang] = useState<LanguageCode | undefined>();
  const [sourceText, setSourceText] = useState("");
  const [resultText, setResultText] = useState("");

  const handleSwitch = () => {
    const prevSourceLang = sourceLang;
    const prevSourceText = sourceText;
    const prevTargetLang = targetLang;
    const prevResultText = resultText;
    setSourceLang(prevTargetLang);
    setTargetLang(prevSourceLang);
    setSourceText(prevResultText);
    setResultText(prevSourceText);
  };

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["createTranslation"],
    mutationFn: createTranslation,
    onSuccess({ data }) {
      setResultText(data.translation);
      queryClient.invalidateQueries({ queryKey: ["translations"] });
      // queryClient.setQueryData(['todo', { id: variables.id }], data) // To do this we need to make sure that the API always responds with the full item
    },
  });

  const handleTranslation = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error, data } = translateRequestSchema.safeParse({
      sourceLang,
      targetLang,
      text: sourceText,
    });

    if (!data && error) {
      // Show some kind of error
      return;
    }

    mutate(data);
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <form onSubmit={handleTranslation} className="flex flex-col gap-4">
          <div className="pt-6 rounded-lg flex gap-4">
            <div className="flex flex-col gap-4">
              <LanguageSelector
                language={sourceLang}
                onLanguageSelect={(lang) => {
                  setSourceLang(lang);
                }}
              />

              <Textarea
                className="resize-none h-48"
                placeholder="Enter text"
                value={sourceText}
                onChange={(e) => {
                  setSourceText(e.target.value);
                }}
              />
            </div>

            <div>
              <Button variant={"ghost"} onClick={handleSwitch}>
                <ArrowRightLeft className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex flex-col gap-4">
              <LanguageSelector
                language={targetLang}
                onLanguageSelect={(lang) => {
                  setTargetLang(lang);
                }}
              />

              <Textarea
                className="resize-none h-48"
                placeholder="Enter text"
                value={resultText}
                onChange={(e) => {
                  setResultText(e.target.value);
                }}
              />
            </div>
          </div>

          <Button
            variant={"default"}
            type="submit"
            disabled={!sourceLang || !sourceText}
          >
            Translate
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
