import { ArrowRightLeft } from "lucide-react";
import { Button, Card, CardContent, Textarea } from "../ui";
import { FormEvent, useState } from "react";
import { LanguageSelector } from "../LanguageSelector";
import { LanguageCode } from "iso-639-1";
import { createTranslation } from "@/lib/api";

export const Translate = () => {
  const [sourceLang, setSourceLang] = useState<LanguageCode>();
  const [targetLang, setTargetLang] = useState<LanguageCode>();
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

  const handleTranslation = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!sourceLang || !targetLang) {
      return;
    }

    const result = await createTranslation({
      sourceLang: sourceLang,
      targetLang: targetLang,
      text: sourceText,
    });

    if (result.data.translation) {
      setResultText(result.data.translation);
    }
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
