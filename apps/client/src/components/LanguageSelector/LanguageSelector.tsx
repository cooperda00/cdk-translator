import React, { FC } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui";
import languageCodes, { LanguageCode } from "iso-639-1";

type Props = {
  language: LanguageCode | undefined;
  onLanguageSelect: (lang: LanguageCode) => void;
};

export const LanguageSelector: FC<Props> = ({ onLanguageSelect, language }) => {
  return (
    <Select
      value={language}
      onValueChange={(val) => {
        const isValid = languageCodes.validate(val);

        if (isValid) {
          onLanguageSelect(val as LanguageCode);
        }
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>

      <SelectContent>
        {languageCodes.getAllCodes().map((code) => {
          const name = languageCodes.getName(code);

          return (
            <SelectItem value={code} key={code}>
              {name}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
