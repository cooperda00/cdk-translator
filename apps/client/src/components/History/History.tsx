import React, { FC } from "react";
import { Button } from "../ui";
import { getTranslations } from "@/lib/api";

type Props = {
  className?: string;
};

export const History: FC<Props> = ({ className }) => {
  return (
    <Button
      className={className}
      variant={"link"}
      onClick={async () => {
        const res = await getTranslations();
        console.log(res.data);
      }}
    >
      History
    </Button>
  );
};
