import React, { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const InputGroup: FC<Props> = ({ children }) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">{children}</div>
  );
};
