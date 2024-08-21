import { useAuthenticator } from "@aws-amplify/ui-react";

export const useIsLoggedIn = () => {
  const { authStatus } = useAuthenticator();
  if (authStatus === "authenticated") return true;
  return false;
};
