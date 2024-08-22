import React, { FC } from "react";

type Props = {
  errors: string[];
};

export const FormErrors: FC<Props> = ({ errors }) => {
  return (
    <div className="flex flex-col text-destructive">
      {errors.map((message, i) => (
        <span key={i} className="block">
          {message}
        </span>
      ))}
    </div>
  );
};
