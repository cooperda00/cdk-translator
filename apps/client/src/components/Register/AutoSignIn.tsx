import { autoSignIn } from "aws-amplify/auth";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";

export const AutoSignIn: FC = () => {
  const router = useRouter();

  useEffect(() => {
    autoSignIn()
      .then(({ nextStep }) => {
        if (nextStep.signInStep === "DONE") {
          router.push("/");
        }
      })
      .catch((e) => console.error(e));
  }, [router]);

  return null;
};
