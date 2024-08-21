import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";

export const ProtectedPage = (WrappedComponent: NextPage) => {
  const ProtectedRoute: NextPage = (props) => {
    const router = useRouter();
    const { authStatus } = useAuthenticator();

    useEffect(() => {
      if (authStatus === "unauthenticated") router.push("login");
    }, [authStatus, router]);

    return <WrappedComponent {...props} />;
  };

  return ProtectedRoute;
};
