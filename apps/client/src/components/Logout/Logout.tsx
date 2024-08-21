import React, { FC } from "react";
import { Button } from "../ui";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/router";

type Props = {
  className?: string;
};

export const Logout: FC<Props> = ({ className }) => {
  const router = useRouter();

  return (
    <Button
      variant={"link"}
      className={className}
      onClick={async () => {
        await signOut();
        router.push("/");
      }}
    >
      Logout
    </Button>
  );
};
